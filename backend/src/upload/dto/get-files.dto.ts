import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetFilesDto {
  @ApiPropertyOptional({
    description: 'Bucket name to list files from',
    example: 'books',
    enum: ['books', 'avatars', 'temp'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['books', 'avatars', 'temp'])
  bucket?: string = 'books';

  @ApiPropertyOptional({
    description: 'ID of the user to get files for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
