import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword, validatePassword } from 'src/utils/base';
import { AuthRepo } from './repository/auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly authRepo: AuthRepo,
  ) {}

  async validateUser({ email, password }: CreateAuthDto) {
    try {
      const findUser = await this.authRepo.findOne({ email });

      if (!findUser) throw new HttpException('Invalid credentials!', 400);
      const decryptPassword = await validatePassword(
        password,
        findUser.password,
      );

      if (decryptPassword) {
        const { password, ...user } = findUser;
        const token = this.jwtService.sign(user);
        return { ...user, token };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async create(registerDto: RegisterAuthDto) {
    try {
      const existingUser = await this.authRepo.findOne({
        email: registerDto.email,
      });
  
      if (existingUser) {
        throw new BadRequestException('Account with these details already exists!');
      }
  
      const password = await hashPassword(registerDto.password);
      registerDto.password = password;
  
      const createdUser = await this.authRepo.create(registerDto);
  
      // Destructure password out, leaving other properties in `user`
      const { password: _, ...user } = createdUser;
  
      const token = this.jwtService.sign(user);
  
      return { ...user, token };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  

  async findAll() {
    let users;
    try {
      users = await this.authRepo.findAll();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    let user;
    try {
      user = await this.authRepo.findOne({ id });
      if (!user) {
        throw new BadRequestException('User not found!');
      }
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    let findUser;
    try {
      findUser = await this.authRepo.findOne({ id });
      if (!findUser) {
        throw new BadRequestException('User not found!');
      }

      Object.assign(findUser, updateAuthDto);

      await this.authRepo.save(findUser);

      const { password, ...user } = findUser;
      return user;
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
