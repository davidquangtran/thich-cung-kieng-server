import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CeremonyMediaService } from './ceremony-media.service';
import { CreateCeremonyMediaDto } from './dto/create-ceremony-media.dto';
import { UpdateCeremonyMediaDto } from './dto/update-ceremony-media.dto';

@Controller('ceremony-media')
export class CeremonyMediaController {
  constructor(private readonly ceremonyMediaService: CeremonyMediaService) {}

  @Post()
  create(@Body() createCeremonyMediaDto: CreateCeremonyMediaDto) {
    return this.ceremonyMediaService.create(createCeremonyMediaDto);
  }

  @Get()
  findAll() {
    return this.ceremonyMediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ceremonyMediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCeremonyMediaDto: UpdateCeremonyMediaDto) {
    return this.ceremonyMediaService.update(+id, updateCeremonyMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ceremonyMediaService.remove(+id);
  }
}
