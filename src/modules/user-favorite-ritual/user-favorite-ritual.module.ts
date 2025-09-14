import { Module } from '@nestjs/common';
import { UserFavoriteRitualService } from './user-favorite-ritual.service';
import { UserFavoriteRitualController } from './user-favorite-ritual.controller';

@Module({
  controllers: [UserFavoriteRitualController],
  providers: [UserFavoriteRitualService],
})
export class UserFavoriteRitualModule {}
