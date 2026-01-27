import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisHost = this.configService.get<string>('redis.host', 'localhost');
    const redisPort = this.configService.get<number>('redis.port', 6379);
    const redisPassword = this.configService.get<string>('redis.password');
    // Azure Redis Cache requires TLS on port 6380
    const useTls = redisPort === 6380 || this.configService.get<boolean>('redis.tls', false);

    this.logger.log(`Initializing Redis client - Host: ${redisHost}, Port: ${redisPort}, TLS: ${useTls}`);

    this.client = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword || undefined,
      tls: useTls ? {} : undefined,
      lazyConnect: true, // Don't block app startup
      retryStrategy: (times: number) => {
        if (times > 10) {
          this.logger.error('Redis: Max retries exceeded, giving up');
          return null; // Stop retrying
        }
        const delay = Math.min(times * 100, 3000);
        this.logger.warn(`Redis: Retry attempt ${times}, waiting ${delay}ms`);
        return delay;
      },
      connectTimeout: 15000,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connection established');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready to accept commands');
    });

    this.client.on('error', (error: Error) => {
      this.logger.error(`Redis error: ${error.message}`);
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
    });

    // Connect asynchronously - don't block app startup
    this.client.connect().catch((err: Error) => {
      this.logger.error(`Redis initial connection failed: ${err.message}`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Closing Redis connection...');
    await this.client.quit();
    this.logger.log('Redis connection closed');
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.client.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hdel(key: string, field: string): Promise<void> {
    await this.client.hdel(key, field);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async flushdb(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('flushdb can only be used in test environment');
    }
    await this.client.flushdb();
  }
}
