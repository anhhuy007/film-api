import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsNumber,
  IsIn,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export class CreateFilmDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsOptional()
  releaseYear?: number;

  @ApiProperty()
  @IsInt()
  languageId: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  originalLanguageId?: number;

  @ApiPropertyOptional({ default: 3 })
  @IsInt()
  @IsOptional()
  rentalDuration?: number;

  @ApiPropertyOptional({ default: 4.99 })
  @IsNumber()
  @IsOptional()
  rentalRate?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  length?: number;

  @ApiPropertyOptional({ default: 19.99 })
  @IsNumber()
  @IsOptional()
  replacementCost?: number;

  @ApiPropertyOptional({ enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'] })
  @IsString()
  @IsOptional()
  @IsIn(['G', 'PG', 'PG-13', 'R', 'NC-17'])
  rating?: string;

  @ApiPropertyOptional({
    type: [String],
    enum: ['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'],
  })
  @IsArray()
  @IsOptional()
  @IsIn(['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'], { each: true })
  specialFeatures?: string[];
}
