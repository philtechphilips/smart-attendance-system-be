import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Period } from '../enums/constants.enum';

export class DateRangeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(Period)
  period?: Period;

  @IsString()
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsString()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsDateString()
  @IsOptional()
  selectedDate?: Date;

  @IsString()
  @IsOptional()
  isCustom?: boolean;
}
