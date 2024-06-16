import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UsePipes, ValidationPipe, HttpException, HttpStatus, UseInterceptors, UploadedFile, BadRequestException, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('login')
  @Public()
  @UsePipes(ValidationPipe)
  // @UseGuards(AuthGuard('local'))
  async login(@Body() authDto: CreateAuthDto) {
    try {
      const response = await this.authService.validateUser(authDto);
      return { success: true, user: response, message: "User logged in!" }
    } catch (error) {
      console.log(error)
    }
  }

  @Post('register')
  @Public()
  @UsePipes(ValidationPipe)
  async create(@Body() registerDto: RegisterAuthDto) {
    try {
      const { password, ...user } = await this.authService.create(registerDto);
      return { success: true, data: user, message: 'Account created successfully!' };
    } catch (error) {
      if (error.status === 400) {
        throw new HttpException({ success: false, message: error.message }, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException({ success: false, message: 'Something went wrong!' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Request() req) {
    return req.user;
  }

  @Get("users")
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
