import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrayerService } from './prayer.service';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { UpdatePrayerDto } from './dto/update-prayer.dto';

@Controller('prayer')
export class PrayerController {
  constructor(private readonly prayerService: PrayerService) {}

  @Post()
  create(@Body() createPrayerDto: CreatePrayerDto) {
    return this.prayerService.create(createPrayerDto);
  }

  @Get()
  findAll() {
    return this.prayerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prayerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrayerDto: UpdatePrayerDto) {
    return this.prayerService.update(+id, updatePrayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prayerService.remove(+id);
  }
}
