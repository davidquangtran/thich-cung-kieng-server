import { Module } from '@nestjs/common';
import { SttModule } from './stt/stt.module';
import { TtsModule } from './tts/tts.module';

@Module({
  imports: [SttModule, TtsModule],
})
export class AdaptersModule {}
