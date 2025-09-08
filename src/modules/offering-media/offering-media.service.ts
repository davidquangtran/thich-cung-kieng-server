import { Injectable } from '@nestjs/common';
import { CreateOfferingMediaDto } from './dto/create-offering-media.dto';
import { UpdateOfferingMediaDto } from './dto/update-offering-media.dto';

@Injectable()
export class OfferingMediaService {
  create(createOfferingMediaDto: CreateOfferingMediaDto) {
    return 'This action adds a new offeringMedia';
  }

  findAll() {
    return `This action returns all offeringMedia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offeringMedia`;
  }

  update(id: number, updateOfferingMediaDto: UpdateOfferingMediaDto) {
    return `This action updates a #${id} offeringMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} offeringMedia`;
  }
}
