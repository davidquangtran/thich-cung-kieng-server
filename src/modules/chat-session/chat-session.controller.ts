import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ChatSessionService } from './chat-session.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { FilterChatSessionDto } from './dto/filter-chat-session.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Public()
@Controller('chat-session')
export class ChatSessionController {
  constructor(private readonly chatSessionService: ChatSessionService) {}

  @Post()
  create(@Body() createChatSessionDto: CreateChatSessionDto) {
    return this.chatSessionService.create(createChatSessionDto);
  }

  @Get()
  findAll(@Query() filter: FilterChatSessionDto) {
    return this.chatSessionService.findAll(filter, [], []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatSessionService.findOne(id);
  }

  @Get('me')
  findByMe(@GetUser('id') id: string) {
    return this.chatSessionService.findByOptions({ userId: id });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatSessionService.remove(id);
  }
}
