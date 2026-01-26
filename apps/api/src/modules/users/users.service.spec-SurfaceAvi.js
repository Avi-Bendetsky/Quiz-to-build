"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@nestjs/testing");
var common_1 = require("@nestjs/common");
var users_service_1 = require("./users.service");
var database_1 = require("@libs/database");
var client_1 = require("@prisma/client");
describe('UsersService', function () {
    var service;
    var prisma;
    var mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        passwordHash: 'hashed',
        role: client_1.UserRole.CLIENT,
        organizationId: 'org-123',
        profile: { name: 'Test User', phone: '+1234567890', timezone: 'UTC' },
        preferences: { notifications: { email: true, push: false }, theme: 'dark' },
        mfaEnabled: false,
        mfaSecret: null,
        lastLoginAt: new Date('2026-01-01'),
        lastLoginIp: '127.0.0.1',
        failedLoginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2026-01-01'),
        deletedAt: null,
        organization: { id: 'org-123', name: 'Test Organization' },
        _count: { sessions: 5 },
    };
    var mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
        document: {
            count: jest.fn(),
        },
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.clearAllMocks();
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                users_service_1.UsersService,
                                { provide: database_1.PrismaService, useValue: mockPrismaService },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(users_service_1.UsersService);
                    prisma = module.get(database_1.PrismaService);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('findById', function () {
        it('should return user profile with statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
                        mockPrismaService.document.count.mockResolvedValue(10);
                        return [4 /*yield*/, service.findById('user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            id: 'user-123',
                            email: 'test@example.com',
                            role: client_1.UserRole.CLIENT,
                            profile: {
                                name: 'Test User',
                                phone: '+1234567890',
                                timezone: 'UTC',
                                language: undefined,
                                avatarUrl: undefined,
                            },
                            preferences: {
                                notifications: { email: true, push: false },
                                theme: 'dark',
                            },
                            organization: { id: 'org-123', name: 'Test Organization' },
                            statistics: {
                                completedSessions: 5,
                                documentsGenerated: 10,
                                lastActiveAt: mockUser.lastLoginAt,
                            },
                            createdAt: mockUser.createdAt,
                        });
                        expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                            where: { id: 'user-123', deletedAt: null },
                            include: {
                                organization: true,
                                sessions: {
                                    where: { status: 'COMPLETED' },
                                    select: { id: true },
                                },
                                _count: {
                                    select: {
                                        sessions: { where: { status: 'COMPLETED' } },
                                    },
                                },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw NotFoundException when user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.findById('non-existent')).rejects.toThrow(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle user without organization', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userWithoutOrg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userWithoutOrg = __assign(__assign({}, mockUser), { organization: null, organizationId: null });
                        mockPrismaService.user.findUnique.mockResolvedValue(userWithoutOrg);
                        mockPrismaService.document.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.findById('user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result.organization).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        var updateDto = {
            name: 'Updated Name',
            phone: '+9876543210',
            timezone: 'America/New_York',
        };
        it('should update user profile successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updatedUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedUser = __assign(__assign({}, mockUser), { profile: __assign(__assign({}, mockUser.profile), updateDto) });
                        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
                        mockPrismaService.user.update.mockResolvedValue(updatedUser);
                        mockPrismaService.document.count.mockResolvedValue(10);
                        return [4 /*yield*/, service.update('user-123', updateDto, 'user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result.profile.name).toBe('Updated Name');
                        expect(mockPrismaService.user.update).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw NotFoundException when user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.update('non-existent', updateDto, 'user-123')).rejects.toThrow(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw ForbiddenException when updating another user profile', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
                        return [4 /*yield*/, expect(service.update('user-123', updateDto, 'different-user')).rejects.toThrow(common_1.ForbiddenException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow admin to update own profile', function () { return __awaiter(void 0, void 0, void 0, function () {
            var adminUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminUser = __assign(__assign({}, mockUser), { role: client_1.UserRole.ADMIN });
                        mockPrismaService.user.findUnique.mockResolvedValue(adminUser);
                        mockPrismaService.user.update.mockResolvedValue(adminUser);
                        mockPrismaService.document.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.update('user-123', updateDto, 'user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update preferences', function () { return __awaiter(void 0, void 0, void 0, function () {
            var prefsDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefsDto = {
                            preferences: { theme: 'light' },
                        };
                        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
                        mockPrismaService.user.update.mockResolvedValue(__assign(__assign({}, mockUser), { preferences: __assign(__assign({}, mockUser.preferences), { theme: 'light' }) }));
                        mockPrismaService.document.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.update('user-123', prefsDto, 'user-123')];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaService.user.update).toHaveBeenCalledWith(expect.objectContaining({
                            data: expect.objectContaining({
                                preferences: expect.objectContaining({ theme: 'light' }),
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findAll', function () {
        it('should return paginated list of users', function () { return __awaiter(void 0, void 0, void 0, function () {
            var users, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        users = [mockUser, __assign(__assign({}, mockUser), { id: 'user-456', email: 'test2@example.com' })];
                        mockPrismaService.user.findMany.mockResolvedValue(users);
                        mockPrismaService.user.count.mockResolvedValue(2);
                        mockPrismaService.document.count.mockResolvedValue(5);
                        return [4 /*yield*/, service.findAll({ page: 1, limit: 10, skip: 0 })];
                    case 1:
                        result = _a.sent();
                        expect(result.items).toHaveLength(2);
                        expect(result.total).toBe(2);
                        expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
                            where: { deletedAt: null },
                            skip: 0,
                            take: 10,
                            orderBy: { createdAt: 'desc' },
                            include: { organization: true },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should filter by role', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
                        mockPrismaService.user.count.mockResolvedValue(1);
                        mockPrismaService.document.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.findAll({ page: 1, limit: 10, skip: 0 }, client_1.UserRole.CLIENT)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
                            where: { deletedAt: null, role: client_1.UserRole.CLIENT },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return empty list when no users found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findMany.mockResolvedValue([]);
                        mockPrismaService.user.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.findAll({ page: 1, limit: 10, skip: 0 })];
                    case 1:
                        result = _a.sent();
                        expect(result.items).toHaveLength(0);
                        expect(result.total).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('UsersService', function () {
    var service;
    var prisma;
    var mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        passwordHash: 'hashed',
        role: client_1.UserRole.CLIENT,
        organizationId: 'org-123',
        profile: { name: 'Test User', phone: '+1234567890', timezone: 'UTC' },
        preferences: { notifications: { email: true, push: false }, theme: 'dark' },
        mfaEnabled: false,
        mfaSecret: null,
        lastLoginAt: new Date('2026-01-01'),
        lastLoginIp: '127.0.0.1',
        failedLoginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2026-01-01'),
        deletedAt: null,
        organization: { id: 'org-123', name: 'Test Organization' },
        _count: { sessions: 5 },
    };
    var mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
        },
        document: {
            count: jest.fn(),
        },
    };
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var module;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jest.clearAllMocks();
                    return [4 /*yield*/, testing_1.Test.createTestingModule({
                            providers: [
                                users_service_1.UsersService,
                                { provide: database_1.PrismaService, useValue: mockPrismaService },
                            ],
                        }).compile()];
                case 1:
                    module = _a.sent();
                    service = module.get(users_service_1.UsersService);
                    prisma = module.get(database_1.PrismaService);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('findById', function () {
        it('should return user profile with statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
                        mockPrismaService.document.count.mockResolvedValue(10);
                        return [4 /*yield*/, service.findById('user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual({
                            id: 'user-123',
                            email: 'test@example.com',
                            role: client_1.UserRole.CLIENT,
                            profile: {
                                name: 'Test User',
                                phone: '+1234567890',
                                timezone: 'UTC',
                                language: undefined,
                                avatarUrl: undefined,
                            },
                            preferences: {
                                notifications: { email: true, push: false },
                                theme: 'dark',
                            },
                            organization: { id: 'org-123', name: 'Test Organization' },
                            statistics: {
                                completedSessions: 5,
                                documentsGenerated: 10,
                                lastActiveAt: mockUser.lastLoginAt,
                            },
                            createdAt: mockUser.createdAt,
                        });
                        expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                            where: { id: 'user-123', deletedAt: null },
                            include: {
                                organization: true,
                                sessions: {
                                    where: { status: 'COMPLETED' },
                                    select: { id: true },
                                },
                                _count: {
                                    select: {
                                        sessions: { where: { status: 'COMPLETED' } },
                                    },
                                },
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw NotFoundException when user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.findById('non-existent')).rejects.toThrow(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle user without organization', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userWithoutOrg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userWithoutOrg = __assign(__assign({}, mockUser), { organization: null, organizationId: null });
                        mockPrismaService.user.findUnique.mockResolvedValue(userWithoutOrg);
                        mockPrismaService.document.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.findById('user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result.organization).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('update', function () {
        var updateDto = {
            name: 'Updated Name',
            phone: '+9876543210',
            timezone: 'America/New_York',
        };
        it('should update user profile successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updatedUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedUser = __assign(__assign({}, mockUser), { profile: __assign(__assign({}, mockUser.profile), updateDto) });
                        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
                        mockPrismaService.user.update.mockResolvedValue(updatedUser);
                        mockPrismaService.document.count.mockResolvedValue(10);
                        return [4 /*yield*/, service.update('user-123', updateDto, 'user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result.profile.name).toBe('Updated Name');
                        expect(mockPrismaService.user.update).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw NotFoundException when user not found', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findUnique.mockResolvedValue(null);
                        return [4 /*yield*/, expect(service.update('non-existent', updateDto, 'user-123')).rejects.toThrow(common_1.NotFoundException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw ForbiddenException when updating another user profile', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
                        return [4 /*yield*/, expect(service.update('user-123', updateDto, 'different-user')).rejects.toThrow(common_1.ForbiddenException)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow admin to update own profile', function () { return __awaiter(void 0, void 0, void 0, function () {
            var adminUser, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminUser = __assign(__assign({}, mockUser), { role: client_1.UserRole.ADMIN });
                        mockPrismaService.user.findUnique.mockResolvedValue(adminUser);
                        mockPrismaService.user.update.mockResolvedValue(adminUser);
                        mockPrismaService.document.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.update('user-123', updateDto, 'user-123')];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update preferences', function () { return __awaiter(void 0, void 0, void 0, function () {
            var prefsDto, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefsDto = {
                            preferences: { theme: 'light' },
                        };
                        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
                        mockPrismaService.user.update.mockResolvedValue(__assign(__assign({}, mockUser), { preferences: __assign(__assign({}, mockUser.preferences), { theme: 'light' }) }));
                        mockPrismaService.document.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.update('user-123', prefsDto, 'user-123')];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaService.user.update).toHaveBeenCalledWith(expect.objectContaining({
                            data: expect.objectContaining({
                                preferences: expect.objectContaining({ theme: 'light' }),
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('findAll', function () {
        it('should return paginated list of users', function () { return __awaiter(void 0, void 0, void 0, function () {
            var users, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        users = [mockUser, __assign(__assign({}, mockUser), { id: 'user-456', email: 'test2@example.com' })];
                        mockPrismaService.user.findMany.mockResolvedValue(users);
                        mockPrismaService.user.count.mockResolvedValue(2);
                        mockPrismaService.document.count.mockResolvedValue(5);
                        return [4 /*yield*/, service.findAll({ page: 1, limit: 10, skip: 0 })];
                    case 1:
                        result = _a.sent();
                        expect(result.items).toHaveLength(2);
                        expect(result.total).toBe(2);
                        expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
                            where: { deletedAt: null },
                            skip: 0,
                            take: 10,
                            orderBy: { createdAt: 'desc' },
                            include: { organization: true },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should filter by role', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
                        mockPrismaService.user.count.mockResolvedValue(1);
                        mockPrismaService.document.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.findAll({ page: 1, limit: 10, skip: 0 }, client_1.UserRole.CLIENT)];
                    case 1:
                        result = _a.sent();
                        expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
                            where: { deletedAt: null, role: client_1.UserRole.CLIENT },
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return empty list when no users found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPrismaService.user.findMany.mockResolvedValue([]);
                        mockPrismaService.user.count.mockResolvedValue(0);
                        return [4 /*yield*/, service.findAll({ page: 1, limit: 10, skip: 0 })];
                    case 1:
                        result = _a.sent();
                        expect(result.items).toHaveLength(0);
                        expect(result.total).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
