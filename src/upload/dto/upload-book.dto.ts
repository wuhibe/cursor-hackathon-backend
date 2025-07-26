import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadBookDto {
  @ApiPropertyOptional({
    description: 'Title of the book',
    example: 'The Great Gatsby',
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Author of the book',
    example: 'F. Scott Fitzgerald',
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  author?: string;

  @ApiPropertyOptional({
    description: 'ID of the user uploading the book',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
