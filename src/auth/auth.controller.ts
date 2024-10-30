import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UsePipes, ValidationPipe, HttpException, HttpStatus, UseInterceptors, UploadedFile, BadRequestException, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ForgotPasswordDto, RegisterAuthDto, ResetPasswordDto } from './dto/register-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorators';
import { Roles } from './decorators/role.decorators';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from './guards/role.guard';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('/login')
  @Public()
  @UseGuards(LocalGuard)
  @UsePipes(ValidationPipe)
  async login(@Body() authDto: CreateAuthDto) {
      const response = await this.authService.validateUser(authDto);
      return response;
  }

  @Post('/create-account')
  @Public()
  @UsePipes(ValidationPipe)
  async create(@Body() registerDto: RegisterAuthDto) {
    try {
      const response = await this.authService.create(registerDto);
      return response;
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException({ success: false, message: error.message }, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException({ success: false, message: 'Something went wrong!' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  @Post('/forgot-password')
  @Public()
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      const response = await this.authService.forgotPassword(body.email);
      return response;
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException({ success: false, message: error.message }, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException({ success: false, message: 'Something went wrong!' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  @Post('/reset-password')
  @Public()
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() data: ResetPasswordDto) {
    console.log(data)
    try {
      const response = await this.authService.resetPassword(data);
      return response;
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException({ success: false, message: error.message }, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException({ success: false, message: 'Something went wrong!' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('/status')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  status(@Request() req) {
    return req.user;
  }

  @Get("/users")
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
