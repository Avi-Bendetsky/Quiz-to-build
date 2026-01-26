import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: 'SecureP@ss123' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;

  // Populated by controller, not from request body
  ip?: string;
}
import { IsEmail, IsString, MinLength } from 'class-validator';
