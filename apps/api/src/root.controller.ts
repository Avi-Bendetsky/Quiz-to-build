import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

interface WelcomeResponse {
    name: string;
    version: string;
    status: string;
    documentation: string;
    endpoints: {
        health: string;
        api: string;
    };
}

@Controller()
@SkipThrottle()
export class RootController {
    @Get()
    root(): WelcomeResponse {
        return {
            name: 'Quiz2Biz API',
            version: '1.0.0',
            status: 'operational',
            documentation: '/api/v1/docs',
            endpoints: {
                health: '/api/v1/health',
                api: '/api/v1',
            },
        };
    }
}
