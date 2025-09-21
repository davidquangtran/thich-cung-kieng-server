import { Module } from '@nestjs/common';
import { OfferingRitualService } from './offering-ritual.service';
import { OfferingRitualController } from './offering-ritual.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferingRitual } from './entities/offering-ritual.entity';
import { RedisModule } from 'src/shared/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfferingRitual], 'postgresql'),
    RedisModule,
  ],
  controllers: [OfferingRitualController],
  providers: [OfferingRitualService],
  exports: [OfferingRitualService],
})
export class OfferingRitualModule {}
