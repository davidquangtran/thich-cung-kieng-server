import { Injectable } from '@nestjs/common';
import { CreateRitualTagDto } from './dto/create-ritual-tag.dto';
import { UpdateRitualTagDto } from './dto/update-ritual-tag.dto';

@Injectable()
export class RitualTagService {
  create(createRitualTagDto: CreateRitualTagDto) {
    return 'This action adds a new ritualTag';
  }

  findAll() {
    return `This action returns all ritualTag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ritualTag`;
  }

  update(id: number, updateRitualTagDto: UpdateRitualTagDto) {
    return `This action updates a #${id} ritualTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} ritualTag`;
  }
}
