import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CeremonyService } from './ceremony.service';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';

@Controller('ceremony')
export class CeremonyController {
  constructor(private readonly ceremonyService: CeremonyService) {}

  @Post()
  create(@Body() createCeremonyDto: CreateCeremonyDto) {
    return this.ceremonyService.create(createCeremonyDto);
  }

  @Get()
  findAll() {
    return this.ceremonyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ceremonyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCeremonyDto: UpdateCeremonyDto) {
    return this.ceremonyService.update(+id, updateCeremonyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ceremonyService.remove(+id);
  }
}
