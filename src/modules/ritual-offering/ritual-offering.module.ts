import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/shared/redis/redis.module';
import { RitualOffering } from './entities/ritual-offering.entity';
import { RitualOfferingService } from './ritual-offering.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RitualOffering], 'postgresql'),
    RedisModule,
  ],
  providers: [RitualOfferingService],
  exports: [RitualOfferingService],
})
export class OfferingRitualModule {}
