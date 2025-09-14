import { Injectable } from '@nestjs/common';
import { CreateRitualReviewDto } from './dto/create-ritual-review.dto';
import { UpdateRitualReviewDto } from './dto/update-ritual-review.dto';

@Injectable()
export class RitualReviewService {
  create(createRitualReviewDto: CreateRitualReviewDto) {
    return 'This action adds a new ritualReview';
  }

  findAll() {
    return `This action returns all ritualReview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ritualReview`;
  }

  update(id: number, updateRitualReviewDto: UpdateRitualReviewDto) {
    return `This action updates a #${id} ritualReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} ritualReview`;
  }
}
