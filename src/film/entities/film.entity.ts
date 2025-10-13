import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('film')
export class Film {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'film_id', unsigned: true })
  filmId: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'year', name: 'release_year', nullable: true })
  releaseYear: number;

  @Column('tinyint', { name: 'language_id', unsigned: true })
  languageId: number;

  @Column('tinyint', {
    name: 'original_language_id',
    unsigned: true,
    nullable: true,
  })
  originalLanguageId: number;

  @Column('tinyint', {
    name: 'rental_duration',
    unsigned: true,
    default: 3,
  })
  rentalDuration: number;

  @Column('decimal', { precision: 4, scale: 2, name: 'rental_rate', default: 4.99 })
  rentalRate: number;

  @Column('smallint', { unsigned: true, nullable: true })
  length: number;

  @Column('decimal', {
    precision: 5,
    scale: 2,
    name: 'replacement_cost',
    default: 19.99,
  })
  replacementCost: number;

  @Column({
    type: 'enum',
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    default: 'G',
  })
  rating: string;

  @Column({
    type: 'set',
    enum: ['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'],
    name: 'special_features',
    nullable: true,
  })
  specialFeatures: string[];

  @UpdateDateColumn({ name: 'last_update' })
  lastUpdate: Date;
}