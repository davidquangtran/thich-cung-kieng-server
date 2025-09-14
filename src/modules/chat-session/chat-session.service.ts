import { Injectable } from '@nestjs/common';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/shared/redis/redis.service';
import { BaseService } from 'src/common/base/service/service.base';

@Injectable()
export class ChatSessionService extends BaseService<ChatSession> {
  constructor(
    @InjectRepository(ChatSession, 'postgresql')
    private readonly chatSessionRepository: Repository<ChatSession>,
    private readonly redisService: RedisService,
  ) {
    super(chatSessionRepository, redisService);
  }

  protected getDuplicateFields(): string[] {
    return ['userId'];
  }

  protected getDefaultRelations(): string[] {
    return ['user', 'messages'];
  }

  protected getSearchableFields(): string[] {
    return ['id'];
  }
}
