import { Injectable } from '@nestjs/common';
import { CreateUserEventOfferingDto } from './dto/create-user_event_offering.dto';
import { UpdateUserEventOfferingDto } from './dto/update-user_event_offering.dto';

@Injectable()
export class UserEventOfferingService {
  create(createUserEventOfferingDto: CreateUserEventOfferingDto) {
    return 'This action adds a new userEventOffering';
  }

  findAll() {
    return `This action returns all userEventOffering`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userEventOffering`;
  }

  update(id: number, updateUserEventOfferingDto: UpdateUserEventOfferingDto) {
    return `This action updates a #${id} userEventOffering`;
  }

  remove(id: number) {
    return `This action removes a #${id} userEventOffering`;
  }
}
