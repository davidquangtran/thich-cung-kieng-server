import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/shared/redis/redis.module';
import { RitualOffering } from './entities/ritual-offering.entity';
import { RitualOfferingController } from './ritual-offering.controller';
import { RitualOfferingService } from './ritual-offering.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RitualOffering], 'postgresql'),
    RedisModule,
  ],
  controllers: [RitualOfferingController],
  providers: [RitualOfferingService],
  exports: [RitualOfferingService],
})
export class OfferingRitualModule {}
