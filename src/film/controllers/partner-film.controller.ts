import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { PartnerApiKeyGuard } from "src/auth/guards/parner-api-key.guard";
import { FilmService } from "../film.service";
import { CreateFilmDto } from "../dto/create-film.dto";
import { UpdateFilmDto } from "../dto/update-film.dto";


@UseGuards(PartnerApiKeyGuard)
@Controller('partner/film')
export class PartnetFilmController {
    constructor(private readonly filmService: FilmService) {}

    @Post()
    create(@Body() CreateFilmDto: CreateFilmDto, @Req() request: Request) {
        const clientName = (request as any).client.name;
        console.log(`Film created by partner: ${clientName}`);

        return this.filmService.create(CreateFilmDto);
    }

    @Get()
    findAll() {
        return this.filmService.findAll();
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