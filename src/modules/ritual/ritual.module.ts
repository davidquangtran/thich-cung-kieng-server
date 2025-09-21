import { Module } from '@nestjs/common';
import { RitualService } from './ritual.service';
import { RitualController } from './ritual.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ritual } from './entities/ritual.entity';
import { RedisModule } from 'src/shared/redis/redis.module';
import { RitualMediaModule } from '../ritual-media/ritual-media.module';
import { RitualTagModule } from '../ritual-tag/ritual-tag.module';
import { OfferingRitualModule } from '../ritual-offering/ritual-offering.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ritual], 'postgresql'),
    RedisModule,
    OfferingRitualModule,
    RitualMediaModule,
    RitualTagModule,
  ],
  controllers: [RitualController],
  providers: [RitualService],
})
export class RitualModule {}
