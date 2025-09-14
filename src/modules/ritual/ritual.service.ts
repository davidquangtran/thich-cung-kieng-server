import { Injectable } from '@nestjs/common';
import { CreateRitualDto } from './dto/create-ritual.dto';
import { UpdateRitualDto } from './dto/update-ritual.dto';

@Injectable()
export class RitualService {
  create(createRitualDto: CreateRitualDto) {
    return 'This action adds a new ritual';
  }

  findAll() {
    return `This action returns all ritual`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ritual`;
  }

  update(id: number, updateRitualDto: UpdateRitualDto) {
    return `This action updates a #${id} ritual`;
  }

  remove(id: number) {
    return `This action removes a #${id} ritual`;
  }
}
