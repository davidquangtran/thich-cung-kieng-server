import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserFavoriteRitualService } from './user-favorite-ritual.service';
import { CreateUserFavoriteRitualDto } from './dto/create-user-favorite-ritual.dto';
import { UpdateUserFavoriteRitualDto } from './dto/update-user-favorite-ritual.dto';
import { FilterUserFavoriteRitualDto } from './dto/filter-user-favorite-ritual.dto';

@Controller('user-favorite-ritual')
export class UserFavoriteRitualController {
  constructor(
    private readonly userFavoriteRitualService: UserFavoriteRitualService,
  ) {}

  @Post()
  create(@Body() createUserFavoriteRitualDto: CreateUserFavoriteRitualDto) {
    return this.userFavoriteRitualService.create(createUserFavoriteRitualDto);
  }

  @Get()
  findAll(@Query() filter: FilterUserFavoriteRitualDto) {
    return this.userFavoriteRitualService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFavoriteRitualService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFavoriteRitualService.remove(id);
  }
}
