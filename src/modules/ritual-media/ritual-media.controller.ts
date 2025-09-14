import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RitualMediaService } from './ritual-media.service';
import { CreateRitualMediaDto } from './dto/create-ritual-media.dto';
import { UpdateRitualMediaDto } from './dto/update-ritual-media.dto';

@Controller('ritual-media')
export class RitualMediaController {
  constructor(private readonly ritualMediaService: RitualMediaService) {}

  @Post()
  create(@Body() createRitualMediaDto: CreateRitualMediaDto) {
    return this.ritualMediaService.create(createRitualMediaDto);
  }

  @Get()
  findAll() {
    return this.ritualMediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ritualMediaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRitualMediaDto: UpdateRitualMediaDto,
  ) {
    return this.ritualMediaService.update(+id, updateRitualMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ritualMediaService.remove(+id);
  }
}
