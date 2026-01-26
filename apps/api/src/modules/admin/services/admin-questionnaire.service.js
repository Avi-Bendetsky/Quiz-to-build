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
exports.AdminQuestionnaireService = void 0;
var common_1 = require("@nestjs/common");
var AdminQuestionnaireService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminQuestionnaireService = _classThis = /** @class */ (function () {
        function AdminQuestionnaireService_1(prisma, auditService) {
            this.prisma = prisma;
            this.auditService = auditService;
        }
        // ============================================================================
        // QUESTIONNAIRE CRUD
        // ============================================================================
        AdminQuestionnaireService_1.prototype.findAllQuestionnaires = function (pagination) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, items, total;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.questionnaire.findMany({
                                    skip: pagination.skip,
                                    take: pagination.limit,
                                    orderBy: { createdAt: 'desc' },
                                    include: {
                                        _count: {
                                            select: { sections: true, sessions: true },
                                        },
                                    },
                                }),
                                this.prisma.questionnaire.count(),
                            ])];
                        case 1:
                            _a = _b.sent(), items = _a[0], total = _a[1];
                            return [2 /*return*/, { items: items, total: total }];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.findQuestionnaireById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.findUnique({
                                where: { id: id },
                                include: {
                                    sections: {
                                        orderBy: { orderIndex: 'asc' },
                                        include: {
                                            questions: {
                                                orderBy: { orderIndex: 'asc' },
                                                include: {
                                                    visibilityRules: {
                                                        orderBy: { priority: 'desc' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    _count: {
                                        select: { sessions: true },
                                    },
                                },
                            })];
                        case 1:
                            questionnaire = _a.sent();
                            if (!questionnaire) {
                                throw new common_1.NotFoundException("Questionnaire with ID ".concat(id, " not found"));
                            }
                            return [2 /*return*/, questionnaire];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.createQuestionnaire = function (dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.create({
                                data: {
                                    name: dto.name,
                                    description: dto.description,
                                    industry: dto.industry,
                                    isDefault: (_a = dto.isDefault) !== null && _a !== void 0 ? _a : false,
                                    estimatedTime: dto.estimatedTime,
                                    metadata: ((_b = dto.metadata) !== null && _b !== void 0 ? _b : {}),
                                    createdById: userId,
                                },
                            })];
                        case 1:
                            questionnaire = _c.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'CREATE_QUESTIONNAIRE',
                                    resourceType: 'Questionnaire',
                                    resourceId: questionnaire.id,
                                    changes: { after: questionnaire },
                                })];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, questionnaire];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.updateQuestionnaire = function (id, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, questionnaire;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.findUnique({
                                where: { id: id },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Questionnaire with ID ".concat(id, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.questionnaire.update({
                                    where: { id: id },
                                    data: {
                                        name: dto.name,
                                        description: dto.description,
                                        industry: dto.industry,
                                        isDefault: dto.isDefault,
                                        isActive: dto.isActive,
                                        estimatedTime: dto.estimatedTime,
                                        metadata: dto.metadata,
                                    },
                                })];
                        case 2:
                            questionnaire = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'UPDATE_QUESTIONNAIRE',
                                    resourceType: 'Questionnaire',
                                    resourceId: id,
                                    changes: { before: existing, after: questionnaire },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, questionnaire];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.deleteQuestionnaire = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.findUnique({
                                where: { id: id },
                                include: { _count: { select: { sessions: true } } },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Questionnaire with ID ".concat(id, " not found"));
                            }
                            // Soft delete by setting isActive to false
                            return [4 /*yield*/, this.prisma.questionnaire.update({
                                    where: { id: id },
                                    data: { isActive: false },
                                })];
                        case 2:
                            // Soft delete by setting isActive to false
                            _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'DELETE_QUESTIONNAIRE',
                                    resourceType: 'Questionnaire',
                                    resourceId: id,
                                    changes: { before: existing },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ============================================================================
        // SECTION CRUD
        // ============================================================================
        AdminQuestionnaireService_1.prototype.createSection = function (questionnaireId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire, maxOrder, orderIndex, section;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.findUnique({
                                where: { id: questionnaireId },
                                include: { sections: { select: { orderIndex: true } } },
                            })];
                        case 1:
                            questionnaire = _c.sent();
                            if (!questionnaire) {
                                throw new common_1.NotFoundException("Questionnaire with ID ".concat(questionnaireId, " not found"));
                            }
                            maxOrder = questionnaire.sections.reduce(function (max, s) { return Math.max(max, s.orderIndex); }, -1);
                            orderIndex = (_a = dto.orderIndex) !== null && _a !== void 0 ? _a : maxOrder + 1;
                            return [4 /*yield*/, this.prisma.section.create({
                                    data: {
                                        questionnaireId: questionnaireId,
                                        name: dto.name,
                                        description: dto.description,
                                        icon: dto.icon,
                                        estimatedTime: dto.estimatedTime,
                                        orderIndex: orderIndex,
                                        metadata: ((_b = dto.metadata) !== null && _b !== void 0 ? _b : {}),
                                    },
                                })];
                        case 2:
                            section = _c.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'CREATE_SECTION',
                                    resourceType: 'Section',
                                    resourceId: section.id,
                                    changes: { after: section },
                                })];
                        case 3:
                            _c.sent();
                            return [2 /*return*/, section];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.updateSection = function (id, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, section;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.section.findUnique({ where: { id: id } })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Section with ID ".concat(id, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.section.update({
                                    where: { id: id },
                                    data: {
                                        name: dto.name,
                                        description: dto.description,
                                        icon: dto.icon,
                                        estimatedTime: dto.estimatedTime,
                                        orderIndex: dto.orderIndex,
                                        metadata: dto.metadata,
                                    },
                                })];
                        case 2:
                            section = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'UPDATE_SECTION',
                                    resourceType: 'Section',
                                    resourceId: id,
                                    changes: { before: existing, after: section },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, section];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.deleteSection = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.section.findUnique({
                                where: { id: id },
                                include: { _count: { select: { questions: true } } },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Section with ID ".concat(id, " not found"));
                            }
                            if (existing._count.questions > 0) {
                                throw new common_1.BadRequestException("Cannot delete section with ".concat(existing._count.questions, " questions. Delete questions first."));
                            }
                            return [4 /*yield*/, this.prisma.section.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'DELETE_SECTION',
                                    resourceType: 'Section',
                                    resourceId: id,
                                    changes: { before: existing },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.reorderSections = function (questionnaireId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire, sections;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.findUnique({
                                where: { id: questionnaireId },
                            })];
                        case 1:
                            questionnaire = _a.sent();
                            if (!questionnaire) {
                                throw new common_1.NotFoundException("Questionnaire with ID ".concat(questionnaireId, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.$transaction(dto.items.map(function (item) {
                                    return _this.prisma.section.update({
                                        where: { id: item.id },
                                        data: { orderIndex: item.orderIndex },
                                    });
                                }))];
                        case 2:
                            sections = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'REORDER_SECTIONS',
                                    resourceType: 'Questionnaire',
                                    resourceId: questionnaireId,
                                    changes: { after: dto.items },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, sections];
                    }
                });
            });
        };
        // ============================================================================
        // QUESTION CRUD
        // ============================================================================
        AdminQuestionnaireService_1.prototype.createQuestion = function (sectionId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var section, maxOrder, orderIndex, question;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.prisma.section.findUnique({
                                where: { id: sectionId },
                                include: { questions: { select: { orderIndex: true } } },
                            })];
                        case 1:
                            section = _e.sent();
                            if (!section) {
                                throw new common_1.NotFoundException("Section with ID ".concat(sectionId, " not found"));
                            }
                            maxOrder = section.questions.reduce(function (max, q) { return Math.max(max, q.orderIndex); }, -1);
                            orderIndex = (_a = dto.orderIndex) !== null && _a !== void 0 ? _a : maxOrder + 1;
                            return [4 /*yield*/, this.prisma.question.create({
                                    data: {
                                        sectionId: sectionId,
                                        text: dto.text,
                                        type: dto.type,
                                        helpText: dto.helpText,
                                        explanation: dto.explanation,
                                        placeholder: dto.placeholder,
                                        isRequired: (_b = dto.isRequired) !== null && _b !== void 0 ? _b : false,
                                        options: dto.options,
                                        validationRules: dto.validationRules,
                                        defaultValue: dto.defaultValue,
                                        suggestedAnswer: dto.suggestedAnswer,
                                        industryTags: (_c = dto.industryTags) !== null && _c !== void 0 ? _c : [],
                                        documentMappings: dto.documentMappings,
                                        orderIndex: orderIndex,
                                        metadata: ((_d = dto.metadata) !== null && _d !== void 0 ? _d : {}),
                                    },
                                })];
                        case 2:
                            question = _e.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'CREATE_QUESTION',
                                    resourceType: 'Question',
                                    resourceId: question.id,
                                    changes: { after: question },
                                })];
                        case 3:
                            _e.sent();
                            return [2 /*return*/, question];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.updateQuestion = function (id, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, question;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.question.findUnique({ where: { id: id } })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Question with ID ".concat(id, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.question.update({
                                    where: { id: id },
                                    data: {
                                        text: dto.text,
                                        type: dto.type,
                                        helpText: dto.helpText,
                                        explanation: dto.explanation,
                                        placeholder: dto.placeholder,
                                        isRequired: dto.isRequired,
                                        options: dto.options,
                                        validationRules: dto.validationRules,
                                        defaultValue: dto.defaultValue,
                                        suggestedAnswer: dto.suggestedAnswer,
                                        industryTags: dto.industryTags,
                                        documentMappings: dto.documentMappings,
                                        orderIndex: dto.orderIndex,
                                        metadata: dto.metadata,
                                    },
                                })];
                        case 2:
                            question = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'UPDATE_QUESTION',
                                    resourceType: 'Question',
                                    resourceId: id,
                                    changes: { before: existing, after: question },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, question];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.deleteQuestion = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.question.findUnique({
                                where: { id: id },
                                include: { _count: { select: { responses: true } } },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Question with ID ".concat(id, " not found"));
                            }
                            if (existing._count.responses > 0) {
                                throw new common_1.BadRequestException("Cannot delete question with ".concat(existing._count.responses, " responses. This would corrupt session data."));
                            }
                            return [4 /*yield*/, this.prisma.question.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'DELETE_QUESTION',
                                    resourceType: 'Question',
                                    resourceId: id,
                                    changes: { before: existing },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.reorderQuestions = function (sectionId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var section, questions;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.section.findUnique({
                                where: { id: sectionId },
                            })];
                        case 1:
                            section = _a.sent();
                            if (!section) {
                                throw new common_1.NotFoundException("Section with ID ".concat(sectionId, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.$transaction(dto.items.map(function (item) {
                                    return _this.prisma.question.update({
                                        where: { id: item.id },
                                        data: { orderIndex: item.orderIndex },
                                    });
                                }))];
                        case 2:
                            questions = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'REORDER_QUESTIONS',
                                    resourceType: 'Section',
                                    resourceId: sectionId,
                                    changes: { after: dto.items },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, questions];
                    }
                });
            });
        };
        // ============================================================================
        // VISIBILITY RULE CRUD
        // ============================================================================
        AdminQuestionnaireService_1.prototype.findRulesByQuestion = function (questionId) {
            return __awaiter(this, void 0, void 0, function () {
                var question;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.question.findUnique({
                                where: { id: questionId },
                            })];
                        case 1:
                            question = _a.sent();
                            if (!question) {
                                throw new common_1.NotFoundException("Question with ID ".concat(questionId, " not found"));
                            }
                            return [2 /*return*/, this.prisma.visibilityRule.findMany({
                                    where: { questionId: questionId },
                                    orderBy: { priority: 'desc' },
                                })];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.createVisibilityRule = function (questionId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var question, rule;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.question.findUnique({
                                where: { id: questionId },
                            })];
                        case 1:
                            question = _c.sent();
                            if (!question) {
                                throw new common_1.NotFoundException("Question with ID ".concat(questionId, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.visibilityRule.create({
                                    data: {
                                        questionId: questionId,
                                        condition: dto.condition,
                                        action: dto.action,
                                        targetQuestionIds: dto.targetQuestionIds,
                                        priority: (_a = dto.priority) !== null && _a !== void 0 ? _a : 0,
                                        isActive: (_b = dto.isActive) !== null && _b !== void 0 ? _b : true,
                                    },
                                })];
                        case 2:
                            rule = _c.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'CREATE_VISIBILITY_RULE',
                                    resourceType: 'VisibilityRule',
                                    resourceId: rule.id,
                                    changes: { after: rule },
                                })];
                        case 3:
                            _c.sent();
                            return [2 /*return*/, rule];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.updateVisibilityRule = function (id, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, rule;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.visibilityRule.findUnique({
                                where: { id: id },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Visibility rule with ID ".concat(id, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.visibilityRule.update({
                                    where: { id: id },
                                    data: {
                                        condition: dto.condition,
                                        action: dto.action,
                                        targetQuestionIds: dto.targetQuestionIds,
                                        priority: dto.priority,
                                        isActive: dto.isActive,
                                    },
                                })];
                        case 2:
                            rule = _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'UPDATE_VISIBILITY_RULE',
                                    resourceType: 'VisibilityRule',
                                    resourceId: id,
                                    changes: { before: existing, after: rule },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, rule];
                    }
                });
            });
        };
        AdminQuestionnaireService_1.prototype.deleteVisibilityRule = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.visibilityRule.findUnique({
                                where: { id: id },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException("Visibility rule with ID ".concat(id, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.visibilityRule.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.auditService.log({
                                    userId: userId,
                                    action: 'DELETE_VISIBILITY_RULE',
                                    resourceType: 'VisibilityRule',
                                    resourceId: id,
                                    changes: { before: existing },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AdminQuestionnaireService_1;
    }());
    __setFunctionName(_classThis, "AdminQuestionnaireService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminQuestionnaireService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminQuestionnaireService = _classThis;
}();
exports.AdminQuestionnaireService = AdminQuestionnaireService;
