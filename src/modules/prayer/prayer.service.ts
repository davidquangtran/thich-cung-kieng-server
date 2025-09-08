import { Injectable } from '@nestjs/common';
import { CreatePrayerDto } from './dto/create-prayer.dto';
import { UpdatePrayerDto } from './dto/update-prayer.dto';

@Injectable()
export class PrayerService {
  create(createPrayerDto: CreatePrayerDto) {
    return 'This action adds a new prayer';
  }

  findAll() {
    return `This action returns all prayer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prayer`;
  }

  update(id: number, updatePrayerDto: UpdatePrayerDto) {
    return `This action updates a #${id} prayer`;
  }

  remove(id: number) {
    return `This action removes a #${id} prayer`;
  }
}
