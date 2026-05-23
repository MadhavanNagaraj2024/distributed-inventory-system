import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  public client;

  async onModuleInit() {
    this.client = createClient({
      url: 'redis://localhost:6379',
    });

    await this.client.connect();
    console.log('Redis Connected');
  }
}
