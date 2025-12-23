import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'admin@seocms.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Администратор' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'admin', enum: ['admin', 'editor', 'author'] })
  @IsOptional()
  @IsIn(['admin', 'editor', 'author'])
  role?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'admin@seocms.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123' })
  @IsString()
  password: string;
}
