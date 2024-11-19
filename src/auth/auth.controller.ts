import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guard';
import {
  ForgotPasswordDto,
  RegisterAuthDto,
  ResetPasswordDto,
} from './dto/register-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorators';
import { Roles } from './decorators/role.decorators';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from './guards/role.guard';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { CustomValidationPipe } from 'src/shared/utils/instances';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const user = await this.authService.create(registerDto);
    return user;
  }

  @Post('/forgot-password')
  @Public()
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const response = await this.authService.forgotPassword(body.email);
    return response;
  }

  @Post('/reset-password')
  @Public()
  @UsePipes(ValidationPipe)
  async resetPassword(@Body() data: ResetPasswordDto) {
    const response = await this.authService.resetPassword(data);
    return response;
  }

  @Get('/users')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.HOD)
  findAll(@Query(CustomValidationPipe) pagination: PaginationDto) {
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
