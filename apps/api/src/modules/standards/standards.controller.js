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
exports.StandardsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var standard_dto_1 = require("./dto/standard.dto");
var public_decorator_1 = require("../auth/decorators/public.decorator");
var StandardsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Standards'), (0, common_1.Controller)('standards')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _findByCategory_decorators;
    var _getStandardsForDocument_decorators;
    var _generateStandardsSection_decorators;
    var StandardsController = _classThis = /** @class */ (function () {
        function StandardsController_1(standardsService) {
            this.standardsService = (__runInitializers(this, _instanceExtraInitializers), standardsService);
        }
        StandardsController_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.findAll()];
                });
            });
        };
        StandardsController_1.prototype.findByCategory = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.findWithMappings(category)];
                });
            });
        };
        StandardsController_1.prototype.getStandardsForDocument = function (documentTypeId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.getStandardsForDocument(documentTypeId)];
                });
            });
        };
        StandardsController_1.prototype.generateStandardsSection = function (documentTypeId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.generateStandardsSection(documentTypeId)];
                });
            });
        };
        return StandardsController_1;
    }());
    __setFunctionName(_classThis, "StandardsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)(), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get all engineering standards' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'List of all active engineering standards',
                type: [standard_dto_1.StandardResponseDto],
            })];
        _findByCategory_decorators = [(0, common_1.Get)(':category'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get standard by category' }), (0, swagger_1.ApiParam)({
                name: 'category',
                enum: client_1.StandardCategory,
                description: 'Standard category',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Engineering standard details',
                type: standard_dto_1.StandardWithMappingsDto,
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Standard category not found' })];
        _getStandardsForDocument_decorators = [(0, common_1.Get)('document/:documentTypeId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get standards for a document type' }), (0, swagger_1.ApiParam)({
                name: 'documentTypeId',
                description: 'Document type ID or slug',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Standards mapped to the document type',
                type: [standard_dto_1.StandardResponseDto],
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document type not found' })];
        _generateStandardsSection_decorators = [(0, common_1.Get)('document/:documentTypeId/section'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Generate standards section for document' }), (0, swagger_1.ApiParam)({
                name: 'documentTypeId',
                description: 'Document type ID or slug',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Generated Markdown section for document',
                type: standard_dto_1.StandardsSectionResponseDto,
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document type not found' })];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByCategory_decorators, { kind: "method", name: "findByCategory", static: false, private: false, access: { has: function (obj) { return "findByCategory" in obj; }, get: function (obj) { return obj.findByCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStandardsForDocument_decorators, { kind: "method", name: "getStandardsForDocument", static: false, private: false, access: { has: function (obj) { return "getStandardsForDocument" in obj; }, get: function (obj) { return obj.getStandardsForDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateStandardsSection_decorators, { kind: "method", name: "generateStandardsSection", static: false, private: false, access: { has: function (obj) { return "generateStandardsSection" in obj; }, get: function (obj) { return obj.generateStandardsSection; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StandardsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StandardsController = _classThis;
}();
exports.StandardsController = StandardsController;
var StandardsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Standards'), (0, common_1.Controller)('standards')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _findByCategory_decorators;
    var _getStandardsForDocument_decorators;
    var _generateStandardsSection_decorators;
    var StandardsController = _classThis = /** @class */ (function () {
        function StandardsController_2(standardsService) {
            this.standardsService = (__runInitializers(this, _instanceExtraInitializers), standardsService);
        }
        StandardsController_2.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.findAll()];
                });
            });
        };
        StandardsController_2.prototype.findByCategory = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.findWithMappings(category)];
                });
            });
        };
        StandardsController_2.prototype.getStandardsForDocument = function (documentTypeId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.getStandardsForDocument(documentTypeId)];
                });
            });
        };
        StandardsController_2.prototype.generateStandardsSection = function (documentTypeId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.standardsService.generateStandardsSection(documentTypeId)];
                });
            });
        };
        return StandardsController_2;
    }());
    __setFunctionName(_classThis, "StandardsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)(), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get all engineering standards' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'List of all active engineering standards',
                type: [standard_dto_1.StandardResponseDto],
            })];
        _findByCategory_decorators = [(0, common_1.Get)(':category'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get standard by category' }), (0, swagger_1.ApiParam)({
                name: 'category',
                enum: client_1.StandardCategory,
                description: 'Standard category',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Engineering standard details',
                type: standard_dto_1.StandardWithMappingsDto,
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Standard category not found' })];
        _getStandardsForDocument_decorators = [(0, common_1.Get)('document/:documentTypeId'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Get standards for a document type' }), (0, swagger_1.ApiParam)({
                name: 'documentTypeId',
                description: 'Document type ID or slug',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Standards mapped to the document type',
                type: [standard_dto_1.StandardResponseDto],
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document type not found' })];
        _generateStandardsSection_decorators = [(0, common_1.Get)('document/:documentTypeId/section'), (0, public_decorator_1.Public)(), (0, swagger_1.ApiOperation)({ summary: 'Generate standards section for document' }), (0, swagger_1.ApiParam)({
                name: 'documentTypeId',
                description: 'Document type ID or slug',
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Generated Markdown section for document',
                type: standard_dto_1.StandardsSectionResponseDto,
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Document type not found' })];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByCategory_decorators, { kind: "method", name: "findByCategory", static: false, private: false, access: { has: function (obj) { return "findByCategory" in obj; }, get: function (obj) { return obj.findByCategory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStandardsForDocument_decorators, { kind: "method", name: "getStandardsForDocument", static: false, private: false, access: { has: function (obj) { return "getStandardsForDocument" in obj; }, get: function (obj) { return obj.getStandardsForDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateStandardsSection_decorators, { kind: "method", name: "generateStandardsSection", static: false, private: false, access: { has: function (obj) { return "generateStandardsSection" in obj; }, get: function (obj) { return obj.generateStandardsSection; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StandardsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StandardsController = _classThis;
}();
exports.StandardsController = StandardsController;
