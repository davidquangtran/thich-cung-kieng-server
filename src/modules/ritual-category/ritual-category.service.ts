import { Injectable } from '@nestjs/common';
import { CreateRitualCategoryDto } from './dto/create-ritual-category.dto';
import { UpdateRitualCategoryDto } from './dto/update-ritual-category.dto';

@Injectable()
export class RitualCategoryService {
  create(createRitualCategoryDto: CreateRitualCategoryDto) {
    return 'This action adds a new ritualCategory';
  }

  findAll() {
    return `This action returns all ritualCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ritualCategory`;
  }

  update(id: number, updateRitualCategoryDto: UpdateRitualCategoryDto) {
    return `This action updates a #${id} ritualCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} ritualCategory`;
  }
}
