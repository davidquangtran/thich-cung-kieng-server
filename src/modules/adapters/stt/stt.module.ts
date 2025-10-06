import { Module } from '@nestjs/common';
import { SttService } from './stt.service';
import { SttAdapter } from './stt.adapter';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [SttService, SttAdapter],
  exports: [SttService, SttAdapter],
})
export class SttModule { }
