import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisModule } from 'src/shared/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User], 'postgresql'), RedisModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
