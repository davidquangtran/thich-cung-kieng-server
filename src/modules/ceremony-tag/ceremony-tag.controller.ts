import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CeremonyTagService } from './ceremony-tag.service';
import { CreateCeremonyTagDto } from './dto/create-ceremony-tag.dto';
import { UpdateCeremonyTagDto } from './dto/update-ceremony-tag.dto';

@Controller('ceremony-tag')
export class CeremonyTagController {
  constructor(private readonly ceremonyTagService: CeremonyTagService) {}

  @Post()
  create(@Body() createCeremonyTagDto: CreateCeremonyTagDto) {
    return this.ceremonyTagService.create(createCeremonyTagDto);
  }

  @Get()
  findAll() {
    return this.ceremonyTagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ceremonyTagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCeremonyTagDto: UpdateCeremonyTagDto) {
    return this.ceremonyTagService.update(+id, updateCeremonyTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ceremonyTagService.remove(+id);
  }
}
