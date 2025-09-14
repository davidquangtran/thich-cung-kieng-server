import { IsEnum, IsString, IsUUID, IsOptional } from 'class-validator';
import { ChatMessageSender } from 'src/common/enums/chat-message.enum';

export class CreateChatMessageDto {
  @IsEnum(ChatMessageSender)
  sender: ChatMessageSender;

  @IsString()
  content: string;

  @IsUUID()
  sessionId: string;
}
