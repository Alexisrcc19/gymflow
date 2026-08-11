import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMemberDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName?: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName?: string;

  @IsDateString({ strict: true })
  @IsOptional()
  birthDate?: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || null : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string | null;
}
