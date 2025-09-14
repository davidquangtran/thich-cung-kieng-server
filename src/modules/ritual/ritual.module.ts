import { Module } from '@nestjs/common';
import { RitualService } from './ritual.service';
import { RitualController } from './ritual.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ritual } from './entities/ritual.entity';
import { RedisModule } from 'src/shared/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ritual], 'postgresql'), RedisModule],
  controllers: [RitualController],
  providers: [RitualService],
})
export class RitualModule {}
