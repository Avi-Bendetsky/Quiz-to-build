"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var uuid_1 = require("uuid");
var client_1 = require("@prisma/client");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwtService, configService, redisService) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            this.configService = configService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(AuthService.name);
            this.bcryptRounds = this.configService.get('bcrypt.rounds', 12);
            this.jwtRefreshSecret = this.configService.get('jwt.refreshSecret', 'refresh-secret');
            this.jwtRefreshExpiresIn = this.configService.get('jwt.refreshExpiresIn', '7d');
            this.refreshTokenTtlSeconds = this.parseExpiresInToSeconds(this.jwtRefreshExpiresIn);
        }
        AuthService_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, passwordHash, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email.toLowerCase() },
                            })];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                throw new common_1.ConflictException('User with this email already exists');
                            }
                            return [4 /*yield*/, bcrypt.hash(dto.password, this.bcryptRounds)];
                        case 2:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        email: dto.email.toLowerCase(),
                                        passwordHash: passwordHash,
                                        role: client_1.UserRole.CLIENT,
                                        profile: {
                                            name: dto.name,
                                        },
                                    },
                                })];
                        case 3:
                            user = _a.sent();
                            this.logger.log("User registered: ".concat(user.id));
                            // Generate tokens
                            return [2 /*return*/, this.generateTokens(user)];
                    }
                });
            });
        };
        AuthService_1.prototype.login = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isPasswordValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email.toLowerCase() },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            // Check if account is locked
                            if (user.lockedUntil && user.lockedUntil > new Date()) {
                                throw new common_1.UnauthorizedException('Account is temporarily locked. Please try again later.');
                            }
                            // Verify password
                            if (!user.passwordHash) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            return [4 /*yield*/, bcrypt.compare(dto.password, user.passwordHash)];
                        case 2:
                            isPasswordValid = _a.sent();
                            if (!!isPasswordValid) return [3 /*break*/, 4];
                            // Increment failed login attempts
                            return [4 /*yield*/, this.handleFailedLogin(user)];
                        case 3:
                            // Increment failed login attempts
                            _a.sent();
                            throw new common_1.UnauthorizedException('Invalid credentials');
                        case 4: 
                        // Reset failed login attempts and update last login
                        return [4 /*yield*/, this.prisma.user.update({
                                where: { id: user.id },
                                data: {
                                    failedLoginAttempts: 0,
                                    lockedUntil: null,
                                    lastLoginAt: new Date(),
                                    lastLoginIp: dto.ip,
                                },
                            })];
                        case 5:
                            // Reset failed login attempts and update last login
                            _a.sent();
                            this.logger.log("User logged in: ".concat(user.id));
                            return [2 /*return*/, this.generateTokens(user)];
                    }
                });
            });
        };
        AuthService_1.prototype.refresh = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var storedUserId, user, payload, accessToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redisService.get("refresh:".concat(refreshToken))];
                        case 1:
                            storedUserId = _a.sent();
                            if (!storedUserId) {
                                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
                            }
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: storedUserId },
                                })];
                        case 2:
                            user = _a.sent();
                            if (!user || user.deletedAt) {
                                throw new common_1.UnauthorizedException('User not found');
                            }
                            payload = {
                                sub: user.id,
                                email: user.email,
                                role: user.role,
                            };
                            accessToken = this.jwtService.sign(payload);
                            return [2 /*return*/, {
                                    accessToken: accessToken,
                                    expiresIn: 900, // 15 minutes
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.logout = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Remove refresh token from Redis
                        return [4 /*yield*/, this.redisService.del("refresh:".concat(refreshToken))];
                        case 1:
                            // Remove refresh token from Redis
                            _a.sent();
                            this.logger.log('User logged out');
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.validateUser = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user, profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: payload.sub },
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                    profile: true,
                                    deletedAt: true,
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user || user.deletedAt) {
                                return [2 /*return*/, null];
                            }
                            profile = user.profile;
                            return [2 /*return*/, {
                                    id: user.id,
                                    email: user.email,
                                    role: user.role,
                                    name: (profile === null || profile === void 0 ? void 0 : profile.name) || undefined,
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.generateTokens = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, accessToken, refreshToken, profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            payload = {
                                sub: user.id,
                                email: user.email,
                                role: user.role,
                            };
                            accessToken = this.jwtService.sign(payload);
                            refreshToken = (0, uuid_1.v4)();
                            // Store refresh token in Redis
                            return [4 /*yield*/, this.redisService.set("refresh:".concat(refreshToken), user.id, this.refreshTokenTtlSeconds)];
                        case 1:
                            // Store refresh token in Redis
                            _a.sent();
                            // Also store in database for audit
                            return [4 /*yield*/, this.prisma.refreshToken.create({
                                    data: {
                                        userId: user.id,
                                        token: refreshToken,
                                        expiresAt: new Date(Date.now() + this.refreshTokenTtlSeconds * 1000),
                                    },
                                })];
                        case 2:
                            // Also store in database for audit
                            _a.sent();
                            profile = user.profile;
                            return [2 /*return*/, {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    expiresIn: 900, // 15 minutes
                                    tokenType: 'Bearer',
                                    user: {
                                        id: user.id,
                                        email: user.email,
                                        role: user.role,
                                        name: (profile === null || profile === void 0 ? void 0 : profile.name) || undefined,
                                    },
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.handleFailedLogin = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var failedAttempts, maxAttempts, lockDurationMinutes, updateData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            failedAttempts = user.failedLoginAttempts + 1;
                            maxAttempts = 5;
                            lockDurationMinutes = 15;
                            updateData = {
                                failedLoginAttempts: failedAttempts,
                            };
                            // Lock account after max attempts
                            if (failedAttempts >= maxAttempts) {
                                updateData.lockedUntil = new Date(Date.now() + lockDurationMinutes * 60 * 1000);
                                this.logger.warn("Account locked due to failed login attempts: ".concat(user.id));
                            }
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: updateData,
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.parseExpiresInToSeconds = function (expiresIn) {
            var match = expiresIn.match(/^(\d+)([smhd])$/);
            if (!match) {
                return 7 * 24 * 60 * 60; // Default: 7 days
            }
            var value = parseInt(match[1], 10);
            var unit = match[2];
            switch (unit) {
                case 's':
                    return value;
                case 'm':
                    return value * 60;
                case 'h':
                    return value * 60 * 60;
                case 'd':
                    return value * 24 * 60 * 60;
                default:
                    return 7 * 24 * 60 * 60;
            }
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_2(prisma, jwtService, configService, redisService) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            this.configService = configService;
            this.redisService = redisService;
            this.logger = new common_1.Logger(AuthService.name);
            this.bcryptRounds = this.configService.get('bcrypt.rounds', 12);
            this.jwtRefreshSecret = this.configService.get('jwt.refreshSecret', 'refresh-secret');
            this.jwtRefreshExpiresIn = this.configService.get('jwt.refreshExpiresIn', '7d');
            this.refreshTokenTtlSeconds = this.parseExpiresInToSeconds(this.jwtRefreshExpiresIn);
        }
        AuthService_2.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, passwordHash, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email.toLowerCase() },
                            })];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                throw new common_1.ConflictException('User with this email already exists');
                            }
                            return [4 /*yield*/, bcrypt.hash(dto.password, this.bcryptRounds)];
                        case 2:
                            passwordHash = _a.sent();
                            return [4 /*yield*/, this.prisma.user.create({
                                    data: {
                                        email: dto.email.toLowerCase(),
                                        passwordHash: passwordHash,
                                        role: client_1.UserRole.CLIENT,
                                        profile: {
                                            name: dto.name,
                                        },
                                    },
                                })];
                        case 3:
                            user = _a.sent();
                            this.logger.log("User registered: ".concat(user.id));
                            // Generate tokens
                            return [2 /*return*/, this.generateTokens(user)];
                    }
                });
            });
        };
        AuthService_2.prototype.login = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isPasswordValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: dto.email.toLowerCase() },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            // Check if account is locked
                            if (user.lockedUntil && user.lockedUntil > new Date()) {
                                throw new common_1.UnauthorizedException('Account is temporarily locked. Please try again later.');
                            }
                            // Verify password
                            if (!user.passwordHash) {
                                throw new common_1.UnauthorizedException('Invalid credentials');
                            }
                            return [4 /*yield*/, bcrypt.compare(dto.password, user.passwordHash)];
                        case 2:
                            isPasswordValid = _a.sent();
                            if (!!isPasswordValid) return [3 /*break*/, 4];
                            // Increment failed login attempts
                            return [4 /*yield*/, this.handleFailedLogin(user)];
                        case 3:
                            // Increment failed login attempts
                            _a.sent();
                            throw new common_1.UnauthorizedException('Invalid credentials');
                        case 4: 
                        // Reset failed login attempts and update last login
                        return [4 /*yield*/, this.prisma.user.update({
                                where: { id: user.id },
                                data: {
                                    failedLoginAttempts: 0,
                                    lockedUntil: null,
                                    lastLoginAt: new Date(),
                                    lastLoginIp: dto.ip,
                                },
                            })];
                        case 5:
                            // Reset failed login attempts and update last login
                            _a.sent();
                            this.logger.log("User logged in: ".concat(user.id));
                            return [2 /*return*/, this.generateTokens(user)];
                    }
                });
            });
        };
        AuthService_2.prototype.refresh = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                var storedUserId, user, payload, accessToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.redisService.get("refresh:".concat(refreshToken))];
                        case 1:
                            storedUserId = _a.sent();
                            if (!storedUserId) {
                                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
                            }
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { id: storedUserId },
                                })];
                        case 2:
                            user = _a.sent();
                            if (!user || user.deletedAt) {
                                throw new common_1.UnauthorizedException('User not found');
                            }
                            payload = {
                                sub: user.id,
                                email: user.email,
                                role: user.role,
                            };
                            accessToken = this.jwtService.sign(payload);
                            return [2 /*return*/, {
                                    accessToken: accessToken,
                                    expiresIn: 900, // 15 minutes
                                }];
                    }
                });
            });
        };
        AuthService_2.prototype.logout = function (refreshToken) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Remove refresh token from Redis
                        return [4 /*yield*/, this.redisService.del("refresh:".concat(refreshToken))];
                        case 1:
                            // Remove refresh token from Redis
                            _a.sent();
                            this.logger.log('User logged out');
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_2.prototype.validateUser = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var user, profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { id: payload.sub },
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                    profile: true,
                                    deletedAt: true,
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user || user.deletedAt) {
                                return [2 /*return*/, null];
                            }
                            profile = user.profile;
                            return [2 /*return*/, {
                                    id: user.id,
                                    email: user.email,
                                    role: user.role,
                                    name: (profile === null || profile === void 0 ? void 0 : profile.name) || undefined,
                                }];
                    }
                });
            });
        };
        AuthService_2.prototype.generateTokens = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, accessToken, refreshToken, profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            payload = {
                                sub: user.id,
                                email: user.email,
                                role: user.role,
                            };
                            accessToken = this.jwtService.sign(payload);
                            refreshToken = (0, uuid_1.v4)();
                            // Store refresh token in Redis
                            return [4 /*yield*/, this.redisService.set("refresh:".concat(refreshToken), user.id, this.refreshTokenTtlSeconds)];
                        case 1:
                            // Store refresh token in Redis
                            _a.sent();
                            // Also store in database for audit
                            return [4 /*yield*/, this.prisma.refreshToken.create({
                                    data: {
                                        userId: user.id,
                                        token: refreshToken,
                                        expiresAt: new Date(Date.now() + this.refreshTokenTtlSeconds * 1000),
                                    },
                                })];
                        case 2:
                            // Also store in database for audit
                            _a.sent();
                            profile = user.profile;
                            return [2 /*return*/, {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    expiresIn: 900, // 15 minutes
                                    tokenType: 'Bearer',
                                    user: {
                                        id: user.id,
                                        email: user.email,
                                        role: user.role,
                                        name: (profile === null || profile === void 0 ? void 0 : profile.name) || undefined,
                                    },
                                }];
                    }
                });
            });
        };
        AuthService_2.prototype.handleFailedLogin = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var failedAttempts, maxAttempts, lockDurationMinutes, updateData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            failedAttempts = user.failedLoginAttempts + 1;
                            maxAttempts = 5;
                            lockDurationMinutes = 15;
                            updateData = {
                                failedLoginAttempts: failedAttempts,
                            };
                            // Lock account after max attempts
                            if (failedAttempts >= maxAttempts) {
                                updateData.lockedUntil = new Date(Date.now() + lockDurationMinutes * 60 * 1000);
                                this.logger.warn("Account locked due to failed login attempts: ".concat(user.id));
                            }
                            return [4 /*yield*/, this.prisma.user.update({
                                    where: { id: user.id },
                                    data: updateData,
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_2.prototype.parseExpiresInToSeconds = function (expiresIn) {
            var match = expiresIn.match(/^(\d+)([smhd])$/);
            if (!match) {
                return 7 * 24 * 60 * 60; // Default: 7 days
            }
            var value = parseInt(match[1], 10);
            var unit = match[2];
            switch (unit) {
                case 's':
                    return value;
                case 'm':
                    return value * 60;
                case 'h':
                    return value * 60 * 60;
                case 'd':
                    return value * 24 * 60 * 60;
                default:
                    return 7 * 24 * 60 * 60;
            }
        };
        return AuthService_2;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
