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
exports.SessionService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var SessionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SessionService = _classThis = /** @class */ (function () {
        function SessionService_1(prisma, questionnaireService, adaptiveLogicService) {
            this.prisma = prisma;
            this.questionnaireService = questionnaireService;
            this.adaptiveLogicService = adaptiveLogicService;
        }
        SessionService_1.prototype.create = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire, totalQuestions, firstSection, firstQuestion, session;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.questionnaireService.findById(dto.questionnaireId)];
                        case 1:
                            questionnaire = _b.sent();
                            return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(dto.questionnaireId)];
                        case 2:
                            totalQuestions = _b.sent();
                            firstSection = questionnaire.sections[0];
                            firstQuestion = (_a = firstSection === null || firstSection === void 0 ? void 0 : firstSection.questions) === null || _a === void 0 ? void 0 : _a[0];
                            return [4 /*yield*/, this.prisma.session.create({
                                    data: {
                                        userId: userId,
                                        questionnaireId: dto.questionnaireId,
                                        questionnaireVersion: questionnaire.version,
                                        industry: dto.industry,
                                        status: client_1.SessionStatus.IN_PROGRESS,
                                        progress: {
                                            percentage: 0,
                                            answered: 0,
                                            total: totalQuestions,
                                        },
                                        currentSectionId: firstSection === null || firstSection === void 0 ? void 0 : firstSection.id,
                                        currentQuestionId: firstQuestion === null || firstQuestion === void 0 ? void 0 : firstQuestion.id,
                                        adaptiveState: {
                                            activeQuestionIds: [],
                                            skippedQuestionIds: [],
                                            branchHistory: [],
                                        },
                                    },
                                    include: {
                                        currentSection: true,
                                    },
                                })];
                        case 3:
                            session = _b.sent();
                            return [2 /*return*/, this.mapToSessionResponse(session, totalQuestions)];
                    }
                });
            });
        };
        SessionService_1.prototype.findById = function (sessionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var session, totalQuestions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.session.findUnique({
                                where: { id: sessionId },
                                include: {
                                    currentSection: true,
                                    questionnaire: true,
                                },
                            })];
                        case 1:
                            session = _a.sent();
                            if (!session) {
                                throw new common_1.NotFoundException('Session not found');
                            }
                            if (session.userId !== userId) {
                                throw new common_1.ForbiddenException('Access denied to this session');
                            }
                            return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(session.questionnaireId)];
                        case 2:
                            totalQuestions = _a.sent();
                            return [2 /*return*/, this.mapToSessionResponse(session, totalQuestions)];
                    }
                });
            });
        };
        SessionService_1.prototype.findAllByUser = function (userId, pagination, status) {
            return __awaiter(this, void 0, void 0, function () {
                var where, _a, sessions, total, items;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = __assign({ userId: userId }, (status && { status: status }));
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.session.findMany({
                                        where: where,
                                        skip: pagination.skip,
                                        take: pagination.limit,
                                        orderBy: { startedAt: 'desc' },
                                        include: {
                                            currentSection: true,
                                            questionnaire: true,
                                        },
                                    }),
                                    this.prisma.session.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), sessions = _a[0], total = _a[1];
                            return [4 /*yield*/, Promise.all(sessions.map(function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var totalQuestions;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(session.questionnaireId)];
                                            case 1:
                                                totalQuestions = _a.sent();
                                                return [2 /*return*/, this.mapToSessionResponse(session, totalQuestions)];
                                        }
                                    });
                                }); }))];
                        case 2:
                            items = _b.sent();
                            return [2 /*return*/, { items: items, total: total }];
                    }
                });
            });
        };
        SessionService_1.prototype.getNextQuestion = function (sessionId_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (sessionId, userId, count) {
                var session, responses, responseMap, currentQuestion, visibleQuestions, nextQuestions, currentIndex, i, question, answeredCount, totalVisible, progress, section, sectionQuestions, sectionAnswered, sectionProgress;
                if (count === void 0) { count = 1; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSessionWithValidation(sessionId, userId)];
                        case 1:
                            session = _a.sent();
                            if (session.status === client_1.SessionStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Session is already completed');
                            }
                            return [4 /*yield*/, this.prisma.response.findMany({
                                    where: { sessionId: sessionId },
                                })];
                        case 2:
                            responses = _a.sent();
                            responseMap = new Map(responses.map(function (r) { return [r.questionId, r.value]; }));
                            return [4 /*yield*/, this.questionnaireService.getQuestionById(session.currentQuestionId)];
                        case 3:
                            currentQuestion = _a.sent();
                            if (!currentQuestion) {
                                throw new common_1.NotFoundException('Current question not found');
                            }
                            return [4 /*yield*/, this.adaptiveLogicService.getVisibleQuestions(session.questionnaireId, responseMap)];
                        case 4:
                            visibleQuestions = _a.sent();
                            nextQuestions = [];
                            currentIndex = visibleQuestions.findIndex(function (q) { return q.id === session.currentQuestionId; });
                            for (i = currentIndex; i < visibleQuestions.length && nextQuestions.length < count; i++) {
                                question = visibleQuestions[i];
                                // Skip already answered questions
                                if (!responseMap.has(question.id)) {
                                    nextQuestions.push(this.mapQuestionToResponse(question));
                                }
                            }
                            answeredCount = responses.length;
                            totalVisible = visibleQuestions.length;
                            progress = this.calculateProgress(answeredCount, totalVisible);
                            return [4 /*yield*/, this.prisma.section.findUnique({
                                    where: { id: currentQuestion.sectionId },
                                })];
                        case 5:
                            section = _a.sent();
                            sectionQuestions = visibleQuestions.filter(function (q) { return q.sectionId === currentQuestion.sectionId; });
                            sectionAnswered = sectionQuestions.filter(function (q) { return responseMap.has(q.id); }).length;
                            sectionProgress = Math.round((sectionAnswered / sectionQuestions.length) * 100);
                            return [2 /*return*/, {
                                    questions: nextQuestions,
                                    section: {
                                        id: section.id,
                                        name: section.name,
                                        progress: sectionProgress,
                                    },
                                    overallProgress: progress,
                                }];
                    }
                });
            });
        };
        SessionService_1.prototype.submitResponse = function (sessionId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var session, question, validation, response, allResponses, responseMap, visibleQuestions, nextQuestion, progress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSessionWithValidation(sessionId, userId)];
                        case 1:
                            session = _a.sent();
                            if (session.status === client_1.SessionStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Session is already completed');
                            }
                            return [4 /*yield*/, this.questionnaireService.getQuestionById(dto.questionId)];
                        case 2:
                            question = _a.sent();
                            if (!question) {
                                throw new common_1.NotFoundException('Question not found');
                            }
                            validation = this.validateResponse(question, dto.value);
                            return [4 /*yield*/, this.prisma.response.upsert({
                                    where: {
                                        sessionId_questionId: {
                                            sessionId: sessionId,
                                            questionId: dto.questionId,
                                        },
                                    },
                                    create: {
                                        sessionId: sessionId,
                                        questionId: dto.questionId,
                                        value: dto.value,
                                        isValid: validation.isValid,
                                        validationErrors: validation.errors ? { errors: validation.errors } : null,
                                        timeSpentSeconds: dto.timeSpentSeconds,
                                    },
                                    update: {
                                        value: dto.value,
                                        isValid: validation.isValid,
                                        validationErrors: validation.errors ? { errors: validation.errors } : null,
                                        timeSpentSeconds: dto.timeSpentSeconds,
                                        revision: { increment: 1 },
                                    },
                                })];
                        case 3:
                            response = _a.sent();
                            return [4 /*yield*/, this.prisma.response.findMany({
                                    where: { sessionId: sessionId },
                                })];
                        case 4:
                            allResponses = _a.sent();
                            responseMap = new Map(allResponses.map(function (r) { return [r.questionId, r.value]; }));
                            return [4 /*yield*/, this.adaptiveLogicService.getVisibleQuestions(session.questionnaireId, responseMap)];
                        case 5:
                            visibleQuestions = _a.sent();
                            nextQuestion = this.findNextUnansweredQuestion(visibleQuestions, dto.questionId, responseMap);
                            progress = this.calculateProgress(allResponses.length, visibleQuestions.length);
                            return [4 /*yield*/, this.prisma.session.update({
                                    where: { id: sessionId },
                                    data: {
                                        currentQuestionId: nextQuestion === null || nextQuestion === void 0 ? void 0 : nextQuestion.id,
                                        currentSectionId: nextQuestion === null || nextQuestion === void 0 ? void 0 : nextQuestion.sectionId,
                                        lastActivityAt: new Date(),
                                        progress: {
                                            percentage: progress.percentage,
                                            answered: progress.answeredQuestions,
                                            total: progress.totalQuestions,
                                        },
                                    },
                                })];
                        case 6:
                            _a.sent();
                            return [2 /*return*/, {
                                    responseId: response.id,
                                    questionId: dto.questionId,
                                    value: dto.value,
                                    validationResult: validation,
                                    progress: progress,
                                    createdAt: response.answeredAt,
                                }];
                    }
                });
            });
        };
        SessionService_1.prototype.completeSession = function (sessionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var session, updatedSession, totalQuestions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSessionWithValidation(sessionId, userId)];
                        case 1:
                            session = _a.sent();
                            if (session.status === client_1.SessionStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Session is already completed');
                            }
                            return [4 /*yield*/, this.prisma.session.update({
                                    where: { id: sessionId },
                                    data: {
                                        status: client_1.SessionStatus.COMPLETED,
                                        completedAt: new Date(),
                                    },
                                    include: {
                                        currentSection: true,
                                        questionnaire: true,
                                    },
                                })];
                        case 2:
                            updatedSession = _a.sent();
                            return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(session.questionnaireId)];
                        case 3:
                            totalQuestions = _a.sent();
                            return [2 /*return*/, this.mapToSessionResponse(updatedSession, totalQuestions)];
                    }
                });
            });
        };
        SessionService_1.prototype.continueSession = function (sessionId_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (sessionId, userId, questionCount) {
                var session, isComplete, responses, responseMap, visibleQuestions, adaptiveState, totalQuestionsInQuestionnaire, skippedCount, nextQuestions, currentIndex, i, question, i, question, answeredCount, progress, currentSectionInfo, sectionQuestions, sectionAnswered, unansweredRequired, canComplete, sessionResponse;
                var _a, _b;
                if (questionCount === void 0) { questionCount = 1; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.session.findUnique({
                                where: { id: sessionId },
                                include: {
                                    currentSection: true,
                                    questionnaire: {
                                        include: {
                                            sections: {
                                                orderBy: { orderIndex: 'asc' },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            session = _c.sent();
                            if (!session) {
                                throw new common_1.NotFoundException('Session not found');
                            }
                            if (session.userId !== userId) {
                                throw new common_1.ForbiddenException('Access denied to this session');
                            }
                            isComplete = session.status === client_1.SessionStatus.COMPLETED;
                            return [4 /*yield*/, this.prisma.response.findMany({
                                    where: { sessionId: sessionId },
                                    orderBy: { answeredAt: 'desc' },
                                })];
                        case 2:
                            responses = _c.sent();
                            responseMap = new Map(responses.map(function (r) { return [r.questionId, r.value]; }));
                            return [4 /*yield*/, this.adaptiveLogicService.getVisibleQuestions(session.questionnaireId, responseMap)];
                        case 3:
                            visibleQuestions = _c.sent();
                            adaptiveState = session.adaptiveState;
                            return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(session.questionnaireId)];
                        case 4:
                            totalQuestionsInQuestionnaire = _c.sent();
                            skippedCount = totalQuestionsInQuestionnaire - visibleQuestions.length;
                            nextQuestions = [];
                            if (!isComplete && session.currentQuestionId) {
                                currentIndex = visibleQuestions.findIndex(function (q) { return q.id === session.currentQuestionId; });
                                // Start from current question and find unanswered ones
                                for (i = Math.max(0, currentIndex); i < visibleQuestions.length && nextQuestions.length < questionCount; i++) {
                                    question = visibleQuestions[i];
                                    if (!responseMap.has(question.id)) {
                                        nextQuestions.push(this.mapQuestionToResponse(question));
                                    }
                                }
                                // If we didn't find enough, check from the beginning
                                if (nextQuestions.length < questionCount) {
                                    for (i = 0; i < currentIndex && nextQuestions.length < questionCount; i++) {
                                        question = visibleQuestions[i];
                                        if (!responseMap.has(question.id)) {
                                            nextQuestions.push(this.mapQuestionToResponse(question));
                                        }
                                    }
                                }
                            }
                            answeredCount = responses.length;
                            progress = this.calculateProgress(answeredCount, visibleQuestions.length);
                            currentSectionInfo = {
                                id: '',
                                name: '',
                                description: undefined,
                                progress: 0,
                                questionsInSection: 0,
                                answeredInSection: 0,
                            };
                            if (session.currentSection) {
                                sectionQuestions = visibleQuestions.filter(function (q) { return q.sectionId === session.currentSection.id; });
                                sectionAnswered = sectionQuestions.filter(function (q) { return responseMap.has(q.id); }).length;
                                currentSectionInfo = {
                                    id: session.currentSection.id,
                                    name: session.currentSection.name,
                                    description: (_a = session.currentSection.description) !== null && _a !== void 0 ? _a : undefined,
                                    progress: sectionQuestions.length > 0
                                        ? Math.round((sectionAnswered / sectionQuestions.length) * 100)
                                        : 0,
                                    questionsInSection: sectionQuestions.length,
                                    answeredInSection: sectionAnswered,
                                };
                            }
                            unansweredRequired = visibleQuestions.filter(function (q) { return q.isRequired && !responseMap.has(q.id); });
                            canComplete = unansweredRequired.length === 0 && answeredCount > 0;
                            sessionResponse = {
                                id: session.id,
                                questionnaireId: session.questionnaireId,
                                userId: session.userId,
                                status: session.status,
                                industry: (_b = session.industry) !== null && _b !== void 0 ? _b : undefined,
                                progress: progress,
                                currentSection: session.currentSection
                                    ? { id: session.currentSection.id, name: session.currentSection.name }
                                    : undefined,
                                createdAt: session.startedAt,
                                lastActivityAt: session.lastActivityAt,
                            };
                            if (!!isComplete) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.session.update({
                                    where: { id: sessionId },
                                    data: { lastActivityAt: new Date() },
                                })];
                        case 5:
                            _c.sent();
                            _c.label = 6;
                        case 6: return [2 /*return*/, {
                                session: sessionResponse,
                                nextQuestions: nextQuestions,
                                currentSection: currentSectionInfo,
                                overallProgress: progress,
                                adaptiveState: {
                                    visibleQuestionCount: visibleQuestions.length,
                                    skippedQuestionCount: skippedCount,
                                    appliedRules: adaptiveState.branchHistory || [],
                                },
                                isComplete: isComplete,
                                canComplete: canComplete,
                            }];
                    }
                });
            });
        };
        SessionService_1.prototype.getSessionWithValidation = function (sessionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var session;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.session.findUnique({
                                where: { id: sessionId },
                            })];
                        case 1:
                            session = _a.sent();
                            if (!session) {
                                throw new common_1.NotFoundException('Session not found');
                            }
                            if (session.userId !== userId) {
                                throw new common_1.ForbiddenException('Access denied to this session');
                            }
                            return [2 /*return*/, session];
                    }
                });
            });
        };
        SessionService_1.prototype.mapToSessionResponse = function (session, totalQuestions) {
            var _a;
            var progress = session.progress;
            return {
                id: session.id,
                questionnaireId: session.questionnaireId,
                userId: session.userId,
                status: session.status,
                industry: (_a = session.industry) !== null && _a !== void 0 ? _a : undefined,
                progress: {
                    percentage: progress.percentage,
                    answeredQuestions: progress.answered,
                    totalQuestions: progress.total || totalQuestions,
                },
                currentSection: session.currentSection
                    ? { id: session.currentSection.id, name: session.currentSection.name }
                    : undefined,
                createdAt: session.startedAt,
                lastActivityAt: session.lastActivityAt,
            };
        };
        SessionService_1.prototype.mapQuestionToResponse = function (question) {
            var _a, _b, _c;
            var options = question.options;
            var validation = question.validationRules;
            return {
                id: question.id,
                text: question.text,
                type: question.type,
                required: question.isRequired,
                helpText: (_a = question.helpText) !== null && _a !== void 0 ? _a : undefined,
                explanation: (_b = question.explanation) !== null && _b !== void 0 ? _b : undefined,
                placeholder: (_c = question.placeholder) !== null && _c !== void 0 ? _c : undefined,
                options: options !== null && options !== void 0 ? options : undefined,
                validation: validation !== null && validation !== void 0 ? validation : undefined,
            };
        };
        SessionService_1.prototype.calculateProgress = function (answered, total) {
            var percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
            var avgTimePerQuestion = 1.5; // minutes
            var estimatedTimeRemaining = Math.ceil((total - answered) * avgTimePerQuestion);
            return {
                percentage: percentage,
                answeredQuestions: answered,
                totalQuestions: total,
                estimatedTimeRemaining: estimatedTimeRemaining,
            };
        };
        SessionService_1.prototype.validateResponse = function (question, value) {
            var errors = [];
            var validation = question.validationRules;
            // Check required
            if (question.isRequired && (value === null || value === undefined || value === '')) {
                errors.push('This field is required');
            }
            // Type-specific validation
            if (value !== null && value !== undefined) {
                if (validation) {
                    // Min/max length for text
                    if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
                        errors.push("Minimum length is ".concat(validation.minLength, " characters"));
                    }
                    if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
                        errors.push("Maximum length is ".concat(validation.maxLength, " characters"));
                    }
                    // Min/max for numbers
                    if (validation.min && typeof value === 'number' && value < validation.min) {
                        errors.push("Minimum value is ".concat(validation.min));
                    }
                    if (validation.max && typeof value === 'number' && value > validation.max) {
                        errors.push("Maximum value is ".concat(validation.max));
                    }
                }
            }
            return {
                isValid: errors.length === 0,
                errors: errors.length > 0 ? errors : undefined,
            };
        };
        SessionService_1.prototype.findNextUnansweredQuestion = function (visibleQuestions, currentQuestionId, responseMap) {
            var currentIndex = visibleQuestions.findIndex(function (q) { return q.id === currentQuestionId; });
            for (var i = currentIndex + 1; i < visibleQuestions.length; i++) {
                if (!responseMap.has(visibleQuestions[i].id)) {
                    return visibleQuestions[i];
                }
            }
            // Check if there are any unanswered questions before current
            for (var i = 0; i < currentIndex; i++) {
                if (!responseMap.has(visibleQuestions[i].id)) {
                    return visibleQuestions[i];
                }
            }
            return null;
        };
        return SessionService_1;
    }());
    __setFunctionName(_classThis, "SessionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SessionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SessionService = _classThis;
}();
exports.SessionService = SessionService;
var client_2 = require("@prisma/client");
var SessionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SessionService = _classThis = /** @class */ (function () {
        function SessionService_2(prisma, questionnaireService, adaptiveLogicService) {
            this.prisma = prisma;
            this.questionnaireService = questionnaireService;
            this.adaptiveLogicService = adaptiveLogicService;
        }
        SessionService_2.prototype.create = function (userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire, totalQuestions, firstSection, firstQuestion, session;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.questionnaireService.findById(dto.questionnaireId)];
                        case 1:
                            questionnaire = _b.sent();
                            return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(dto.questionnaireId)];
                        case 2:
                            totalQuestions = _b.sent();
                            firstSection = questionnaire.sections[0];
                            firstQuestion = (_a = firstSection === null || firstSection === void 0 ? void 0 : firstSection.questions) === null || _a === void 0 ? void 0 : _a[0];
                            return [4 /*yield*/, this.prisma.session.create({
                                    data: {
                                        userId: userId,
                                        questionnaireId: dto.questionnaireId,
                                        questionnaireVersion: questionnaire.version,
                                        industry: dto.industry,
                                        status: client_1.SessionStatus.IN_PROGRESS,
                                        progress: {
                                            percentage: 0,
                                            answered: 0,
                                            total: totalQuestions,
                                        },
                                        currentSectionId: firstSection === null || firstSection === void 0 ? void 0 : firstSection.id,
                                        currentQuestionId: firstQuestion === null || firstQuestion === void 0 ? void 0 : firstQuestion.id,
                                        adaptiveState: {
                                            activeQuestionIds: [],
                                            skippedQuestionIds: [],
                                            branchHistory: [],
                                        },
                                    },
                                    include: {
                                        currentSection: true,
                                    },
                                })];
                        case 3:
                            session = _b.sent();
                            return [2 /*return*/, this.mapToSessionResponse(session, totalQuestions)];
                    }
                });
            });
        };
        SessionService_2.prototype.findById = function (sessionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var session, totalQuestions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.session.findUnique({
                                where: { id: sessionId },
                                include: {
                                    currentSection: true,
                                    questionnaire: true,
                                },
                            })];
                        case 1:
                            session = _a.sent();
                            if (!session) {
                                throw new common_1.NotFoundException('Session not found');
                            }
                            if (session.userId !== userId) {
                                throw new common_1.ForbiddenException('Access denied to this session');
                            }
                            return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(session.questionnaireId)];
                        case 2:
                            totalQuestions = _a.sent();
                            return [2 /*return*/, this.mapToSessionResponse(session, totalQuestions)];
                    }
                });
            });
        };
        SessionService_2.prototype.findAllByUser = function (userId, pagination, status) {
            return __awaiter(this, void 0, void 0, function () {
                var where, _a, sessions, total, items;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = __assign({ userId: userId }, (status && { status: status }));
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.session.findMany({
                                        where: where,
                                        skip: pagination.skip,
                                        take: pagination.limit,
                                        orderBy: { startedAt: 'desc' },
                                        include: {
                                            currentSection: true,
                                            questionnaire: true,
                                        },
                                    }),
                                    this.prisma.session.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), sessions = _a[0], total = _a[1];
                            return [4 /*yield*/, Promise.all(sessions.map(function (session) { return __awaiter(_this, void 0, void 0, function () {
                                    var totalQuestions;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(session.questionnaireId)];
                                            case 1:
                                                totalQuestions = _a.sent();
                                                return [2 /*return*/, this.mapToSessionResponse(session, totalQuestions)];
                                        }
                                    });
                                }); }))];
                        case 2:
                            items = _b.sent();
                            return [2 /*return*/, { items: items, total: total }];
                    }
                });
            });
        };
        SessionService_2.prototype.getNextQuestion = function (sessionId_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (sessionId, userId, count) {
                var session, responses, responseMap, currentQuestion, visibleQuestions, nextQuestions, currentIndex, i, question, answeredCount, totalVisible, progress, section, sectionQuestions, sectionAnswered, sectionProgress;
                if (count === void 0) { count = 1; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSessionWithValidation(sessionId, userId)];
                        case 1:
                            session = _a.sent();
                            if (session.status === client_1.SessionStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Session is already completed');
                            }
                            return [4 /*yield*/, this.prisma.response.findMany({
                                    where: { sessionId: sessionId },
                                })];
                        case 2:
                            responses = _a.sent();
                            responseMap = new Map(responses.map(function (r) { return [r.questionId, r.value]; }));
                            return [4 /*yield*/, this.questionnaireService.getQuestionById(session.currentQuestionId)];
                        case 3:
                            currentQuestion = _a.sent();
                            if (!currentQuestion) {
                                throw new common_1.NotFoundException('Current question not found');
                            }
                            return [4 /*yield*/, this.adaptiveLogicService.getVisibleQuestions(session.questionnaireId, responseMap)];
                        case 4:
                            visibleQuestions = _a.sent();
                            nextQuestions = [];
                            currentIndex = visibleQuestions.findIndex(function (q) { return q.id === session.currentQuestionId; });
                            for (i = currentIndex; i < visibleQuestions.length && nextQuestions.length < count; i++) {
                                question = visibleQuestions[i];
                                // Skip already answered questions
                                if (!responseMap.has(question.id)) {
                                    nextQuestions.push(this.mapQuestionToResponse(question));
                                }
                            }
                            answeredCount = responses.length;
                            totalVisible = visibleQuestions.length;
                            progress = this.calculateProgress(answeredCount, totalVisible);
                            return [4 /*yield*/, this.prisma.section.findUnique({
                                    where: { id: currentQuestion.sectionId },
                                })];
                        case 5:
                            section = _a.sent();
                            sectionQuestions = visibleQuestions.filter(function (q) { return q.sectionId === currentQuestion.sectionId; });
                            sectionAnswered = sectionQuestions.filter(function (q) { return responseMap.has(q.id); }).length;
                            sectionProgress = Math.round((sectionAnswered / sectionQuestions.length) * 100);
                            return [2 /*return*/, {
                                    questions: nextQuestions,
                                    section: {
                                        id: section.id,
                                        name: section.name,
                                        progress: sectionProgress,
                                    },
                                    overallProgress: progress,
                                }];
                    }
                });
            });
        };
        SessionService_2.prototype.submitResponse = function (sessionId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var session, question, validation, response, allResponses, responseMap, visibleQuestions, nextQuestion, progress;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSessionWithValidation(sessionId, userId)];
                        case 1:
                            session = _a.sent();
                            if (session.status === client_1.SessionStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Session is already completed');
                            }
                            return [4 /*yield*/, this.questionnaireService.getQuestionById(dto.questionId)];
                        case 2:
                            question = _a.sent();
                            if (!question) {
                                throw new common_1.NotFoundException('Question not found');
                            }
                            validation = this.validateResponse(question, dto.value);
                            return [4 /*yield*/, this.prisma.response.upsert({
                                    where: {
                                        sessionId_questionId: {
                                            sessionId: sessionId,
                                            questionId: dto.questionId,
                                        },
                                    },
                                    create: {
                                        sessionId: sessionId,
                                        questionId: dto.questionId,
                                        value: dto.value,
                                        isValid: validation.isValid,
                                        validationErrors: validation.errors ? { errors: validation.errors } : client_2.Prisma.JsonNull,
                                        timeSpentSeconds: dto.timeSpentSeconds,
                                    },
                                    update: {
                                        value: dto.value,
                                        isValid: validation.isValid,
                                        validationErrors: validation.errors ? { errors: validation.errors } : client_2.Prisma.JsonNull,
                                        timeSpentSeconds: dto.timeSpentSeconds,
                                        revision: { increment: 1 },
                                    },
                                })];
                        case 3:
                            response = _a.sent();
                            return [4 /*yield*/, this.prisma.response.findMany({
                                    where: { sessionId: sessionId },
                                })];
                        case 4:
                            allResponses = _a.sent();
                            responseMap = new Map(allResponses.map(function (r) { return [r.questionId, r.value]; }));
                            return [4 /*yield*/, this.adaptiveLogicService.getVisibleQuestions(session.questionnaireId, responseMap)];
                        case 5:
                            visibleQuestions = _a.sent();
                            nextQuestion = this.findNextUnansweredQuestion(visibleQuestions, dto.questionId, responseMap);
                            progress = this.calculateProgress(allResponses.length, visibleQuestions.length);
                            return [4 /*yield*/, this.prisma.session.update({
                                    where: { id: sessionId },
                                    data: {
                                        currentQuestionId: nextQuestion === null || nextQuestion === void 0 ? void 0 : nextQuestion.id,
                                        currentSectionId: nextQuestion === null || nextQuestion === void 0 ? void 0 : nextQuestion.sectionId,
                                        lastActivityAt: new Date(),
                                        progress: {
                                            percentage: progress.percentage,
                                            answered: progress.answeredQuestions,
                                            total: progress.totalQuestions,
                                        },
                                    },
                                })];
                        case 6:
                            _a.sent();
                            return [2 /*return*/, {
                                    responseId: response.id,
                                    questionId: dto.questionId,
                                    value: dto.value,
                                    validationResult: validation,
                                    progress: progress,
                                    createdAt: response.answeredAt,
                                }];
                    }
                });
            });
        };
        SessionService_2.prototype.completeSession = function (sessionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var session, updatedSession, totalQuestions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSessionWithValidation(sessionId, userId)];
                        case 1:
                            session = _a.sent();
                            if (session.status === client_1.SessionStatus.COMPLETED) {
                                throw new common_1.BadRequestException('Session is already completed');
                            }
                            return [4 /*yield*/, this.prisma.session.update({
                                    where: { id: sessionId },
                                    data: {
                                        status: client_1.SessionStatus.COMPLETED,
                                        completedAt: new Date(),
                                    },
                                    include: {
                                        currentSection: true,
                                        questionnaire: true,
                                    },
                                })];
                        case 2:
                            updatedSession = _a.sent();
                            return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(session.questionnaireId)];
                        case 3:
                            totalQuestions = _a.sent();
                            return [2 /*return*/, this.mapToSessionResponse(updatedSession, totalQuestions)];
                    }
                });
            });
        };
        SessionService_2.prototype.continueSession = function (sessionId_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (sessionId, userId, questionCount) {
                var session, isComplete, responses, responseMap, visibleQuestions, adaptiveState, totalQuestionsInQuestionnaire, skippedCount, nextQuestions, currentIndex, i, question, i, question, answeredCount, progress, currentSectionInfo, sectionQuestions, sectionAnswered, unansweredRequired, canComplete, sessionResponse;
                var _a, _b;
                if (questionCount === void 0) { questionCount = 1; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.session.findUnique({
                                where: { id: sessionId },
                                include: {
                                    currentSection: true,
                                    questionnaire: {
                                        include: {
                                            sections: {
                                                orderBy: { orderIndex: 'asc' },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            session = _c.sent();
                            if (!session) {
                                throw new common_1.NotFoundException('Session not found');
                            }
                            if (session.userId !== userId) {
                                throw new common_1.ForbiddenException('Access denied to this session');
                            }
                            isComplete = session.status === client_1.SessionStatus.COMPLETED;
                            return [4 /*yield*/, this.prisma.response.findMany({
                                    where: { sessionId: sessionId },
                                    orderBy: { answeredAt: 'desc' },
                                })];
                        case 2:
                            responses = _c.sent();
                            responseMap = new Map(responses.map(function (r) { return [r.questionId, r.value]; }));
                            return [4 /*yield*/, this.adaptiveLogicService.getVisibleQuestions(session.questionnaireId, responseMap)];
                        case 3:
                            visibleQuestions = _c.sent();
                            adaptiveState = session.adaptiveState;
                            return [4 /*yield*/, this.questionnaireService.getTotalQuestionCount(session.questionnaireId)];
                        case 4:
                            totalQuestionsInQuestionnaire = _c.sent();
                            skippedCount = totalQuestionsInQuestionnaire - visibleQuestions.length;
                            nextQuestions = [];
                            if (!isComplete && session.currentQuestionId) {
                                currentIndex = visibleQuestions.findIndex(function (q) { return q.id === session.currentQuestionId; });
                                // Start from current question and find unanswered ones
                                for (i = Math.max(0, currentIndex); i < visibleQuestions.length && nextQuestions.length < questionCount; i++) {
                                    question = visibleQuestions[i];
                                    if (!responseMap.has(question.id)) {
                                        nextQuestions.push(this.mapQuestionToResponse(question));
                                    }
                                }
                                // If we didn't find enough, check from the beginning
                                if (nextQuestions.length < questionCount) {
                                    for (i = 0; i < currentIndex && nextQuestions.length < questionCount; i++) {
                                        question = visibleQuestions[i];
                                        if (!responseMap.has(question.id)) {
                                            nextQuestions.push(this.mapQuestionToResponse(question));
                                        }
                                    }
                                }
                            }
                            answeredCount = responses.length;
                            progress = this.calculateProgress(answeredCount, visibleQuestions.length);
                            currentSectionInfo = {
                                id: '',
                                name: '',
                                description: undefined,
                                progress: 0,
                                questionsInSection: 0,
                                answeredInSection: 0,
                            };
                            if (session.currentSection) {
                                sectionQuestions = visibleQuestions.filter(function (q) { return q.sectionId === session.currentSection.id; });
                                sectionAnswered = sectionQuestions.filter(function (q) { return responseMap.has(q.id); }).length;
                                currentSectionInfo = {
                                    id: session.currentSection.id,
                                    name: session.currentSection.name,
                                    description: (_a = session.currentSection.description) !== null && _a !== void 0 ? _a : undefined,
                                    progress: sectionQuestions.length > 0
                                        ? Math.round((sectionAnswered / sectionQuestions.length) * 100)
                                        : 0,
                                    questionsInSection: sectionQuestions.length,
                                    answeredInSection: sectionAnswered,
                                };
                            }
                            unansweredRequired = visibleQuestions.filter(function (q) { return q.isRequired && !responseMap.has(q.id); });
                            canComplete = unansweredRequired.length === 0 && answeredCount > 0;
                            sessionResponse = {
                                id: session.id,
                                questionnaireId: session.questionnaireId,
                                userId: session.userId,
                                status: session.status,
                                industry: (_b = session.industry) !== null && _b !== void 0 ? _b : undefined,
                                progress: progress,
                                currentSection: session.currentSection
                                    ? { id: session.currentSection.id, name: session.currentSection.name }
                                    : undefined,
                                createdAt: session.startedAt,
                                lastActivityAt: session.lastActivityAt,
                            };
                            if (!!isComplete) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.session.update({
                                    where: { id: sessionId },
                                    data: { lastActivityAt: new Date() },
                                })];
                        case 5:
                            _c.sent();
                            _c.label = 6;
                        case 6: return [2 /*return*/, {
                                session: sessionResponse,
                                nextQuestions: nextQuestions,
                                currentSection: currentSectionInfo,
                                overallProgress: progress,
                                adaptiveState: {
                                    visibleQuestionCount: visibleQuestions.length,
                                    skippedQuestionCount: skippedCount,
                                    appliedRules: adaptiveState.branchHistory || [],
                                },
                                isComplete: isComplete,
                                canComplete: canComplete,
                            }];
                    }
                });
            });
        };
        SessionService_2.prototype.getSessionWithValidation = function (sessionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var session;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.session.findUnique({
                                where: { id: sessionId },
                            })];
                        case 1:
                            session = _a.sent();
                            if (!session) {
                                throw new common_1.NotFoundException('Session not found');
                            }
                            if (session.userId !== userId) {
                                throw new common_1.ForbiddenException('Access denied to this session');
                            }
                            return [2 /*return*/, session];
                    }
                });
            });
        };
        SessionService_2.prototype.mapToSessionResponse = function (session, totalQuestions) {
            var _a;
            var progress = session.progress;
            return {
                id: session.id,
                questionnaireId: session.questionnaireId,
                userId: session.userId,
                status: session.status,
                industry: (_a = session.industry) !== null && _a !== void 0 ? _a : undefined,
                progress: {
                    percentage: progress.percentage,
                    answeredQuestions: progress.answered,
                    totalQuestions: progress.total || totalQuestions,
                },
                currentSection: session.currentSection
                    ? { id: session.currentSection.id, name: session.currentSection.name }
                    : undefined,
                createdAt: session.startedAt,
                lastActivityAt: session.lastActivityAt,
            };
        };
        SessionService_2.prototype.mapQuestionToResponse = function (question) {
            var _a, _b, _c;
            var options = question.options;
            var validation = question.validationRules;
            return {
                id: question.id,
                text: question.text,
                type: question.type,
                required: question.isRequired,
                helpText: (_a = question.helpText) !== null && _a !== void 0 ? _a : undefined,
                explanation: (_b = question.explanation) !== null && _b !== void 0 ? _b : undefined,
                placeholder: (_c = question.placeholder) !== null && _c !== void 0 ? _c : undefined,
                options: options !== null && options !== void 0 ? options : undefined,
                validation: validation !== null && validation !== void 0 ? validation : undefined,
            };
        };
        SessionService_2.prototype.calculateProgress = function (answered, total) {
            var percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
            var avgTimePerQuestion = 1.5; // minutes
            var estimatedTimeRemaining = Math.ceil((total - answered) * avgTimePerQuestion);
            return {
                percentage: percentage,
                answeredQuestions: answered,
                totalQuestions: total,
                estimatedTimeRemaining: estimatedTimeRemaining,
            };
        };
        SessionService_2.prototype.validateResponse = function (question, value) {
            var errors = [];
            var validation = question.validationRules;
            // Check required
            if (question.isRequired && (value === null || value === undefined || value === '')) {
                errors.push('This field is required');
            }
            // Type-specific validation
            if (value !== null && value !== undefined) {
                if (validation) {
                    // Min/max length for text
                    if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
                        errors.push("Minimum length is ".concat(validation.minLength, " characters"));
                    }
                    if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
                        errors.push("Maximum length is ".concat(validation.maxLength, " characters"));
                    }
                    // Min/max for numbers
                    if (validation.min && typeof value === 'number' && value < validation.min) {
                        errors.push("Minimum value is ".concat(validation.min));
                    }
                    if (validation.max && typeof value === 'number' && value > validation.max) {
                        errors.push("Maximum value is ".concat(validation.max));
                    }
                }
            }
            return {
                isValid: errors.length === 0,
                errors: errors.length > 0 ? errors : undefined,
            };
        };
        SessionService_2.prototype.findNextUnansweredQuestion = function (visibleQuestions, currentQuestionId, responseMap) {
            var currentIndex = visibleQuestions.findIndex(function (q) { return q.id === currentQuestionId; });
            for (var i = currentIndex + 1; i < visibleQuestions.length; i++) {
                if (!responseMap.has(visibleQuestions[i].id)) {
                    return visibleQuestions[i];
                }
            }
            // Check if there are any unanswered questions before current
            for (var i = 0; i < currentIndex; i++) {
                if (!responseMap.has(visibleQuestions[i].id)) {
                    return visibleQuestions[i];
                }
            }
            return null;
        };
        return SessionService_2;
    }());
    __setFunctionName(_classThis, "SessionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SessionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SessionService = _classThis;
}();
exports.SessionService = SessionService;
