"use strict";
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
exports.AdminQuestionnaireController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../../auth/guards/roles.guard");
var roles_decorator_1 = require("../../auth/decorators/roles.decorator");
var AdminQuestionnaireController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('admin'), (0, common_1.Controller)('admin'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _listQuestionnaires_decorators;
    var _getQuestionnaire_decorators;
    var _createQuestionnaire_decorators;
    var _updateQuestionnaire_decorators;
    var _deleteQuestionnaire_decorators;
    var _createSection_decorators;
    var _updateSection_decorators;
    var _deleteSection_decorators;
    var _reorderSections_decorators;
    var _createQuestion_decorators;
    var _updateQuestion_decorators;
    var _deleteQuestion_decorators;
    var _reorderQuestions_decorators;
    var _listVisibilityRules_decorators;
    var _createVisibilityRule_decorators;
    var _updateVisibilityRule_decorators;
    var _deleteVisibilityRule_decorators;
    var AdminQuestionnaireController = _classThis = /** @class */ (function () {
        function AdminQuestionnaireController_1(questionnaireService) {
            this.questionnaireService = (__runInitializers(this, _instanceExtraInitializers), questionnaireService);
        }
        // ==========================================================================
        // QUESTIONNAIRE ENDPOINTS
        // ==========================================================================
        AdminQuestionnaireController_1.prototype.listQuestionnaires = function (pagination) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, items, total;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.questionnaireService.findAllQuestionnaires(pagination)];
                        case 1:
                            _a = _e.sent(), items = _a.items, total = _a.total;
                            return [2 /*return*/, {
                                    items: items,
                                    pagination: {
                                        page: (_b = pagination.page) !== null && _b !== void 0 ? _b : 1,
                                        limit: (_c = pagination.limit) !== null && _c !== void 0 ? _c : 20,
                                        total: total,
                                        totalPages: Math.ceil(total / ((_d = pagination.limit) !== null && _d !== void 0 ? _d : 20)),
                                    },
                                }];
                    }
                });
            });
        };
        AdminQuestionnaireController_1.prototype.getQuestionnaire = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.findQuestionnaireById(id)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.createQuestionnaire = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.createQuestionnaire(dto, user.id)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.updateQuestionnaire = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.updateQuestionnaire(id, dto, user.id)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.deleteQuestionnaire = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.questionnaireService.deleteQuestionnaire(id, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Questionnaire deactivated successfully' }];
                    }
                });
            });
        };
        // ==========================================================================
        // SECTION ENDPOINTS
        // ==========================================================================
        AdminQuestionnaireController_1.prototype.createSection = function (questionnaireId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.createSection(questionnaireId, dto, user.id)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.updateSection = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.updateSection(id, dto, user.id)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.deleteSection = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.questionnaireService.deleteSection(id, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Section deleted successfully' }];
                    }
                });
            });
        };
        AdminQuestionnaireController_1.prototype.reorderSections = function (questionnaireId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.reorderSections(questionnaireId, dto, user.id)];
                });
            });
        };
        // ==========================================================================
        // QUESTION ENDPOINTS
        // ==========================================================================
        AdminQuestionnaireController_1.prototype.createQuestion = function (sectionId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.createQuestion(sectionId, dto, user.id)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.updateQuestion = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.updateQuestion(id, dto, user.id)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.deleteQuestion = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.questionnaireService.deleteQuestion(id, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Question deleted successfully' }];
                    }
                });
            });
        };
        AdminQuestionnaireController_1.prototype.reorderQuestions = function (sectionId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.reorderQuestions(sectionId, dto, user.id)];
                });
            });
        };
        // ==========================================================================
        // VISIBILITY RULE ENDPOINTS
        // ==========================================================================
        AdminQuestionnaireController_1.prototype.listVisibilityRules = function (questionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.findRulesByQuestion(questionId)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.createVisibilityRule = function (questionId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.createVisibilityRule(questionId, dto, user.id)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.updateVisibilityRule = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.questionnaireService.updateVisibilityRule(id, dto, user.id)];
                });
            });
        };
        AdminQuestionnaireController_1.prototype.deleteVisibilityRule = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.questionnaireService.deleteVisibilityRule(id, user.id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: 'Visibility rule deleted successfully' }];
                    }
                });
            });
        };
        return AdminQuestionnaireController_1;
    }());
    __setFunctionName(_classThis, "AdminQuestionnaireController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listQuestionnaires_decorators = [(0, common_1.Get)('questionnaires'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'List all questionnaires (paginated)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of questionnaires' })];
        _getQuestionnaire_decorators = [(0, common_1.Get)('questionnaires/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get questionnaire with full details' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Questionnaire with sections and questions' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Questionnaire not found' })];
        _createQuestionnaire_decorators = [(0, common_1.Post)('questionnaires'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Create new questionnaire' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Questionnaire created' })];
        _updateQuestionnaire_decorators = [(0, common_1.Patch)('questionnaires/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update questionnaire metadata' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Questionnaire updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Questionnaire not found' })];
        _deleteQuestionnaire_decorators = [(0, common_1.Delete)('questionnaires/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Soft-delete questionnaire (SUPER_ADMIN only)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Questionnaire deactivated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Questionnaire not found' })];
        _createSection_decorators = [(0, common_1.Post)('questionnaires/:questionnaireId/sections'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Add section to questionnaire' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Section created' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Questionnaire not found' })];
        _updateSection_decorators = [(0, common_1.Patch)('sections/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update section' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Section updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Section not found' })];
        _deleteSection_decorators = [(0, common_1.Delete)('sections/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Delete section (SUPER_ADMIN only)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Section deleted' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Section not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Section has questions' })];
        _reorderSections_decorators = [(0, common_1.Patch)('questionnaires/:questionnaireId/sections/reorder'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Reorder sections within questionnaire' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Sections reordered' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Questionnaire not found' })];
        _createQuestion_decorators = [(0, common_1.Post)('sections/:sectionId/questions'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Add question to section' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Question created' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Section not found' })];
        _updateQuestion_decorators = [(0, common_1.Patch)('questions/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update question' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' })];
        _deleteQuestion_decorators = [(0, common_1.Delete)('questions/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Delete question (SUPER_ADMIN only)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Question deleted' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Question has responses' })];
        _reorderQuestions_decorators = [(0, common_1.Patch)('sections/:sectionId/questions/reorder'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Reorder questions within section' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Questions reordered' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Section not found' })];
        _listVisibilityRules_decorators = [(0, common_1.Get)('questions/:questionId/rules'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'List visibility rules for question' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of visibility rules' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' })];
        _createVisibilityRule_decorators = [(0, common_1.Post)('questions/:questionId/rules'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Add visibility rule to question' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Rule created' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' })];
        _updateVisibilityRule_decorators = [(0, common_1.Patch)('rules/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update visibility rule' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Rule updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Rule not found' })];
        _deleteVisibilityRule_decorators = [(0, common_1.Delete)('rules/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Delete visibility rule' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Rule deleted' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Rule not found' })];
        __esDecorate(_classThis, null, _listQuestionnaires_decorators, { kind: "method", name: "listQuestionnaires", static: false, private: false, access: { has: function (obj) { return "listQuestionnaires" in obj; }, get: function (obj) { return obj.listQuestionnaires; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getQuestionnaire_decorators, { kind: "method", name: "getQuestionnaire", static: false, private: false, access: { has: function (obj) { return "getQuestionnaire" in obj; }, get: function (obj) { return obj.getQuestionnaire; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createQuestionnaire_decorators, { kind: "method", name: "createQuestionnaire", static: false, private: false, access: { has: function (obj) { return "createQuestionnaire" in obj; }, get: function (obj) { return obj.createQuestionnaire; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateQuestionnaire_decorators, { kind: "method", name: "updateQuestionnaire", static: false, private: false, access: { has: function (obj) { return "updateQuestionnaire" in obj; }, get: function (obj) { return obj.updateQuestionnaire; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteQuestionnaire_decorators, { kind: "method", name: "deleteQuestionnaire", static: false, private: false, access: { has: function (obj) { return "deleteQuestionnaire" in obj; }, get: function (obj) { return obj.deleteQuestionnaire; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSection_decorators, { kind: "method", name: "createSection", static: false, private: false, access: { has: function (obj) { return "createSection" in obj; }, get: function (obj) { return obj.createSection; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSection_decorators, { kind: "method", name: "updateSection", static: false, private: false, access: { has: function (obj) { return "updateSection" in obj; }, get: function (obj) { return obj.updateSection; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteSection_decorators, { kind: "method", name: "deleteSection", static: false, private: false, access: { has: function (obj) { return "deleteSection" in obj; }, get: function (obj) { return obj.deleteSection; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reorderSections_decorators, { kind: "method", name: "reorderSections", static: false, private: false, access: { has: function (obj) { return "reorderSections" in obj; }, get: function (obj) { return obj.reorderSections; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createQuestion_decorators, { kind: "method", name: "createQuestion", static: false, private: false, access: { has: function (obj) { return "createQuestion" in obj; }, get: function (obj) { return obj.createQuestion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateQuestion_decorators, { kind: "method", name: "updateQuestion", static: false, private: false, access: { has: function (obj) { return "updateQuestion" in obj; }, get: function (obj) { return obj.updateQuestion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteQuestion_decorators, { kind: "method", name: "deleteQuestion", static: false, private: false, access: { has: function (obj) { return "deleteQuestion" in obj; }, get: function (obj) { return obj.deleteQuestion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reorderQuestions_decorators, { kind: "method", name: "reorderQuestions", static: false, private: false, access: { has: function (obj) { return "reorderQuestions" in obj; }, get: function (obj) { return obj.reorderQuestions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listVisibilityRules_decorators, { kind: "method", name: "listVisibilityRules", static: false, private: false, access: { has: function (obj) { return "listVisibilityRules" in obj; }, get: function (obj) { return obj.listVisibilityRules; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createVisibilityRule_decorators, { kind: "method", name: "createVisibilityRule", static: false, private: false, access: { has: function (obj) { return "createVisibilityRule" in obj; }, get: function (obj) { return obj.createVisibilityRule; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateVisibilityRule_decorators, { kind: "method", name: "updateVisibilityRule", static: false, private: false, access: { has: function (obj) { return "updateVisibilityRule" in obj; }, get: function (obj) { return obj.updateVisibilityRule; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteVisibilityRule_decorators, { kind: "method", name: "deleteVisibilityRule", static: false, private: false, access: { has: function (obj) { return "deleteVisibilityRule" in obj; }, get: function (obj) { return obj.deleteVisibilityRule; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminQuestionnaireController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminQuestionnaireController = _classThis;
}();
exports.AdminQuestionnaireController = AdminQuestionnaireController;
