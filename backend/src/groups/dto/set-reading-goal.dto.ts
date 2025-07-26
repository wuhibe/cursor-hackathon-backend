import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetReadingGoalDto {
  @ApiProperty({
    description: 'ID of the book for the reading goal',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({
    description: 'Number of pages to read per day',
    example: 20,
    minimum: 1,
    maximum: 1000,
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  dailyPages: number;

  @ApiProperty({
    description: 'Start date for the reading goal (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date for the reading goal (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsDateString()
  endDate: string;
}
