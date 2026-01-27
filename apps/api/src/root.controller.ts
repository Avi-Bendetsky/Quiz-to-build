import { Controller, Get, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';

@Controller()
@SkipThrottle()
export class RootController {
    @Get()
    root(@Res() res: Response): void {
        res.setHeader('Content-Type', 'text/html');
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz2Biz - Transform Your Business Knowledge</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
            padding: 60px 40px;
            text-align: center;
        }
        h1 {
            color: #667eea;
            font-size: 3em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .tagline {
            color: #666;
            font-size: 1.2em;
            margin-bottom: 40px;
        }
        .status {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: 600;
            margin-bottom: 30px;
        }
        .status::before {
            content: "●";
            margin-right: 8px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .info {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 30px;
            margin-top: 30px;
        }
        .info h2 {
            color: #333;
            font-size: 1.2em;
            margin-bottom: 20px;
        }
        .links {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .links a {
            color: #667eea;
            text-decoration: none;
            padding: 12px;
            background: white;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        .links a:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102,126,234,0.3);
        }
        .version {
            margin-top: 30px;
            color: #999;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Quiz2Biz</h1>
        <p class="tagline">Transform Your Business Knowledge</p>
        <div class="status">API Operational</div>
        <p>Welcome to Quiz2Biz API - Your intelligent business questionnaire platform</p>
        
        <div class="info">
            <h2>Quick Links</h2>
            <div class="links">
                <a href="/api/v1/health">API Health Status</a>
                <a href="/api/v1/docs">API Documentation</a>
            </div>
        </div>
        
        <div class="version">Version 1.0.0</div>
    </div>
</body>
</html>
        `);
    }
}
