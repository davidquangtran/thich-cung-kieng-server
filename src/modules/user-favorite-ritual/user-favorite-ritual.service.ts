import { Injectable } from '@nestjs/common';
import { CreateUserFavoriteRitualDto } from './dto/create-user-favorite-ritual.dto';
import { UpdateUserFavoriteRitualDto } from './dto/update-user-favorite-ritual.dto';

@Injectable()
export class UserFavoriteRitualService {
  create(createUserFavoriteRitualDto: CreateUserFavoriteRitualDto) {
    return 'This action adds a new userFavoriteRitual';
  }

  findAll() {
    return `This action returns all userFavoriteRitual`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userFavoriteRitual`;
  }

  update(id: number, updateUserFavoriteRitualDto: UpdateUserFavoriteRitualDto) {
    return `This action updates a #${id} userFavoriteRitual`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFavoriteRitual`;
  }
}
