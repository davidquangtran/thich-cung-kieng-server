import { Injectable } from '@nestjs/common';
import { CreateOfferingDto } from './dto/create-offering.dto';
import { UpdateOfferingDto } from './dto/update-offering.dto';

@Injectable()
export class OfferingService {
  create(createOfferingDto: CreateOfferingDto) {
    return 'This action adds a new offering';
  }

  findAll() {
    return `This action returns all offering`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offering`;
  }

  update(id: number, updateOfferingDto: UpdateOfferingDto) {
    return `This action updates a #${id} offering`;
  }

  remove(id: number) {
    return `This action removes a #${id} offering`;
  }
}
