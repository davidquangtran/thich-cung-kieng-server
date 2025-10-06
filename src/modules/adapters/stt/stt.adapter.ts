import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';

@Injectable()
export class SttAdapter {
  private readonly logger = new Logger(SttAdapter.name);

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async transcribe(audio: Buffer, sttConfig: string): Promise<string> {
    if (!audio) {
      throw new Error('Audio buffer is required');
    }
    if (!sttConfig) {
      throw new Error('STT configuration is required');
    }

    try {
      const apiUrl = this.configService.get<string>(`${sttConfig}.apiUrl`);
      if (!apiUrl) {
        throw new Error('STT API URL not configured');
      }

      // Tạo FormData để upload audio file
      const formData = new FormData();
      formData.append('audio', audio, {
        filename: 'audio.wav',
        contentType: 'audio/wav',
      });

      const res = await firstValueFrom(
        this.http.post(apiUrl, formData, {
          headers: {
            ...formData.getHeaders(),
            Accept: 'application/json',
          },
          timeout: 60000, // 60s timeout cho audio processing
        }),
      );

      // Extract text từ response
      const transcription =
        res.data?.transcription || res.data?.text || res.data?.result || '';

      if (!transcription) {
        this.logger.warn(`No transcription found in response:`, res.data);
        throw new Error('No transcription returned from STT API');
      }

      return transcription;
    } catch (error) {
      this.logger.error(`STT API Error:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`STT API error: ${error.message}`);
    }
  }
}
