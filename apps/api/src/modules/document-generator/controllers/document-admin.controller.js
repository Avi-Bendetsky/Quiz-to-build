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
exports.DocumentAdminController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../../auth/guards/roles.guard");
var roles_decorator_1 = require("../../auth/decorators/roles.decorator");
var DocumentAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('admin/documents'), (0, common_1.Controller)('admin'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _listDocumentTypes_decorators;
    var _getDocumentType_decorators;
    var _createDocumentType_decorators;
    var _updateDocumentType_decorators;
    var _getPendingReviewDocuments_decorators;
    var _approveDocument_decorators;
    var _rejectDocument_decorators;
    var DocumentAdminController = _classThis = /** @class */ (function () {
        function DocumentAdminController_1(prisma, documentGeneratorService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.documentGeneratorService = documentGeneratorService;
        }
        // ==========================================================================
        // DOCUMENT TYPE MANAGEMENT
        // ==========================================================================
        DocumentAdminController_1.prototype.listDocumentTypes = function (pagination) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, items, total;
                var _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.documentType.findMany({
                                    skip: pagination.skip,
                                    take: pagination.limit,
                                    orderBy: [{ category: 'asc' }, { name: 'asc' }],
                                }),
                                this.prisma.documentType.count(),
                            ])];
                        case 1:
                            _a = _e.sent(), items = _a[0], total = _a[1];
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
        DocumentAdminController_1.prototype.getDocumentType = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var documentType;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.documentType.findUnique({
                                where: { id: id },
                                include: {
                                    standardMappings: {
                                        include: { standard: true },
                                    },
                                    _count: { select: { documents: true } },
                                },
                            })];
                        case 1:
                            documentType = _a.sent();
                            if (!documentType) {
                                throw new Error("Document type with ID ".concat(id, " not found"));
                            }
                            return [2 /*return*/, documentType];
                    }
                });
            });
        };
        DocumentAdminController_1.prototype.createDocumentType = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    return [2 /*return*/, this.prisma.documentType.create({
                            data: {
                                name: dto.name,
                                slug: dto.slug,
                                description: dto.description,
                                category: dto.category,
                                templatePath: dto.templatePath,
                                requiredQuestions: (_a = dto.requiredQuestions) !== null && _a !== void 0 ? _a : [],
                                outputFormats: (_b = dto.outputFormats) !== null && _b !== void 0 ? _b : ['DOCX'],
                                estimatedPages: dto.estimatedPages,
                                isActive: (_c = dto.isActive) !== null && _c !== void 0 ? _c : true,
                            },
                        })];
                });
            });
        };
        DocumentAdminController_1.prototype.updateDocumentType = function (id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.documentType.update({
                            where: { id: id },
                            data: {
                                name: dto.name,
                                slug: dto.slug,
                                description: dto.description,
                                category: dto.category,
                                templatePath: dto.templatePath,
                                requiredQuestions: dto.requiredQuestions,
                                outputFormats: dto.outputFormats,
                                estimatedPages: dto.estimatedPages,
                                isActive: dto.isActive,
                            },
                        })];
                });
            });
        };
        // ==========================================================================
        // DOCUMENT REVIEW MANAGEMENT
        // ==========================================================================
        DocumentAdminController_1.prototype.getPendingReviewDocuments = function () {
            return __awaiter(this, void 0, void 0, function () {
                var documents;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.documentGeneratorService.getPendingReviewDocuments()];
                        case 1:
                            documents = _a.sent();
                            return [2 /*return*/, documents.map(function (doc) {
                                    var _a, _b, _c, _d, _e, _f;
                                    return ({
                                        id: doc.id,
                                        sessionId: doc.sessionId,
                                        documentTypeId: doc.documentTypeId,
                                        status: doc.status,
                                        format: doc.format,
                                        fileName: (_a = doc.fileName) !== null && _a !== void 0 ? _a : undefined,
                                        fileSize: (_c = (_b = doc.fileSize) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : undefined,
                                        version: doc.version,
                                        generatedAt: (_d = doc.generatedAt) !== null && _d !== void 0 ? _d : undefined,
                                        createdAt: doc.createdAt,
                                        updatedAt: doc.updatedAt,
                                        documentType: {
                                            id: doc.documentType.id,
                                            name: doc.documentType.name,
                                            slug: doc.documentType.slug,
                                            description: (_e = doc.documentType.description) !== null && _e !== void 0 ? _e : undefined,
                                            category: doc.documentType.category,
                                            estimatedPages: (_f = doc.documentType.estimatedPages) !== null && _f !== void 0 ? _f : undefined,
                                            isActive: doc.documentType.isActive,
                                        },
                                    });
                                })];
                    }
                });
            });
        };
        DocumentAdminController_1.prototype.approveDocument = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var document;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.documentGeneratorService.approveDocument(id, user.id)];
                        case 1:
                            document = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Document approved successfully',
                                    document: {
                                        id: document.id,
                                        status: document.status,
                                        approvedAt: document.approvedAt,
                                    },
                                }];
                    }
                });
            });
        };
        DocumentAdminController_1.prototype.rejectDocument = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var document;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.documentGeneratorService.rejectDocument(id, user.id, dto.reason)];
                        case 1:
                            document = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Document rejected',
                                    document: {
                                        id: document.id,
                                        status: document.status,
                                        rejectionReason: document.rejectionReason,
                                    },
                                }];
                    }
                });
            });
        };
        return DocumentAdminController_1;
    }());
    __setFunctionName(_classThis, "DocumentAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _listDocumentTypes_decorators = [(0, common_1.Get)('document-types'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'List all document types' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of document types' })];
        _getDocumentType_decorators = [(0, common_1.Get)('document-types/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get document type details' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Document type details' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document type not found' })];
        _createDocumentType_decorators = [(0, common_1.Post)('document-types'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Create document type' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Document type created' })];
        _updateDocumentType_decorators = [(0, common_1.Patch)('document-types/:id'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update document type' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Document type updated' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document type not found' })];
        _getPendingReviewDocuments_decorators = [(0, common_1.Get)('documents/pending-review'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'List documents pending review' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of documents pending review' })];
        _approveDocument_decorators = [(0, common_1.Patch)('documents/:id/approve'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Approve a document' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Document approved' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Document not in pending review status' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' })];
        _rejectDocument_decorators = [(0, common_1.Patch)('documents/:id/reject'), (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Reject a document' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Document rejected' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Document not in pending review status' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' })];
        __esDecorate(_classThis, null, _listDocumentTypes_decorators, { kind: "method", name: "listDocumentTypes", static: false, private: false, access: { has: function (obj) { return "listDocumentTypes" in obj; }, get: function (obj) { return obj.listDocumentTypes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDocumentType_decorators, { kind: "method", name: "getDocumentType", static: false, private: false, access: { has: function (obj) { return "getDocumentType" in obj; }, get: function (obj) { return obj.getDocumentType; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createDocumentType_decorators, { kind: "method", name: "createDocumentType", static: false, private: false, access: { has: function (obj) { return "createDocumentType" in obj; }, get: function (obj) { return obj.createDocumentType; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateDocumentType_decorators, { kind: "method", name: "updateDocumentType", static: false, private: false, access: { has: function (obj) { return "updateDocumentType" in obj; }, get: function (obj) { return obj.updateDocumentType; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPendingReviewDocuments_decorators, { kind: "method", name: "getPendingReviewDocuments", static: false, private: false, access: { has: function (obj) { return "getPendingReviewDocuments" in obj; }, get: function (obj) { return obj.getPendingReviewDocuments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approveDocument_decorators, { kind: "method", name: "approveDocument", static: false, private: false, access: { has: function (obj) { return "approveDocument" in obj; }, get: function (obj) { return obj.approveDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rejectDocument_decorators, { kind: "method", name: "rejectDocument", static: false, private: false, access: { has: function (obj) { return "rejectDocument" in obj; }, get: function (obj) { return obj.rejectDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentAdminController = _classThis;
}();
exports.DocumentAdminController = DocumentAdminController;
