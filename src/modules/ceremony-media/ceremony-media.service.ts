import { Injectable } from '@nestjs/common';
import { CreateCeremonyMediaDto } from './dto/create-ceremony-media.dto';
import { UpdateCeremonyMediaDto } from './dto/update-ceremony-media.dto';

@Injectable()
export class CeremonyMediaService {
  create(createCeremonyMediaDto: CreateCeremonyMediaDto) {
    return 'This action adds a new ceremonyMedia';
  }

  findAll() {
    return `This action returns all ceremonyMedia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ceremonyMedia`;
  }

  update(id: number, updateCeremonyMediaDto: UpdateCeremonyMediaDto) {
    return `This action updates a #${id} ceremonyMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} ceremonyMedia`;
  }
}
