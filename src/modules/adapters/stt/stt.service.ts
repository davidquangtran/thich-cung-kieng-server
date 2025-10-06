import { Injectable } from '@nestjs/common';
import { SttAdapter } from './stt.adapter';

@Injectable()
export class SttService {
  constructor(private readonly sttAdapter: SttAdapter) {}
  async getTranscription(audio: Buffer, config: any): Promise<string> {
    return this.sttAdapter.transcribe(audio, config);
  }
}
