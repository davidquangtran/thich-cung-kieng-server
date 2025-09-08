import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('mail.host', 'smtp.gmail.com'),
          port: config.get<number>('mail.port'),
          secure: false,
          auth: {
            user: config.get<string>('mail.user'),
            pass: config.get<string>('mail.pass'),
          },
        },
        defaults: {
          from: `"ThichCungKieng" <${config.get('mail.from', 'noreply@thichcungkieng.com')}>`,
        },
        template: {
          dir: process.env.NODE_ENV === 'production' 
            ? join(__dirname, 'templates')
            : join(process.cwd(), 'src', 'shared', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
