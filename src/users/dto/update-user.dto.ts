import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Username for the user',
    example: 'john_doe',
    minLength: 3,
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @ApiPropertyOptional({
    description: 'User biography',
    example: 'Book lover and avid reader',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({
    description: 'Profile image URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'Profile image URL (alternative field)',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
