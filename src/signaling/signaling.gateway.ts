import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private peers: Record<string, string[]> = {};
  private server: Server;

  handleConnection(client: Socket) {
    console.log('A user connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('A user disconnected:', client.id);
    for (const room in this.peers) {
      this.peers[room] = this.peers[room].filter((id) => id !== client.id);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`User ${client.id} joined room ${room}`);
    client.join(room);

    if (!this.peers[room]) this.peers[room] = [];
    this.peers[room].push(client.id);

    client.to(room).emit('request-stream', { requester: client.id });
  }

  @SubscribeMessage('offer')
  handleOffer(
    @MessageBody() data: { offer: any; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { offer, room } = data;
    console.log(`Received offer for room ${room}`);

    if (!this.peers[room]) this.peers[room] = [];
    if (!this.peers[room].includes(client.id)) {
      this.peers[room].push(client.id);
    }

    client.to(room).emit('offer', { offer, sender: client.id });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @MessageBody() data: { answer: any; sender: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Received answer from ${client.id} to ${data.sender}`);
    client.to(data.sender).emit('answer', { answer: data.answer });
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @MessageBody() data: { candidate: any; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Received ICE candidate for room ${data.room}`);
    client.to(data.room).emit('ice-candidate', { candidate: data.candidate });
  }
}
