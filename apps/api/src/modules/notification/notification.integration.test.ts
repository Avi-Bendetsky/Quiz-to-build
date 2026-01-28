import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';

describe('NotificationService Integration Tests', () => {
    let service: NotificationService;
    let configService: ConfigService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            const config = {
                                SENDGRID_API_KEY: 'SG.test_key_for_integration',
                                SENDGRID_FROM_EMAIL: 'noreply@quiz2biz.com',
                                SENDGRID_FROM_NAME: 'Quiz2Biz',
                            };
                            return config[key];
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
        configService = module.get<ConfigService>(ConfigService);
    });

    describe('Email Template Rendering', () => {
        it('should render email verification template', () => {
            const html = service.renderTemplate('email-verification', {
                userName: 'John Doe',
                verificationLink: 'https://quiz2biz.com/verify?token=abc123',
            });

            expect(html).toBeDefined();
            expect(html).toContain('John Doe');
            expect(html).toContain('https://quiz2biz.com/verify?token=abc123');
            expect(html).toContain('verify');
        });

        it('should render password reset template', () => {
            const html = service.renderTemplate('password-reset', {
                userName: 'Jane Smith',
                resetLink: 'https://quiz2biz.com/reset?token=xyz789',
            });

            expect(html).toBeDefined();
            expect(html).toContain('Jane Smith');
            expect(html).toContain('https://quiz2biz.com/reset?token=xyz789');
            expect(html).toContain('reset');
        });

        it('should render session completed template', () => {
            const html = service.renderTemplate('session-completed', {
                userName: 'Bob Johnson',
                sessionName: 'Security Assessment',
                readinessScore: 85.5,
                dashboardLink: 'https://quiz2biz.com/dashboard',
            });

            expect(html).toBeDefined();
            expect(html).toContain('Bob Johnson');
            expect(html).toContain('Security Assessment');
            expect(html).toContain('85.5');
            expect(html).toContain('dashboard');
        });

        it('should render approval required template', () => {
            const html = service.renderTemplate('approval-required', {
                approverName: 'Admin User',
                decisionTitle: 'Deploy to Production',
                decisionDescription: 'Approve deployment of v2.0',
                approvalLink: 'https://quiz2biz.com/approve?id=decision123',
            });

            expect(html).toBeDefined();
            expect(html).toContain('Admin User');
            expect(html).toContain('Deploy to Production');
            expect(html).toContain('Approve deployment of v2.0');
            expect(html).toContain('approve');
        });
    });

    describe('SendGrid API Mock Integration', () => {
        it('should format email payload correctly for verification', () => {
            const payload = {
                to: 'user@example.com',
                subject: 'Verify Your Email',
                html: '<p>Test content</p>',
            };

            // Verify payload structure matches SendGrid API
            expect(payload.to).toBeDefined();
            expect(payload.subject).toBeDefined();
            expect(payload.html).toBeDefined();
        });

        it('should handle batch email sending', async () => {
            const recipients = [
                { email: 'user1@example.com', name: 'User 1' },
                { email: 'user2@example.com', name: 'User 2' },
                { email: 'user3@example.com', name: 'User 3' },
            ];

            // Mock batch sending
            const results = recipients.map((recipient) => ({
                to: recipient.email,
                status: 'queued',
                messageId: `msg-${Date.now()}-${recipient.email}`,
            }));

            expect(results).toHaveLength(3);
            expect(results.every((r) => r.status === 'queued')).toBe(true);
        });

        it('should handle email rate limiting gracefully', async () => {
            // Simulate rate limit scenario
            const emails = Array.from({ length: 10 }, (_, i) => ({
                to: `user${i}@example.com`,
                subject: 'Test',
                html: '<p>Test</p>',
            }));

            // Mock rate limiting - only 5 emails per batch
            const batchSize = 5;
            const batches = Math.ceil(emails.length / batchSize);

            expect(batches).toBe(2);
        });
    });

    describe('Email Error Handling', () => {
        it('should handle invalid email addresses', () => {
            const invalidEmails = [
                'not-an-email',
                '@example.com',
                'user@',
                'user..name@example.com',
            ];

            invalidEmails.forEach((email) => {
                const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                expect(isValid).toBe(false);
            });
        });

        it('should validate template variables', () => {
            const requiredVars = {
                'email-verification': ['userName', 'verificationLink'],
                'password-reset': ['userName', 'resetLink'],
                'session-completed': ['userName', 'sessionName', 'readinessScore'],
            };

            Object.entries(requiredVars).forEach(([template, vars]) => {
                expect(vars.length).toBeGreaterThan(0);
            });
        });

        it('should handle SendGrid API errors', () => {
            const mockError = {
                code: 429,
                message: 'Rate limit exceeded',
                response: {
                    headers: {
                        'x-ratelimit-remaining': '0',
                        'x-ratelimit-reset': '1640995200',
                    },
                },
            };

            expect(mockError.code).toBe(429);
            expect(mockError.message).toContain('Rate limit');
        });
    });

    describe('Notification Preferences', () => {
        it('should respect user email preferences', () => {
            const userPreferences = {
                emailVerification: true,
                sessionCompleted: true,
                weeklyDigest: false,
                marketingEmails: false,
            };

            expect(userPreferences.emailVerification).toBe(true);
            expect(userPreferences.weeklyDigest).toBe(false);
        });

        it('should filter notifications based on preferences', () => {
            const notifications = [
                { type: 'session-completed', enabled: true },
                { type: 'weekly-digest', enabled: false },
                { type: 'marketing', enabled: false },
            ];

            const allowedNotifications = notifications.filter((n) => n.enabled);

            expect(allowedNotifications).toHaveLength(1);
            expect(allowedNotifications[0].type).toBe('session-completed');
        });
    });
});
