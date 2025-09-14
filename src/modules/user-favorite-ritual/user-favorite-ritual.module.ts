import { Module } from '@nestjs/common';
import { UserFavoriteRitualService } from './user-favorite-ritual.service';
import { UserFavoriteRitualController } from './user-favorite-ritual.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/shared/redis/redis.module';
import { UserFavoriteRitual } from './entities/user-favorite-ritual.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserFavoriteRitual], 'postgresql'),
    RedisModule,
  ],
  controllers: [UserFavoriteRitualController],
  providers: [UserFavoriteRitualService],
})
export class UserFavoriteRitualModule {}
