// src/stream/stream.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { StreamService } from 'src/attendances/services/stream.service'; // Adjust the path as needed
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly streamService: StreamService) {}

  @WebSocketServer() server: Server;
  private rooms: Map<string, { broadcaster: string; viewers: Set<string> }> =
    new Map();
  private socketToRoom: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const roomId = this.socketToRoom.get(client.id);
    if (!roomId) return;

    this.socketToRoom.delete(client.id);
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (client.id === room.broadcaster) {
      // Broadcaster disconnected
      this.server.to(roomId).emit('broadcaster-disconnected');
      this.rooms.delete(roomId);

      // Delete the stream from the database
      this.streamService.deleteStreamByRoomId(roomId).catch((error) => {
        console.error(`Failed to delete stream for roomId ${roomId}:`, error);
      });
    } else {
      // Viewer disconnected
      room.viewers.delete(client.id);
      client.to(roomId).emit('viewer-disconnected', client.id);
    }
  }

  @SubscribeMessage('create-room')
  handleCreateRoom(client: Socket) {
    const roomId = uuidv4();
    this.rooms.set(roomId, { broadcaster: client.id, viewers: new Set() });
    this.socketToRoom.set(client.id, roomId);
    client.join(roomId);
    client.emit('room-created', roomId);
    console.log(roomId);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      client.emit('invalid-room');
      return;
    }

    this.socketToRoom.set(client.id, roomId);
    room.viewers.add(client.id);
    client.join(roomId);
    client.emit('room-joined', roomId);

    // Notify broadcaster about new viewer
    client.to(room.broadcaster).emit('new-viewer', client.id);
  }

  @SubscribeMessage('offer')
  handleOffer(
    client: Socket,
    payload: { target: string; offer: RTCSessionDescriptionInit },
  ) {
    client
      .to(payload.target)
      .emit('offer', { sender: client.id, offer: payload.offer });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    client: Socket,
    payload: { target: string; answer: RTCSessionDescriptionInit },
  ) {
    client
      .to(payload.target)
      .emit('answer', { sender: client.id, answer: payload.answer });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    client: Socket,
    payload: { target: string; candidate: RTCIceCandidate },
  ) {
    client.to(payload.target).emit('ice-candidate', {
      sender: client.id,
      candidate: payload.candidate,
    });
  }
}
