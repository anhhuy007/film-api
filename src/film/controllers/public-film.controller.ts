import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { FilmService } from "../film.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateFilmDto } from "../dto/create-film.dto";
import type { Request } from "express";
import { UpdateFilmDto } from "../dto/update-film.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/role.decorator";
import { Role } from "src/auth/enum/role.enum";


@Controller('public/film')
export class PublicFilmController {
    constructor(private readonly filmService: FilmService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.ADMIN)
    create(@Body() createFilmDto: CreateFilmDto, @Req() request: Request) {
        const user = request.user;
        console.log(`Film created by user: `, user);

        return this.filmService.create(createFilmDto)
    }

    @Get()
    findAll() {
        return this.filmService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.filmService.findOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateFilmDto: UpdateFilmDto) {
        return this.filmService.update(id, updateFilmDto)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.filmService.remove(id)
    }
}