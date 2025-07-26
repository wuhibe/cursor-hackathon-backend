import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Updated content of the post',
    example: 'This is an amazing book! Highly recommended.',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}
