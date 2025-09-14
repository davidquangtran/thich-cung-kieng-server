import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserFavoriteRitualService } from './user-favorite-ritual.service';
import { CreateUserFavoriteRitualDto } from './dto/create-user-favorite-ritual.dto';
import { UpdateUserFavoriteRitualDto } from './dto/update-user-favorite-ritual.dto';

@Controller('user-favorite-ritual')
export class UserFavoriteRitualController {
  constructor(private readonly userFavoriteRitualService: UserFavoriteRitualService) {}

  @Post()
  create(@Body() createUserFavoriteRitualDto: CreateUserFavoriteRitualDto) {
    return this.userFavoriteRitualService.create(createUserFavoriteRitualDto);
  }

  @Get()
  findAll() {
    return this.userFavoriteRitualService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFavoriteRitualService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserFavoriteRitualDto: UpdateUserFavoriteRitualDto) {
    return this.userFavoriteRitualService.update(+id, updateUserFavoriteRitualDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFavoriteRitualService.remove(+id);
  }
}
