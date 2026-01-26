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
exports.AdaptiveLogicService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var AdaptiveLogicService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdaptiveLogicService = _classThis = /** @class */ (function () {
        function AdaptiveLogicService_1(prisma, conditionEvaluator) {
            this.prisma = prisma;
            this.conditionEvaluator = conditionEvaluator;
        }
        /**
         * Get all visible questions for a questionnaire based on current responses
         */
        AdaptiveLogicService_1.prototype.getVisibleQuestions = function (questionnaireId, responses) {
            return __awaiter(this, void 0, void 0, function () {
                var questions, visibleQuestions, _i, questions_1, question, state;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.question.findMany({
                                where: {
                                    section: {
                                        questionnaireId: questionnaireId,
                                    },
                                },
                                include: {
                                    visibilityRules: {
                                        where: { isActive: true },
                                        orderBy: { priority: 'desc' },
                                    },
                                    section: true,
                                },
                                orderBy: [
                                    { section: { orderIndex: 'asc' } },
                                    { orderIndex: 'asc' },
                                ],
                            })];
                        case 1:
                            questions = _a.sent();
                            visibleQuestions = [];
                            for (_i = 0, questions_1 = questions; _i < questions_1.length; _i++) {
                                question = questions_1[_i];
                                state = this.evaluateQuestionState(question, responses);
                                if (state.visible) {
                                    visibleQuestions.push(question);
                                }
                            }
                            return [2 /*return*/, visibleQuestions];
                    }
                });
            });
        };
        /**
         * Evaluate the state of a specific question
         */
        AdaptiveLogicService_1.prototype.evaluateQuestionState = function (question, responses) {
            // Default state
            var state = {
                visible: true,
                required: question.isRequired,
                disabled: false,
            };
            // If no visibility rules, return default state
            if (!question.visibilityRules || question.visibilityRules.length === 0) {
                return state;
            }
            // Evaluate each rule in priority order (highest first)
            for (var _i = 0, _a = question.visibilityRules; _i < _a.length; _i++) {
                var rule = _a[_i];
                var condition = rule.condition;
                var ruleResult = this.evaluateCondition(condition, responses);
                if (ruleResult) {
                    // Apply the rule's action
                    switch (rule.action) {
                        case client_1.VisibilityAction.SHOW:
                            state.visible = true;
                            break;
                        case client_1.VisibilityAction.HIDE:
                            state.visible = false;
                            break;
                        case client_1.VisibilityAction.REQUIRE:
                            state.required = true;
                            break;
                        case client_1.VisibilityAction.UNREQUIRE:
                            state.required = false;
                            break;
                    }
                }
            }
            return state;
        };
        /**
         * Get the next question in the flow based on branching rules
         */
        AdaptiveLogicService_1.prototype.getNextQuestion = function (currentQuestionId, responses) {
            return __awaiter(this, void 0, void 0, function () {
                var currentQuestion, visibleQuestions, currentIndex;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.question.findUnique({
                                where: { id: currentQuestionId },
                                include: {
                                    section: {
                                        include: {
                                            questionnaire: true,
                                        },
                                    },
                                    visibilityRules: {
                                        where: { isActive: true },
                                    },
                                },
                            })];
                        case 1:
                            currentQuestion = _a.sent();
                            if (!currentQuestion) {
                                return [2 /*return*/, null];
                            }
                            return [4 /*yield*/, this.getVisibleQuestions(currentQuestion.section.questionnaireId, responses)];
                        case 2:
                            visibleQuestions = _a.sent();
                            currentIndex = visibleQuestions.findIndex(function (q) { return q.id === currentQuestionId; });
                            if (currentIndex === -1 || currentIndex >= visibleQuestions.length - 1) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, visibleQuestions[currentIndex + 1]];
                    }
                });
            });
        };
        /**
         * Evaluate a condition against responses
         */
        AdaptiveLogicService_1.prototype.evaluateCondition = function (condition, responses) {
            return this.conditionEvaluator.evaluate(condition, responses);
        };
        /**
         * Evaluate multiple conditions with a logical operator
         */
        AdaptiveLogicService_1.prototype.evaluateConditions = function (conditions, operator, responses) {
            var _this = this;
            if (conditions.length === 0) {
                return true;
            }
            var results = conditions.map(function (c) { return _this.evaluateCondition(c, responses); });
            if (operator === 'AND') {
                return results.every(function (r) { return r; });
            }
            else {
                return results.some(function (r) { return r; });
            }
        };
        /**
         * Calculate which questions were added or removed due to a response change
         */
        AdaptiveLogicService_1.prototype.calculateAdaptiveChanges = function (questionnaireId, previousResponses, currentResponses) {
            return __awaiter(this, void 0, void 0, function () {
                var previousVisible, currentVisible, previousIds, currentIds, added, removed;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getVisibleQuestions(questionnaireId, previousResponses)];
                        case 1:
                            previousVisible = _a.sent();
                            return [4 /*yield*/, this.getVisibleQuestions(questionnaireId, currentResponses)];
                        case 2:
                            currentVisible = _a.sent();
                            previousIds = new Set(previousVisible.map(function (q) { return q.id; }));
                            currentIds = new Set(currentVisible.map(function (q) { return q.id; }));
                            added = currentVisible.filter(function (q) { return !previousIds.has(q.id); }).map(function (q) { return q.id; });
                            removed = previousVisible.filter(function (q) { return !currentIds.has(q.id); }).map(function (q) { return q.id; });
                            return [2 /*return*/, { added: added, removed: removed }];
                    }
                });
            });
        };
        /**
         * Get all rules that affect a specific question
         */
        AdaptiveLogicService_1.prototype.getRulesForQuestion = function (questionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.visibilityRule.findMany({
                            where: {
                                OR: [
                                    { questionId: questionId },
                                    { targetQuestionIds: { has: questionId } },
                                ],
                                isActive: true,
                            },
                            orderBy: { priority: 'desc' },
                        })];
                });
            });
        };
        /**
         * Build a dependency graph for questions
         */
        AdaptiveLogicService_1.prototype.buildDependencyGraph = function (questionnaireId) {
            return __awaiter(this, void 0, void 0, function () {
                var rules, graph, _i, rules_1, rule, condition, sourceQuestionId, _a, _b, targetId;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.visibilityRule.findMany({
                                where: {
                                    question: {
                                        section: {
                                            questionnaireId: questionnaireId,
                                        },
                                    },
                                    isActive: true,
                                },
                            })];
                        case 1:
                            rules = _c.sent();
                            graph = new Map();
                            for (_i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
                                rule = rules_1[_i];
                                condition = rule.condition;
                                sourceQuestionId = this.extractQuestionIdFromCondition(condition);
                                if (sourceQuestionId) {
                                    for (_a = 0, _b = rule.targetQuestionIds; _a < _b.length; _a++) {
                                        targetId = _b[_a];
                                        if (!graph.has(sourceQuestionId)) {
                                            graph.set(sourceQuestionId, new Set());
                                        }
                                        graph.get(sourceQuestionId).add(targetId);
                                    }
                                }
                            }
                            return [2 /*return*/, graph];
                    }
                });
            });
        };
        AdaptiveLogicService_1.prototype.extractQuestionIdFromCondition = function (condition) {
            if (condition.field) {
                return condition.field;
            }
            if (condition.nested && condition.nested.length > 0) {
                return this.extractQuestionIdFromCondition(condition.nested[0]);
            }
            return null;
        };
        return AdaptiveLogicService_1;
    }());
    __setFunctionName(_classThis, "AdaptiveLogicService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdaptiveLogicService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdaptiveLogicService = _classThis;
}();
exports.AdaptiveLogicService = AdaptiveLogicService;
