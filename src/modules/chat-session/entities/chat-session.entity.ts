import { AbstractEntity } from 'src/common/base/entity.base';
import { ChatMessage } from 'src/modules/chat-message/entities/chat-message.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('chat_sessions')
export class ChatSession extends AbstractEntity {
  @OneToMany(() => ChatMessage, (message) => message.session)
  messages: ChatMessage[];
  constructor(partial: Partial<ChatSession>) {
    super();
    Object.assign(this, partial);
  }
}
