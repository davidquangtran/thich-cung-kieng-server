import { Injectable } from '@nestjs/common';
import { CreateRitualMediaDto } from './dto/create-ritual-media.dto';
import { UpdateRitualMediaDto } from './dto/update-ritual-media.dto';

@Injectable()
export class RitualMediaService {
  create(createRitualMediaDto: CreateRitualMediaDto) {
    return 'This action adds a new ritualMedia';
  }

  findAll() {
    return `This action returns all ritualMedia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ritualMedia`;
  }

  update(id: number, updateRitualMediaDto: UpdateRitualMediaDto) {
    return `This action updates a #${id} ritualMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} ritualMedia`;
  }
}
