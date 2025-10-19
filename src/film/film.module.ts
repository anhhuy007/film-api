import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { Film } from './entities/film.entity'; 
import { InternalFilmController } from './controllers/internal-film.controller';
import { PartnetFilmController } from './controllers/partner-film.controller';
import { PublicFilmController } from './controllers/public-film.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Film])],
  controllers: [FilmController, InternalFilmController, PartnetFilmController, PublicFilmController],
  providers: [FilmService],
})
export class FilmModule {}
