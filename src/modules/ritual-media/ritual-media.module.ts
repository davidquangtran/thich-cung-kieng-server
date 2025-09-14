import { Module } from '@nestjs/common';
import { RitualMediaService } from './ritual-media.service';
import { RitualMediaController } from './ritual-media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RitualMedia } from './entities/ritual-media.entity';
import { RedisModule } from 'src/shared/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([RitualMedia], 'postgresql'), RedisModule],
  controllers: [RitualMediaController],
  providers: [RitualMediaService],
})
export class RitualMediaModule {}
