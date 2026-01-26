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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDocumentTypeDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var CreateDocumentTypeDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _templatePath_decorators;
    var _templatePath_initializers = [];
    var _templatePath_extraInitializers = [];
    var _requiredQuestions_decorators;
    var _requiredQuestions_initializers = [];
    var _requiredQuestions_extraInitializers = [];
    var _outputFormats_decorators;
    var _outputFormats_initializers = [];
    var _outputFormats_extraInitializers = [];
    var _estimatedPages_decorators;
    var _estimatedPages_initializers = [];
    var _estimatedPages_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateDocumentTypeDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.slug = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                this.description = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.templatePath = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _templatePath_initializers, void 0));
                this.requiredQuestions = (__runInitializers(this, _templatePath_extraInitializers), __runInitializers(this, _requiredQuestions_initializers, void 0));
                this.outputFormats = (__runInitializers(this, _requiredQuestions_extraInitializers), __runInitializers(this, _outputFormats_initializers, void 0));
                this.estimatedPages = (__runInitializers(this, _outputFormats_extraInitializers), __runInitializers(this, _estimatedPages_initializers, void 0));
                this.isActive = (__runInitializers(this, _estimatedPages_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return CreateDocumentTypeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Business Plan', maxLength: 200 }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(200)];
            _slug_decorators = [(0, swagger_1.ApiProperty)({ example: 'business-plan', maxLength: 100 }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Comprehensive business planning document' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: client_1.DocumentCategory, example: client_1.DocumentCategory.CFO }), (0, class_validator_1.IsEnum)(client_1.DocumentCategory)];
            _templatePath_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'templates/cfo/business-plan.hbs' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _requiredQuestions_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    type: [String],
                    example: ['question-id-1', 'question-id-2'],
                    description: 'IDs of questions required to generate this document',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _outputFormats_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    type: [String],
                    example: ['DOCX'],
                    default: ['DOCX'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _estimatedPages_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 15 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _isActive_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _templatePath_decorators, { kind: "field", name: "templatePath", static: false, private: false, access: { has: function (obj) { return "templatePath" in obj; }, get: function (obj) { return obj.templatePath; }, set: function (obj, value) { obj.templatePath = value; } }, metadata: _metadata }, _templatePath_initializers, _templatePath_extraInitializers);
            __esDecorate(null, null, _requiredQuestions_decorators, { kind: "field", name: "requiredQuestions", static: false, private: false, access: { has: function (obj) { return "requiredQuestions" in obj; }, get: function (obj) { return obj.requiredQuestions; }, set: function (obj, value) { obj.requiredQuestions = value; } }, metadata: _metadata }, _requiredQuestions_initializers, _requiredQuestions_extraInitializers);
            __esDecorate(null, null, _outputFormats_decorators, { kind: "field", name: "outputFormats", static: false, private: false, access: { has: function (obj) { return "outputFormats" in obj; }, get: function (obj) { return obj.outputFormats; }, set: function (obj, value) { obj.outputFormats = value; } }, metadata: _metadata }, _outputFormats_initializers, _outputFormats_extraInitializers);
            __esDecorate(null, null, _estimatedPages_decorators, { kind: "field", name: "estimatedPages", static: false, private: false, access: { has: function (obj) { return "estimatedPages" in obj; }, get: function (obj) { return obj.estimatedPages; }, set: function (obj, value) { obj.estimatedPages = value; } }, metadata: _metadata }, _estimatedPages_initializers, _estimatedPages_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateDocumentTypeDto = CreateDocumentTypeDto;
