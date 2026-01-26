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
exports.DocumentController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var dto_1 = require("../dto");
var DocumentController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('documents'), (0, common_1.Controller)('documents'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _generateDocument_decorators;
    var _listDocumentTypes_decorators;
    var _getSessionDocuments_decorators;
    var _getDocument_decorators;
    var _getDownloadUrl_decorators;
    var DocumentController = _classThis = /** @class */ (function () {
        function DocumentController_1(documentGeneratorService) {
            this.documentGeneratorService = (__runInitializers(this, _instanceExtraInitializers), documentGeneratorService);
        }
        DocumentController_1.prototype.generateDocument = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                var document;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.documentGeneratorService.generateDocument({
                                sessionId: dto.sessionId,
                                documentTypeId: dto.documentTypeId,
                                userId: user.id,
                            })];
                        case 1:
                            document = _a.sent();
                            return [2 /*return*/, this.mapToResponse(document)];
                    }
                });
            });
        };
        DocumentController_1.prototype.listDocumentTypes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.documentGeneratorService.listDocumentTypes()];
                });
            });
        };
        DocumentController_1.prototype.getSessionDocuments = function (sessionId, user) {
            return __awaiter(this, void 0, void 0, function () {
                var documents;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.documentGeneratorService.getSessionDocuments(sessionId, user.id)];
                        case 1:
                            documents = _a.sent();
                            return [2 /*return*/, documents.map(function (doc) { return _this.mapToResponse(doc); })];
                    }
                });
            });
        };
        DocumentController_1.prototype.getDocument = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                var document;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.documentGeneratorService.getDocument(id, user.id)];
                        case 1:
                            document = _a.sent();
                            return [2 /*return*/, this.mapToResponse(document)];
                    }
                });
            });
        };
        DocumentController_1.prototype.getDownloadUrl = function (id, expiresIn, user) {
            return __awaiter(this, void 0, void 0, function () {
                var expiresInMinutes, url;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            expiresInMinutes = expiresIn ? parseInt(expiresIn, 10) : 60;
                            return [4 /*yield*/, this.documentGeneratorService.getDownloadUrl(id, user.id, expiresInMinutes)];
                        case 1:
                            url = _a.sent();
                            return [2 /*return*/, {
                                    url: url,
                                    expiresAt: new Date(Date.now() + expiresInMinutes * 60000),
                                }];
                    }
                });
            });
        };
        DocumentController_1.prototype.mapToResponse = function (document) {
            var _a, _b, _c, _d, _e, _f;
            return {
                id: document.id,
                sessionId: document.sessionId,
                documentTypeId: document.documentTypeId,
                status: document.status,
                format: document.format,
                fileName: (_a = document.fileName) !== null && _a !== void 0 ? _a : undefined,
                fileSize: (_c = (_b = document.fileSize) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : undefined,
                version: document.version,
                generatedAt: (_d = document.generatedAt) !== null && _d !== void 0 ? _d : undefined,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt,
                documentType: document.documentType
                    ? {
                        id: document.documentType.id,
                        name: document.documentType.name,
                        slug: document.documentType.slug,
                        description: (_e = document.documentType.description) !== null && _e !== void 0 ? _e : undefined,
                        category: document.documentType.category,
                        estimatedPages: (_f = document.documentType.estimatedPages) !== null && _f !== void 0 ? _f : undefined,
                        isActive: document.documentType.isActive,
                    }
                    : undefined,
            };
        };
        return DocumentController_1;
    }());
    __setFunctionName(_classThis, "DocumentController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _generateDocument_decorators = [(0, common_1.Post)('generate'), (0, swagger_1.ApiOperation)({ summary: 'Request document generation for a session' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Document generation started', type: dto_1.DocumentResponseDto }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Session not completed or missing required questions' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Session or document type not found' })];
        _listDocumentTypes_decorators = [(0, common_1.Get)('types'), (0, swagger_1.ApiOperation)({ summary: 'List available document types' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of document types', type: [dto_1.DocumentTypeResponseDto] })];
        _getSessionDocuments_decorators = [(0, common_1.Get)('session/:sessionId'), (0, swagger_1.ApiOperation)({ summary: 'List all documents for a session' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'List of documents', type: [dto_1.DocumentResponseDto] }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' })];
        _getDocument_decorators = [(0, common_1.Get)(':id'), (0, swagger_1.ApiOperation)({ summary: 'Get document details' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Document details', type: dto_1.DocumentResponseDto }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' })];
        _getDownloadUrl_decorators = [(0, common_1.Get)(':id/download'), (0, swagger_1.ApiOperation)({ summary: 'Get secure download URL for document' }), (0, swagger_1.ApiQuery)({ name: 'expiresIn', required: false, description: 'URL expiration in minutes (default: 60)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Download URL', type: dto_1.DownloadUrlResponseDto }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Document not available for download' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' })];
        __esDecorate(_classThis, null, _generateDocument_decorators, { kind: "method", name: "generateDocument", static: false, private: false, access: { has: function (obj) { return "generateDocument" in obj; }, get: function (obj) { return obj.generateDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listDocumentTypes_decorators, { kind: "method", name: "listDocumentTypes", static: false, private: false, access: { has: function (obj) { return "listDocumentTypes" in obj; }, get: function (obj) { return obj.listDocumentTypes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSessionDocuments_decorators, { kind: "method", name: "getSessionDocuments", static: false, private: false, access: { has: function (obj) { return "getSessionDocuments" in obj; }, get: function (obj) { return obj.getSessionDocuments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDocument_decorators, { kind: "method", name: "getDocument", static: false, private: false, access: { has: function (obj) { return "getDocument" in obj; }, get: function (obj) { return obj.getDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDownloadUrl_decorators, { kind: "method", name: "getDownloadUrl", static: false, private: false, access: { has: function (obj) { return "getDownloadUrl" in obj; }, get: function (obj) { return obj.getDownloadUrl; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentController = _classThis;
}();
exports.DocumentController = DocumentController;
