import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from 'src/common/enums/user.enum';

export class RegisterReqDto {
  @ApiProperty({
    example: 'thichcungkieng@gmail.com',
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '1990-01-01', description: 'Birthday of the user' })
  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the user',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    default: UserRole.USER,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid user role' })
  role?: UserRole = UserRole.USER;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL of the user',
  })
  @IsString()
  profilePicture: string;

  constructor(partial: Partial<RegisterReqDto>) {
    Object.assign(this, partial);
  }
}
