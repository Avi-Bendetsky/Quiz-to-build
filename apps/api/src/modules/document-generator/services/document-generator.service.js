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
exports.DocumentGeneratorService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var DocumentGeneratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DocumentGeneratorService = _classThis = /** @class */ (function () {
        function DocumentGeneratorService_1(prisma, templateEngine, documentBuilder, storage) {
            this.prisma = prisma;
            this.templateEngine = templateEngine;
            this.documentBuilder = documentBuilder;
            this.storage = storage;
            this.logger = new common_1.Logger(DocumentGeneratorService.name);
        }
        /**
         * Generate a document for a completed session
         */
        DocumentGeneratorService_1.prototype.generateDocument = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var sessionId, documentTypeId, userId, session, documentType, answeredQuestions, answeredIds_1, missingQuestions, document, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sessionId = params.sessionId, documentTypeId = params.documentTypeId, userId = params.userId;
                            return [4 /*yield*/, this.prisma.session.findUnique({
                                    where: { id: sessionId },
                                    include: {
                                        user: { select: { id: true } },
                                        questionnaire: { select: { name: true } },
                                    },
                                })];
                        case 1:
                            session = _a.sent();
                            if (!session) {
                                throw new common_1.NotFoundException("Session with ID ".concat(sessionId, " not found"));
                            }
                            if (session.status !== client_1.SessionStatus.COMPLETED) {
                                throw new common_1.BadRequestException("Session must be completed before generating documents. Current status: ".concat(session.status));
                            }
                            // Verify user owns the session or is admin
                            if (session.userId !== userId) {
                                throw new common_1.BadRequestException('You can only generate documents for your own sessions');
                            }
                            return [4 /*yield*/, this.prisma.documentType.findUnique({
                                    where: { id: documentTypeId },
                                })];
                        case 2:
                            documentType = _a.sent();
                            if (!documentType) {
                                throw new common_1.NotFoundException("Document type with ID ".concat(documentTypeId, " not found"));
                            }
                            if (!documentType.isActive) {
                                throw new common_1.BadRequestException('This document type is not currently available');
                            }
                            if (!(documentType.requiredQuestions.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.response.findMany({
                                    where: {
                                        sessionId: sessionId,
                                        questionId: { in: documentType.requiredQuestions },
                                        isValid: true,
                                    },
                                    select: { questionId: true },
                                })];
                        case 3:
                            answeredQuestions = _a.sent();
                            answeredIds_1 = new Set(answeredQuestions.map(function (r) { return r.questionId; }));
                            missingQuestions = documentType.requiredQuestions.filter(function (id) { return !answeredIds_1.has(id); });
                            if (missingQuestions.length > 0) {
                                throw new common_1.BadRequestException("Missing required questions for this document type: ".concat(missingQuestions.length, " questions not answered"));
                            }
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.prisma.document.create({
                                data: {
                                    sessionId: sessionId,
                                    documentTypeId: documentTypeId,
                                    status: client_1.DocumentStatus.PENDING,
                                    format: 'DOCX',
                                    version: 1,
                                },
                            })];
                        case 5:
                            document = _a.sent();
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 8, , 10]);
                            return [4 /*yield*/, this.processDocumentGeneration(document.id, documentType)];
                        case 7:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 8:
                            error_1 = _a.sent();
                            // Mark as failed if generation fails
                            return [4 /*yield*/, this.prisma.document.update({
                                    where: { id: document.id },
                                    data: {
                                        status: client_1.DocumentStatus.FAILED,
                                        generationMetadata: {
                                            error: error_1 instanceof Error ? error_1.message : 'Unknown error',
                                            failedAt: new Date().toISOString(),
                                        },
                                    },
                                })];
                        case 9:
                            // Mark as failed if generation fails
                            _a.sent();
                            throw error_1;
                        case 10: 
                        // Return updated document
                        return [2 /*return*/, this.prisma.document.findUnique({
                                where: { id: document.id },
                                include: { documentType: true },
                            })];
                    }
                });
            });
        };
        /**
         * Process document generation
         */
        DocumentGeneratorService_1.prototype.processDocumentGeneration = function (documentId, documentType) {
            return __awaiter(this, void 0, void 0, function () {
                var document, templateData, buffer, fileName, uploadResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.document.update({
                                where: { id: documentId },
                                data: { status: client_1.DocumentStatus.GENERATING },
                            })];
                        case 1:
                            document = _a.sent();
                            this.logger.log("Generating document ".concat(documentId, " of type ").concat(documentType.name));
                            return [4 /*yield*/, this.templateEngine.assembleTemplateData(document.sessionId, documentType.slug)];
                        case 2:
                            templateData = _a.sent();
                            return [4 /*yield*/, this.documentBuilder.buildDocument(templateData, {
                                    name: documentType.name,
                                    slug: documentType.slug,
                                    category: documentType.category,
                                })];
                        case 3:
                            buffer = _a.sent();
                            fileName = "".concat(documentType.slug, "-").concat(documentId, ".docx");
                            return [4 /*yield*/, this.storage.upload(buffer, fileName, documentType.category.toLowerCase())];
                        case 4:
                            uploadResult = _a.sent();
                            // Update document with results
                            return [4 /*yield*/, this.prisma.document.update({
                                    where: { id: documentId },
                                    data: {
                                        status: client_1.DocumentStatus.GENERATED,
                                        storageUrl: uploadResult.url,
                                        fileName: uploadResult.fileName,
                                        fileSize: BigInt(uploadResult.fileSize),
                                        generatedAt: new Date(),
                                        generationMetadata: {
                                            templateVersion: templateData.metadata.version,
                                            generatedAt: new Date().toISOString(),
                                        },
                                    },
                                })];
                        case 5:
                            // Update document with results
                            _a.sent();
                            this.logger.log("Document ".concat(documentId, " generated successfully"));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get document by ID
         */
        DocumentGeneratorService_1.prototype.getDocument = function (id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var document;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.document.findUnique({
                                where: { id: id },
                                include: {
                                    documentType: true,
                                    session: { select: { userId: true } },
                                },
                            })];
                        case 1:
                            document = _a.sent();
                            if (!document) {
                                throw new common_1.NotFoundException("Document with ID ".concat(id, " not found"));
                            }
                            // Verify access (user owns the session)
                            if (document.session.userId !== userId) {
                                throw new common_1.BadRequestException('Access denied');
                            }
                            return [2 /*return*/, document];
                    }
                });
            });
        };
        /**
         * Get all documents for a session
         */
        DocumentGeneratorService_1.prototype.getSessionDocuments = function (sessionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var session;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.session.findUnique({
                                where: { id: sessionId },
                                select: { userId: true },
                            })];
                        case 1:
                            session = _a.sent();
                            if (!session) {
                                throw new common_1.NotFoundException("Session with ID ".concat(sessionId, " not found"));
                            }
                            if (session.userId !== userId) {
                                throw new common_1.BadRequestException('Access denied');
                            }
                            return [2 /*return*/, this.prisma.document.findMany({
                                    where: { sessionId: sessionId },
                                    include: { documentType: true },
                                    orderBy: { createdAt: 'desc' },
                                })];
                    }
                });
            });
        };
        /**
         * Get download URL for a document
         */
        DocumentGeneratorService_1.prototype.getDownloadUrl = function (id_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (id, userId, expiresInMinutes) {
                var document;
                if (expiresInMinutes === void 0) { expiresInMinutes = 60; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getDocument(id, userId)];
                        case 1:
                            document = _a.sent();
                            if (document.status !== client_1.DocumentStatus.GENERATED &&
                                document.status !== client_1.DocumentStatus.APPROVED) {
                                throw new common_1.BadRequestException("Document is not available for download. Status: ".concat(document.status));
                            }
                            if (!document.storageUrl) {
                                throw new common_1.BadRequestException('Document file not found');
                            }
                            return [2 /*return*/, this.storage.getDownloadUrl(document.storageUrl, expiresInMinutes)];
                    }
                });
            });
        };
        /**
         * List all document types
         */
        DocumentGeneratorService_1.prototype.listDocumentTypes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.documentType.findMany({
                            where: { isActive: true },
                            orderBy: [{ category: 'asc' }, { name: 'asc' }],
                        })];
                });
            });
        };
        /**
         * Get documents pending review (admin)
         */
        DocumentGeneratorService_1.prototype.getPendingReviewDocuments = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.document.findMany({
                            where: { status: client_1.DocumentStatus.PENDING_REVIEW },
                            include: { documentType: true },
                            orderBy: { createdAt: 'asc' },
                        })];
                });
            });
        };
        /**
         * Approve a document (admin)
         */
        DocumentGeneratorService_1.prototype.approveDocument = function (id, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var document;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.document.findUnique({
                                where: { id: id },
                            })];
                        case 1:
                            document = _a.sent();
                            if (!document) {
                                throw new common_1.NotFoundException("Document with ID ".concat(id, " not found"));
                            }
                            if (document.status !== client_1.DocumentStatus.PENDING_REVIEW) {
                                throw new common_1.BadRequestException("Only documents with PENDING_REVIEW status can be approved. Current: ".concat(document.status));
                            }
                            return [2 /*return*/, this.prisma.document.update({
                                    where: { id: id },
                                    data: {
                                        status: client_1.DocumentStatus.APPROVED,
                                        approvedById: adminUserId,
                                        approvedAt: new Date(),
                                        reviewStatus: {
                                            approvedBy: adminUserId,
                                            approvedAt: new Date().toISOString(),
                                        },
                                    },
                                })];
                    }
                });
            });
        };
        /**
         * Reject a document (admin)
         */
        DocumentGeneratorService_1.prototype.rejectDocument = function (id, adminUserId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var document;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.document.findUnique({
                                where: { id: id },
                            })];
                        case 1:
                            document = _a.sent();
                            if (!document) {
                                throw new common_1.NotFoundException("Document with ID ".concat(id, " not found"));
                            }
                            if (document.status !== client_1.DocumentStatus.PENDING_REVIEW) {
                                throw new common_1.BadRequestException("Only documents with PENDING_REVIEW status can be rejected. Current: ".concat(document.status));
                            }
                            return [2 /*return*/, this.prisma.document.update({
                                    where: { id: id },
                                    data: {
                                        status: client_1.DocumentStatus.REJECTED,
                                        rejectionReason: reason,
                                        reviewStatus: {
                                            rejectedBy: adminUserId,
                                            rejectedAt: new Date().toISOString(),
                                            reason: reason,
                                        },
                                    },
                                })];
                    }
                });
            });
        };
        return DocumentGeneratorService_1;
    }());
    __setFunctionName(_classThis, "DocumentGeneratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentGeneratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentGeneratorService = _classThis;
}();
exports.DocumentGeneratorService = DocumentGeneratorService;
