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
exports.QuestionnaireService = void 0;
var common_1 = require("@nestjs/common");
var QuestionnaireService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var QuestionnaireService = _classThis = /** @class */ (function () {
        function QuestionnaireService_1(prisma) {
            this.prisma = prisma;
        }
        QuestionnaireService_1.prototype.findAll = function (pagination, industry) {
            return __awaiter(this, void 0, void 0, function () {
                var where, _a, questionnaires, total, items;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = __assign({ isActive: true }, (industry && { industry: industry }));
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.questionnaire.findMany({
                                        where: where,
                                        skip: pagination.skip,
                                        take: pagination.limit,
                                        orderBy: { createdAt: 'desc' },
                                        include: {
                                            sections: {
                                                orderBy: { orderIndex: 'asc' },
                                                include: {
                                                    _count: {
                                                        select: { questions: true },
                                                    },
                                                },
                                            },
                                        },
                                    }),
                                    this.prisma.questionnaire.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), questionnaires = _a[0], total = _a[1];
                            items = questionnaires.map(function (q) { return _this.mapToListItem(q); });
                            return [2 /*return*/, { items: items, total: total }];
                    }
                });
            });
        };
        QuestionnaireService_1.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.findUnique({
                                where: { id: id, isActive: true },
                                include: {
                                    sections: {
                                        orderBy: { orderIndex: 'asc' },
                                        include: {
                                            questions: {
                                                orderBy: { orderIndex: 'asc' },
                                                include: {
                                                    visibilityRules: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            questionnaire = _a.sent();
                            if (!questionnaire) {
                                throw new common_1.NotFoundException('Questionnaire not found');
                            }
                            return [2 /*return*/, this.mapToDetail(questionnaire)];
                    }
                });
            });
        };
        QuestionnaireService_1.prototype.getDefaultQuestionnaire = function () {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.findFirst({
                                where: { isDefault: true, isActive: true },
                                include: {
                                    sections: {
                                        orderBy: { orderIndex: 'asc' },
                                        include: {
                                            questions: {
                                                orderBy: { orderIndex: 'asc' },
                                                include: {
                                                    visibilityRules: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            questionnaire = _a.sent();
                            if (!questionnaire) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, this.mapToDetail(questionnaire)];
                    }
                });
            });
        };
        QuestionnaireService_1.prototype.getQuestionById = function (questionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.question.findUnique({
                            where: { id: questionId },
                            include: {
                                visibilityRules: true,
                                section: {
                                    include: {
                                        questionnaire: true,
                                    },
                                },
                            },
                        })];
                });
            });
        };
        QuestionnaireService_1.prototype.getQuestionsBySection = function (sectionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.question.findMany({
                            where: { sectionId: sectionId },
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                visibilityRules: true,
                            },
                        })];
                });
            });
        };
        QuestionnaireService_1.prototype.getTotalQuestionCount = function (questionnaireId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.question.count({
                            where: {
                                section: {
                                    questionnaireId: questionnaireId,
                                },
                            },
                        })];
                });
            });
        };
        QuestionnaireService_1.prototype.mapToListItem = function (questionnaire) {
            var _a, _b, _c;
            var totalQuestions = questionnaire.sections.reduce(function (sum, section) { return sum + section._count.questions; }, 0);
            return {
                id: questionnaire.id,
                name: questionnaire.name,
                description: (_a = questionnaire.description) !== null && _a !== void 0 ? _a : undefined,
                industry: (_b = questionnaire.industry) !== null && _b !== void 0 ? _b : undefined,
                version: questionnaire.version,
                estimatedTime: (_c = questionnaire.estimatedTime) !== null && _c !== void 0 ? _c : undefined,
                totalQuestions: totalQuestions,
                sections: questionnaire.sections.map(function (section) { return ({
                    id: section.id,
                    name: section.name,
                    questionCount: section._count.questions,
                }); }),
                createdAt: questionnaire.createdAt,
            };
        };
        QuestionnaireService_1.prototype.mapToDetail = function (questionnaire) {
            var _this = this;
            var _a, _b, _c;
            return {
                id: questionnaire.id,
                name: questionnaire.name,
                description: (_a = questionnaire.description) !== null && _a !== void 0 ? _a : undefined,
                industry: (_b = questionnaire.industry) !== null && _b !== void 0 ? _b : undefined,
                version: questionnaire.version,
                estimatedTime: (_c = questionnaire.estimatedTime) !== null && _c !== void 0 ? _c : undefined,
                sections: questionnaire.sections.map(function (section) {
                    var _a, _b, _c;
                    return ({
                        id: section.id,
                        name: section.name,
                        description: (_a = section.description) !== null && _a !== void 0 ? _a : undefined,
                        order: section.orderIndex,
                        icon: (_b = section.icon) !== null && _b !== void 0 ? _b : undefined,
                        estimatedTime: (_c = section.estimatedTime) !== null && _c !== void 0 ? _c : undefined,
                        questionCount: section.questions.length,
                        questions: section.questions.map(function (question) { return _this.mapQuestion(question); }),
                    });
                }),
            };
        };
        QuestionnaireService_1.prototype.mapQuestion = function (question) {
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
        return QuestionnaireService_1;
    }());
    __setFunctionName(_classThis, "QuestionnaireService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QuestionnaireService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QuestionnaireService = _classThis;
}();
exports.QuestionnaireService = QuestionnaireService;
var QuestionnaireService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var QuestionnaireService = _classThis = /** @class */ (function () {
        function QuestionnaireService_2(prisma) {
            this.prisma = prisma;
        }
        QuestionnaireService_2.prototype.findAll = function (pagination, industry) {
            return __awaiter(this, void 0, void 0, function () {
                var where, _a, questionnaires, total, items;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = __assign({ isActive: true }, (industry && { industry: industry }));
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.questionnaire.findMany({
                                        where: where,
                                        skip: pagination.skip,
                                        take: pagination.limit,
                                        orderBy: { createdAt: 'desc' },
                                        include: {
                                            sections: {
                                                orderBy: { orderIndex: 'asc' },
                                                include: {
                                                    _count: {
                                                        select: { questions: true },
                                                    },
                                                },
                                            },
                                        },
                                    }),
                                    this.prisma.questionnaire.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), questionnaires = _a[0], total = _a[1];
                            items = questionnaires.map(function (q) { return _this.mapToListItem(q); });
                            return [2 /*return*/, { items: items, total: total }];
                    }
                });
            });
        };
        QuestionnaireService_2.prototype.findById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.findUnique({
                                where: { id: id, isActive: true },
                                include: {
                                    sections: {
                                        orderBy: { orderIndex: 'asc' },
                                        include: {
                                            questions: {
                                                orderBy: { orderIndex: 'asc' },
                                                include: {
                                                    visibilityRules: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            questionnaire = _a.sent();
                            if (!questionnaire) {
                                throw new common_1.NotFoundException('Questionnaire not found');
                            }
                            return [2 /*return*/, this.mapToDetail(questionnaire)];
                    }
                });
            });
        };
        QuestionnaireService_2.prototype.getDefaultQuestionnaire = function () {
            return __awaiter(this, void 0, void 0, function () {
                var questionnaire;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.questionnaire.findFirst({
                                where: { isDefault: true, isActive: true },
                                include: {
                                    sections: {
                                        orderBy: { orderIndex: 'asc' },
                                        include: {
                                            questions: {
                                                orderBy: { orderIndex: 'asc' },
                                                include: {
                                                    visibilityRules: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                        case 1:
                            questionnaire = _a.sent();
                            if (!questionnaire) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, this.mapToDetail(questionnaire)];
                    }
                });
            });
        };
        QuestionnaireService_2.prototype.getQuestionById = function (questionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.question.findUnique({
                            where: { id: questionId },
                            include: {
                                visibilityRules: true,
                                section: {
                                    include: {
                                        questionnaire: true,
                                    },
                                },
                            },
                        })];
                });
            });
        };
        QuestionnaireService_2.prototype.getQuestionsBySection = function (sectionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.question.findMany({
                            where: { sectionId: sectionId },
                            orderBy: { orderIndex: 'asc' },
                            include: {
                                visibilityRules: true,
                            },
                        })];
                });
            });
        };
        QuestionnaireService_2.prototype.getTotalQuestionCount = function (questionnaireId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.question.count({
                            where: {
                                section: {
                                    questionnaireId: questionnaireId,
                                },
                            },
                        })];
                });
            });
        };
        QuestionnaireService_2.prototype.mapToListItem = function (questionnaire) {
            var _a, _b, _c;
            var totalQuestions = questionnaire.sections.reduce(function (sum, section) { return sum + section._count.questions; }, 0);
            return {
                id: questionnaire.id,
                name: questionnaire.name,
                description: (_a = questionnaire.description) !== null && _a !== void 0 ? _a : undefined,
                industry: (_b = questionnaire.industry) !== null && _b !== void 0 ? _b : undefined,
                version: questionnaire.version,
                estimatedTime: (_c = questionnaire.estimatedTime) !== null && _c !== void 0 ? _c : undefined,
                totalQuestions: totalQuestions,
                sections: questionnaire.sections.map(function (section) { return ({
                    id: section.id,
                    name: section.name,
                    questionCount: section._count.questions,
                }); }),
                createdAt: questionnaire.createdAt,
            };
        };
        QuestionnaireService_2.prototype.mapToDetail = function (questionnaire) {
            var _this = this;
            var _a, _b, _c;
            return {
                id: questionnaire.id,
                name: questionnaire.name,
                description: (_a = questionnaire.description) !== null && _a !== void 0 ? _a : undefined,
                industry: (_b = questionnaire.industry) !== null && _b !== void 0 ? _b : undefined,
                version: questionnaire.version,
                estimatedTime: (_c = questionnaire.estimatedTime) !== null && _c !== void 0 ? _c : undefined,
                sections: questionnaire.sections.map(function (section) {
                    var _a, _b, _c;
                    return ({
                        id: section.id,
                        name: section.name,
                        description: (_a = section.description) !== null && _a !== void 0 ? _a : undefined,
                        order: section.orderIndex,
                        icon: (_b = section.icon) !== null && _b !== void 0 ? _b : undefined,
                        estimatedTime: (_c = section.estimatedTime) !== null && _c !== void 0 ? _c : undefined,
                        questionCount: section.questions.length,
                        questions: section.questions.map(function (question) { return _this.mapQuestion(question); }),
                    });
                }),
            };
        };
        QuestionnaireService_2.prototype.mapQuestion = function (question) {
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
        return QuestionnaireService_2;
    }());
    __setFunctionName(_classThis, "QuestionnaireService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QuestionnaireService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QuestionnaireService = _classThis;
}();
exports.QuestionnaireService = QuestionnaireService;
