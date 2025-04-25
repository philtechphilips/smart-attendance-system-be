import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto, ResetPasswordDto } from './dto/register-auth.dto';
import { hashPassword, validatePassword } from 'src/utils/base';
import { AuthRepo } from './repository/auth.repository';
import { EmailService } from 'src/shared/email/email.service';
import * as dotenv from 'dotenv';
import { config } from 'src/shared/config/config.service';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailService: EmailService,
    private readonly authRepo: AuthRepo,
  ) {}

  async validateUser({ email, password }: CreateAuthDto) {
    try {
      console.log(email, password);
      const findUser = await this.authRepo.findOne({ email });

      if (!findUser) throw new HttpException('Invalid credentials!', 400);
      const decryptPassword = await validatePassword(
        password,
        findUser.password,
      );

      console.log(findUser, decryptPassword);

      if (decryptPassword) {
        const { password, ...user } = findUser;
        const token = this.jwtService.sign(user);
        return { ...user, token };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async create(registerDto: RegisterAuthDto) {
    try {
      const existingUser = await this.authRepo.findOne({
        email: registerDto.email,
      });

      if (existingUser) {
        throw new BadRequestException(
          'Account with these details already exists!',
        );
      }

      const password = await hashPassword(registerDto.password);
      registerDto.password = password;

      const createdUser = await this.authRepo.create(registerDto);

      // Destructure password out, leaving other properties in `user`
      const { password: _, ...user } = createdUser;

      const token = this.jwtService.sign(user);

      return { ...user, token };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<boolean> {
    try {
      const user = await this.authRepo.findOne({ email });
      if (!user) {
        throw new BadRequestException('Invalid email address!');
      }

      const token = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: config.JWT_EXPIRES },
      );

      const resetUrl = `${config.FRONTEND_URL}/auth/reset/${token}`;
      const html = `<p>To reset your password, please click on the following URL: <a href="${resetUrl}">${resetUrl}</a></p>`;

      const mailData = {
        recipient: email,
        subject: 'Password Reset',
        html,
      };

      await this.mailService.sendMail(mailData);
      return true;
    } catch (error) {
      throw new BadRequestException(
        'An error occurred while processing the request.',
      );
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<boolean> {
    try {
      const user = await this.jwtService.verify(data.token);

      if (!user) {
        throw new BadRequestException('Token expired!');
      }
      const password = await hashPassword(data.new_password);
      await this.authRepo.findOneAndUpdate({ id: user.userId }, { password });
      return true;
    } catch (error) {
      throw new BadRequestException(
        'An error occurred while processing the request.',
      );
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
