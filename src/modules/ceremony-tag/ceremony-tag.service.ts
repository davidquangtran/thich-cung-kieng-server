import { Injectable } from '@nestjs/common';
import { CreateCeremonyTagDto } from './dto/create-ceremony-tag.dto';
import { UpdateCeremonyTagDto } from './dto/update-ceremony-tag.dto';

@Injectable()
export class CeremonyTagService {
  create(createCeremonyTagDto: CreateCeremonyTagDto) {
    return 'This action adds a new ceremonyTag';
  }

  findAll() {
    return `This action returns all ceremonyTag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ceremonyTag`;
  }

  update(id: number, updateCeremonyTagDto: UpdateCeremonyTagDto) {
    return `This action updates a #${id} ceremonyTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} ceremonyTag`;
  }
}
