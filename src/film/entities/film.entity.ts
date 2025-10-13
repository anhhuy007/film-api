import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('film')
export class Film {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'film_id', unsigned: true })
  filmId: number;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  title: string;

  @ApiProperty({ required: false })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({ required: false })
  @Column({ type: 'year', name: 'release_year', nullable: true })
  releaseYear: number;

  @ApiProperty()
  @Column('tinyint', { name: 'language_id', unsigned: true })
  languageId: number;

  @ApiProperty({ required: false })
  @Column('tinyint', {
    name: 'original_language_id',
    unsigned: true,
    nullable: true,
  })
  originalLanguageId: number;

  @ApiProperty({ default: 3 })
  @Column('tinyint', {
    name: 'rental_duration',
    unsigned: true,
    default: 3,
  })
  rentalDuration: number;

  @ApiProperty({ default: 4.99 })
  @Column('decimal', { precision: 4, scale: 2, name: 'rental_rate', default: 4.99 })
  rentalRate: number;

  @ApiProperty({ required: false })
  @Column('smallint', { unsigned: true, nullable: true })
  length: number;

  @ApiProperty({ default: 19.99 })
  @Column('decimal', {
    precision: 5,
    scale: 2,
    name: 'replacement_cost',
    default: 19.99,
  })
  replacementCost: number;

  @ApiProperty({ enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'], default: 'G' })
  @Column({
    type: 'enum',
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    default: 'G',
  })
  rating: string;

  @ApiProperty({
    required: false,
    type: [String],
    enum: ['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'],
  })
  @Column({
    type: 'set',
    enum: ['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'],
    name: 'special_features',
    nullable: true,
  })
  specialFeatures: string[];

  @ApiProperty()
  @UpdateDateColumn({ name: 'last_update' })
  lastUpdate: Date;
}
