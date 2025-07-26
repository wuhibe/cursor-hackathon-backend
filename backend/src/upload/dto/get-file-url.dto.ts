import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetFileUrlDto {
  @ApiPropertyOptional({
    description: 'Expiry time in hours for the presigned URL',
    example: 24,
    minimum: 1,
    maximum: 168, // 1 week
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(168)
  expiry?: number = 24;
}
