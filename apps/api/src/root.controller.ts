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
    <title>Quiz2Biz - Intelligent Business Questionnaire Platform</title>
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
            padding: 20px;
        }
        .nav {
            background: rgba(255, 255, 255, 0.95);
            padding: 15px 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 1.8em;
            font-weight: 700;
            color: #667eea;
        }
        .nav-buttons {
            display: flex;
            gap: 15px;
        }
        .btn {
            padding: 10px 25px;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .btn-primary {
            background: #667eea;
            color: white;
        }
        .btn-primary:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102,126,234,0.4);
        }
        .btn-secondary {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
        }
        .btn-secondary:hover {
            background: #667eea;
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .hero {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 60px;
            text-align: center;
            margin-bottom: 40px;
        }
        .hero h1 {
            color: #667eea;
            font-size: 3.5em;
            margin-bottom: 20px;
        }
        .hero p {
            color: #666;
            font-size: 1.3em;
            margin-bottom: 40px;
            line-height: 1.6;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        .feature-card {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-10px);
        }
        .feature-icon {
            font-size: 3em;
            margin-bottom: 20px;
        }
        .feature-card h3 {
            color: #333;
            font-size: 1.5em;
            margin-bottom: 15px;
        }
        .feature-card p {
            color: #666;
            line-height: 1.6;
        }
        .cta-section {
            background: white;
            border-radius: 20px;
            padding: 50px;
            text-align: center;
            margin-top: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .cta-section h2 {
            color: #333;
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        .cta-section p {
            color: #666;
            font-size: 1.2em;
            margin-bottom: 30px;
        }
        .btn-large {
            font-size: 1.2em;
            padding: 15px 40px;
        }
        .status-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 20px;
            border-radius: 50px;
            font-weight: 600;
            margin-bottom: 20px;
            font-size: 0.9em;
        }
        .status-badge::before {
            content: "●";
            margin-right: 8px;
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .footer {
            text-align: center;
            padding: 30px;
            color: rgba(255, 255, 255, 0.9);
            margin-top: 40px;
        }
        .footer a {
            color: white;
            text-decoration: none;
            margin: 0 15px;
            transition: opacity 0.3s ease;
        }
        .footer a:hover {
            opacity: 0.7;
        }
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5em;
            }
            .hero, .cta-section {
                padding: 40px 30px;
            }
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav class="nav">
        <div class="logo">Quiz2Biz</div>
        <div class="nav-buttons">
            <a href="/login" class="btn btn-secondary">Login</a>
            <a href="/register" class="btn btn-primary">Get Started</a>
        </div>
    </nav>

    <div class="container">
        <div class="hero">
            <div class="status-badge">Platform Operational</div>
            <h1>Transform Your Business</h1>
            <p>Intelligent questionnaires that adapt to your needs. Generate professional documents, ensure compliance, and accelerate your business growth.</p>
            <a href="/register" class="btn btn-primary btn-large">Start Your Journey</a>
        </div>

        <div class="features">
            <div class="feature-card">
                <div class="feature-icon">📋</div>
                <h3>Adaptive Questionnaires</h3>
                <p>Smart questions that adapt based on your responses. Industry-specific templates for manufacturing, healthcare, technology, and more.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">📄</div>
                <h3>Document Generation</h3>
                <p>Automatically generate business plans, compliance documents, and professional reports. Download securely with one click.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3>Secure & Compliant</h3>
                <p>Enterprise-grade security with ISO standards integration. Your data is encrypted and protected at all times.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3>Progress Tracking</h3>
                <p>Save and resume anytime. Track completion progress and manage multiple questionnaire sessions seamlessly.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3>AI-Powered Insights</h3>
                <p>Get intelligent recommendations and best practices based on your industry and business type.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3>Admin Dashboard</h3>
                <p>Comprehensive management portal for reviewing submissions, analytics, and user administration.</p>
            </div>
        </div>

        <div class="cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Join businesses worldwide using Quiz2Biz to streamline their operations</p>
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <a href="/register" class="btn btn-primary btn-large">Create Account</a>
                <a href="/api/v1/docs" class="btn btn-secondary btn-large">View API Docs</a>
            </div>
        </div>
    </div>

    <div class="footer">
        <div>
            <a href="/api/v1/health">System Status</a>
            <a href="/api/v1/docs">API Documentation</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
        </div>
        <p style="margin-top: 15px; font-size: 0.9em;">© 2026 Quiz2Biz - Version 1.0.0</p>
    </div>
</body>
</html>
        `);
    }
}
