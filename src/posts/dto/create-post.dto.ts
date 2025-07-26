import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Content of the post',
    example: 'This is an amazing book! Highly recommended.',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  content: string;

  @ApiPropertyOptional({
    description: 'ID of the book this post is about',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  bookId?: string;

  @ApiProperty({
    description: 'ID of the user who created the post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
