import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const CustomValidationPipe = new ValidationPipe({
  exceptionFactory: (errors) => new BadRequestException(errors),
});
