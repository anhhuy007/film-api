import { IsString, IsNotEmpty, IsInt, IsOptional, IsNumber, IsIn, IsArray } from 'class-validator';

export class CreateFilmDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  releaseYear?: number;

  @IsInt()
  languageId: number;

  @IsNumber()
  @IsOptional()
  rentalRate?: number;

  @IsInt()
  @IsOptional()
  length?: number;

  @IsNumber()
  @IsOptional()
  replacementCost?: number;

  @IsString()
  @IsOptional()
  @IsIn(['G', 'PG', 'PG-13', 'R', 'NC-17'])
  rating?: string;

  @IsArray()
  @IsOptional()
  @IsIn(['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'], { each: true })
  specialFeatures?: string[];
}