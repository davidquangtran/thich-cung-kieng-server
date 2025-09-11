import { Injectable } from '@nestjs/common';
import { CreateUserEventDto } from './dto/create-user-event.dto';
import { UpdateUserEventDto } from './dto/update-user-event.dto';

@Injectable()
export class UserEventService {
  create(createUserEventDto: CreateUserEventDto) {
    return 'This action adds a new userEvent';
  }

  findAll() {
    return `This action returns all userEvent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userEvent`;
  }

  update(id: number, updateUserEventDto: UpdateUserEventDto) {
    return `This action updates a #${id} userEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} userEvent`;
  }
}
