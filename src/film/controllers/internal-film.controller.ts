import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from "@nestjs/common";
import { FilmService } from "../film.service";
import { CreateFilmDto } from "../dto/create-film.dto";
import { UpdateFilmDto } from "../dto/update-film.dto";
import { InternalApiKeyGuard } from "src/auth/guards/internal-api-key.guard";

@UseGuards(InternalApiKeyGuard)
@Controller('internal/film')
export class InternalFilmController {
    constructor(private readonly filmService: FilmService) {}

    @Post()
    create(@Body() CreateFilmDto: CreateFilmDto) {
        return this.filmService.create(CreateFilmDto)
    }

    @Get()
    findAll() {
        return this.filmService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.filmService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateFilmDto: UpdateFilmDto) {
        return this.filmService.update(id, updateFilmDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.filmService.remove(id);
    }
}