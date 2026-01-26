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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
exports.SessionController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var SessionController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('sessions'), (0, common_1.Controller)('sessions'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findById_decorators;
    var _continueSession_decorators;
    var _getNextQuestion_decorators;
    var _submitResponse_decorators;
    var _updateResponse_decorators;
    var _complete_decorators;
    var SessionController = _classThis = /** @class */ (function () {
        function SessionController_1(sessionService) {
            this.sessionService = (__runInitializers(this, _instanceExtraInitializers), sessionService);
        }
        SessionController_1.prototype.create = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.create(user.id, dto)];
                });
            });
        };
        SessionController_1.prototype.findAll = function (user, pagination, status) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, items, total;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.sessionService.findAllByUser(user.id, pagination, status)];
                        case 1:
                            _a = _e.sent(), items = _a.items, total = _a.total;
                            return [2 /*return*/, {
                                    items: items,
                                    pagination: {
                                        page: (_b = pagination.page) !== null && _b !== void 0 ? _b : 1,
                                        limit: (_c = pagination.limit) !== null && _c !== void 0 ? _c : 20,
                                        totalItems: total,
                                        totalPages: Math.ceil(total / ((_d = pagination.limit) !== null && _d !== void 0 ? _d : 20)),
                                    },
                                }];
                    }
                });
            });
        };
        SessionController_1.prototype.findById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.findById(id, user.id)];
                });
            });
        };
        SessionController_1.prototype.continueSession = function (user, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var questionCount;
                return __generator(this, function (_a) {
                    questionCount = Math.min(Math.max(dto.questionCount || 1, 1), 5);
                    return [2 /*return*/, this.sessionService.continueSession(id, user.id, questionCount)];
                });
            });
        };
        SessionController_1.prototype.getNextQuestion = function (user, id, count) {
            return __awaiter(this, void 0, void 0, function () {
                var questionCount;
                return __generator(this, function (_a) {
                    questionCount = Math.min(Math.max(count || 1, 1), 5);
                    return [2 /*return*/, this.sessionService.getNextQuestion(id, user.id, questionCount)];
                });
            });
        };
        SessionController_1.prototype.submitResponse = function (user, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.submitResponse(id, user.id, dto)];
                });
            });
        };
        SessionController_1.prototype.updateResponse = function (user, id, questionId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.submitResponse(id, user.id, __assign(__assign({}, dto), { questionId: questionId }))];
                });
            });
        };
        SessionController_1.prototype.complete = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.completeSession(id, user.id)];
                });
            });
        };
        return SessionController_1;
    }());
    __setFunctionName(_classThis, "SessionController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Start a new questionnaire session' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Session created successfully' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: "List user's sessions" }), (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.SessionStatus, required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of sessions' })];
        _findById_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get session details' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Session details' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' })];
        _continueSession_decorators = [(0, common_1.Get)(':id/continue'), (0, swagger_1.ApiOperation)({
                summary: 'Continue questionnaire session',
                description: 'Retrieves the current session state, applies adaptive logic rules, and returns the next question(s) along with progress information. Use this endpoint to resume a questionnaire session.',
            }), (0, swagger_1.ApiQuery)({
                name: 'questionCount',
                required: false,
                type: Number,
                description: 'Number of questions to fetch (default: 1, max: 5)'
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Session state with next question(s) and progress information',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied to this session' })];
        _getNextQuestion_decorators = [(0, common_1.Get)(':id/questions/next'), (0, swagger_1.ApiOperation)({ summary: 'Get next question(s) based on adaptive logic' }), (0, swagger_1.ApiQuery)({ name: 'count', required: false, type: Number, description: 'Number of questions to fetch (default: 1, max: 5)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Next question(s)' })];
        _submitResponse_decorators = [(0, common_1.Post)(':id/responses'), (0, swagger_1.ApiOperation)({ summary: 'Submit a response to a question' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Response submitted successfully' })];
        _updateResponse_decorators = [(0, common_1.Put)(':id/responses/:questionId'), (0, swagger_1.ApiOperation)({ summary: 'Update a response' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Response updated successfully' })];
        _complete_decorators = [(0, common_1.Post)(':id/complete'), (0, swagger_1.ApiOperation)({ summary: 'Mark session as complete' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Session completed' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findById_decorators, { kind: "method", name: "findById", static: false, private: false, access: { has: function (obj) { return "findById" in obj; }, get: function (obj) { return obj.findById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _continueSession_decorators, { kind: "method", name: "continueSession", static: false, private: false, access: { has: function (obj) { return "continueSession" in obj; }, get: function (obj) { return obj.continueSession; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNextQuestion_decorators, { kind: "method", name: "getNextQuestion", static: false, private: false, access: { has: function (obj) { return "getNextQuestion" in obj; }, get: function (obj) { return obj.getNextQuestion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitResponse_decorators, { kind: "method", name: "submitResponse", static: false, private: false, access: { has: function (obj) { return "submitResponse" in obj; }, get: function (obj) { return obj.submitResponse; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateResponse_decorators, { kind: "method", name: "updateResponse", static: false, private: false, access: { has: function (obj) { return "updateResponse" in obj; }, get: function (obj) { return obj.updateResponse; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _complete_decorators, { kind: "method", name: "complete", static: false, private: false, access: { has: function (obj) { return "complete" in obj; }, get: function (obj) { return obj.complete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SessionController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SessionController = _classThis;
}();
exports.SessionController = SessionController;
var SessionController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('sessions'), (0, common_1.Controller)('sessions'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findById_decorators;
    var _continueSession_decorators;
    var _getNextQuestion_decorators;
    var _submitResponse_decorators;
    var _updateResponse_decorators;
    var _complete_decorators;
    var SessionController = _classThis = /** @class */ (function () {
        function SessionController_2(sessionService) {
            this.sessionService = (__runInitializers(this, _instanceExtraInitializers), sessionService);
        }
        SessionController_2.prototype.create = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.create(user.id, dto)];
                });
            });
        };
        SessionController_2.prototype.findAll = function (user, pagination, status) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, items, total;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.sessionService.findAllByUser(user.id, pagination, status)];
                        case 1:
                            _a = _e.sent(), items = _a.items, total = _a.total;
                            return [2 /*return*/, {
                                    items: items,
                                    pagination: {
                                        page: (_b = pagination.page) !== null && _b !== void 0 ? _b : 1,
                                        limit: (_c = pagination.limit) !== null && _c !== void 0 ? _c : 20,
                                        totalItems: total,
                                        totalPages: Math.ceil(total / ((_d = pagination.limit) !== null && _d !== void 0 ? _d : 20)),
                                    },
                                }];
                    }
                });
            });
        };
        SessionController_2.prototype.findById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.findById(id, user.id)];
                });
            });
        };
        SessionController_2.prototype.continueSession = function (user, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var questionCount;
                return __generator(this, function (_a) {
                    questionCount = Math.min(Math.max(dto.questionCount || 1, 1), 5);
                    return [2 /*return*/, this.sessionService.continueSession(id, user.id, questionCount)];
                });
            });
        };
        SessionController_2.prototype.getNextQuestion = function (user, id, count) {
            return __awaiter(this, void 0, void 0, function () {
                var questionCount;
                return __generator(this, function (_a) {
                    questionCount = Math.min(Math.max(count || 1, 1), 5);
                    return [2 /*return*/, this.sessionService.getNextQuestion(id, user.id, questionCount)];
                });
            });
        };
        SessionController_2.prototype.submitResponse = function (user, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.submitResponse(id, user.id, dto)];
                });
            });
        };
        SessionController_2.prototype.updateResponse = function (user, id, questionId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.submitResponse(id, user.id, __assign(__assign({}, dto), { questionId: questionId }))];
                });
            });
        };
        SessionController_2.prototype.complete = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sessionService.completeSession(id, user.id)];
                });
            });
        };
        return SessionController_2;
    }());
    __setFunctionName(_classThis, "SessionController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, swagger_1.ApiOperation)({ summary: 'Start a new questionnaire session' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Session created successfully' })];
        _findAll_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: "List user's sessions" }), (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.SessionStatus, required: false }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of sessions' })];
        _findById_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get session details' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Session details' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' })];
        _continueSession_decorators = [(0, common_1.Get)(':id/continue'), (0, swagger_1.ApiOperation)({
                summary: 'Continue questionnaire session',
                description: 'Retrieves the current session state, applies adaptive logic rules, and returns the next question(s) along with progress information. Use this endpoint to resume a questionnaire session.',
            }), (0, swagger_1.ApiQuery)({
                name: 'questionCount',
                required: false,
                type: Number,
                description: 'Number of questions to fetch (default: 1, max: 5)'
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Session state with next question(s) and progress information',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied to this session' })];
        _getNextQuestion_decorators = [(0, common_1.Get)(':id/questions/next'), (0, swagger_1.ApiOperation)({ summary: 'Get next question(s) based on adaptive logic' }), (0, swagger_1.ApiQuery)({ name: 'count', required: false, type: Number, description: 'Number of questions to fetch (default: 1, max: 5)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Next question(s)' })];
        _submitResponse_decorators = [(0, common_1.Post)(':id/responses'), (0, swagger_1.ApiOperation)({ summary: 'Submit a response to a question' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Response submitted successfully' })];
        _updateResponse_decorators = [(0, common_1.Put)(':id/responses/:questionId'), (0, swagger_1.ApiOperation)({ summary: 'Update a response' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Response updated successfully' })];
        _complete_decorators = [(0, common_1.Post)(':id/complete'), (0, swagger_1.ApiOperation)({ summary: 'Mark session as complete' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Session completed' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findById_decorators, { kind: "method", name: "findById", static: false, private: false, access: { has: function (obj) { return "findById" in obj; }, get: function (obj) { return obj.findById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _continueSession_decorators, { kind: "method", name: "continueSession", static: false, private: false, access: { has: function (obj) { return "continueSession" in obj; }, get: function (obj) { return obj.continueSession; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNextQuestion_decorators, { kind: "method", name: "getNextQuestion", static: false, private: false, access: { has: function (obj) { return "getNextQuestion" in obj; }, get: function (obj) { return obj.getNextQuestion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitResponse_decorators, { kind: "method", name: "submitResponse", static: false, private: false, access: { has: function (obj) { return "submitResponse" in obj; }, get: function (obj) { return obj.submitResponse; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateResponse_decorators, { kind: "method", name: "updateResponse", static: false, private: false, access: { has: function (obj) { return "updateResponse" in obj; }, get: function (obj) { return obj.updateResponse; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _complete_decorators, { kind: "method", name: "complete", static: false, private: false, access: { has: function (obj) { return "complete" in obj; }, get: function (obj) { return obj.complete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SessionController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SessionController = _classThis;
}();
exports.SessionController = SessionController;
