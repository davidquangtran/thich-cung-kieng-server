import { Module } from '@nestjs/common';
import { OfferingService } from './offering.service';
import { OfferingController } from './offering.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offering } from './entities/offering.entity';
import { RedisModule } from 'src/shared/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offering], 'postgresql'), RedisModule],
  controllers: [OfferingController],
  providers: [OfferingService],
})
export class OfferingModule {}
