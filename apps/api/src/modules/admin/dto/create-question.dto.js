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
exports.CreateQuestionDto = exports.QuestionOptionDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var QuestionOptionDto = function () {
    var _a;
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    var _label_decorators;
    var _label_initializers = [];
    var _label_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    return _a = /** @class */ (function () {
            function QuestionOptionDto() {
                this.value = __runInitializers(this, _value_initializers, void 0);
                this.label = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _label_initializers, void 0));
                this.description = (__runInitializers(this, _label_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return QuestionOptionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _value_decorators = [(0, swagger_1.ApiProperty)({ example: 'option_1' }), (0, class_validator_1.IsString)()];
            _label_decorators = [(0, swagger_1.ApiProperty)({ example: 'Option 1' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Additional description for option' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _label_decorators, { kind: "field", name: "label", static: false, private: false, access: { has: function (obj) { return "label" in obj; }, get: function (obj) { return obj.label; }, set: function (obj, value) { obj.label = value; } }, metadata: _metadata }, _label_initializers, _label_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.QuestionOptionDto = QuestionOptionDto;
var CreateQuestionDto = function () {
    var _a;
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _helpText_decorators;
    var _helpText_initializers = [];
    var _helpText_extraInitializers = [];
    var _explanation_decorators;
    var _explanation_initializers = [];
    var _explanation_extraInitializers = [];
    var _placeholder_decorators;
    var _placeholder_initializers = [];
    var _placeholder_extraInitializers = [];
    var _isRequired_decorators;
    var _isRequired_initializers = [];
    var _isRequired_extraInitializers = [];
    var _options_decorators;
    var _options_initializers = [];
    var _options_extraInitializers = [];
    var _validationRules_decorators;
    var _validationRules_initializers = [];
    var _validationRules_extraInitializers = [];
    var _defaultValue_decorators;
    var _defaultValue_initializers = [];
    var _defaultValue_extraInitializers = [];
    var _suggestedAnswer_decorators;
    var _suggestedAnswer_initializers = [];
    var _suggestedAnswer_extraInitializers = [];
    var _industryTags_decorators;
    var _industryTags_initializers = [];
    var _industryTags_extraInitializers = [];
    var _documentMappings_decorators;
    var _documentMappings_initializers = [];
    var _documentMappings_extraInitializers = [];
    var _orderIndex_decorators;
    var _orderIndex_initializers = [];
    var _orderIndex_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateQuestionDto() {
                this.text = __runInitializers(this, _text_initializers, void 0);
                this.type = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.helpText = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _helpText_initializers, void 0));
                this.explanation = (__runInitializers(this, _helpText_extraInitializers), __runInitializers(this, _explanation_initializers, void 0));
                this.placeholder = (__runInitializers(this, _explanation_extraInitializers), __runInitializers(this, _placeholder_initializers, void 0));
                this.isRequired = (__runInitializers(this, _placeholder_extraInitializers), __runInitializers(this, _isRequired_initializers, void 0));
                this.options = (__runInitializers(this, _isRequired_extraInitializers), __runInitializers(this, _options_initializers, void 0));
                this.validationRules = (__runInitializers(this, _options_extraInitializers), __runInitializers(this, _validationRules_initializers, void 0));
                this.defaultValue = (__runInitializers(this, _validationRules_extraInitializers), __runInitializers(this, _defaultValue_initializers, void 0));
                this.suggestedAnswer = (__runInitializers(this, _defaultValue_extraInitializers), __runInitializers(this, _suggestedAnswer_initializers, void 0));
                this.industryTags = (__runInitializers(this, _suggestedAnswer_extraInitializers), __runInitializers(this, _industryTags_initializers, void 0));
                this.documentMappings = (__runInitializers(this, _industryTags_extraInitializers), __runInitializers(this, _documentMappings_initializers, void 0));
                this.orderIndex = (__runInitializers(this, _documentMappings_extraInitializers), __runInitializers(this, _orderIndex_initializers, void 0));
                this.metadata = (__runInitializers(this, _orderIndex_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
            return CreateQuestionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _text_decorators = [(0, swagger_1.ApiProperty)({ example: 'What is your company name?' }), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(1000)];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: client_1.QuestionType, example: client_1.QuestionType.TEXT }), (0, class_validator_1.IsEnum)(client_1.QuestionType)];
            _helpText_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Enter the legal name of your company' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _explanation_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'This will be used in official documents' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _placeholder_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'e.g., Acme Corporation' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isRequired_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _options_decorators = [(0, swagger_1.ApiPropertyOptional)({ type: [QuestionOptionDto], description: 'Options for choice-based questions' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _validationRules_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: { minLength: 2, maxLength: 200 }, description: 'Validation rules' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _defaultValue_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Default value for the question' }), (0, class_validator_1.IsOptional)()];
            _suggestedAnswer_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'AI-generated suggested answer' }), (0, class_validator_1.IsOptional)()];
            _industryTags_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: ['technology', 'saas'], description: 'Industry tags' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _documentMappings_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Mappings to document fields' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _orderIndex_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 0, description: 'Order position' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _helpText_decorators, { kind: "field", name: "helpText", static: false, private: false, access: { has: function (obj) { return "helpText" in obj; }, get: function (obj) { return obj.helpText; }, set: function (obj, value) { obj.helpText = value; } }, metadata: _metadata }, _helpText_initializers, _helpText_extraInitializers);
            __esDecorate(null, null, _explanation_decorators, { kind: "field", name: "explanation", static: false, private: false, access: { has: function (obj) { return "explanation" in obj; }, get: function (obj) { return obj.explanation; }, set: function (obj, value) { obj.explanation = value; } }, metadata: _metadata }, _explanation_initializers, _explanation_extraInitializers);
            __esDecorate(null, null, _placeholder_decorators, { kind: "field", name: "placeholder", static: false, private: false, access: { has: function (obj) { return "placeholder" in obj; }, get: function (obj) { return obj.placeholder; }, set: function (obj, value) { obj.placeholder = value; } }, metadata: _metadata }, _placeholder_initializers, _placeholder_extraInitializers);
            __esDecorate(null, null, _isRequired_decorators, { kind: "field", name: "isRequired", static: false, private: false, access: { has: function (obj) { return "isRequired" in obj; }, get: function (obj) { return obj.isRequired; }, set: function (obj, value) { obj.isRequired = value; } }, metadata: _metadata }, _isRequired_initializers, _isRequired_extraInitializers);
            __esDecorate(null, null, _options_decorators, { kind: "field", name: "options", static: false, private: false, access: { has: function (obj) { return "options" in obj; }, get: function (obj) { return obj.options; }, set: function (obj, value) { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
            __esDecorate(null, null, _validationRules_decorators, { kind: "field", name: "validationRules", static: false, private: false, access: { has: function (obj) { return "validationRules" in obj; }, get: function (obj) { return obj.validationRules; }, set: function (obj, value) { obj.validationRules = value; } }, metadata: _metadata }, _validationRules_initializers, _validationRules_extraInitializers);
            __esDecorate(null, null, _defaultValue_decorators, { kind: "field", name: "defaultValue", static: false, private: false, access: { has: function (obj) { return "defaultValue" in obj; }, get: function (obj) { return obj.defaultValue; }, set: function (obj, value) { obj.defaultValue = value; } }, metadata: _metadata }, _defaultValue_initializers, _defaultValue_extraInitializers);
            __esDecorate(null, null, _suggestedAnswer_decorators, { kind: "field", name: "suggestedAnswer", static: false, private: false, access: { has: function (obj) { return "suggestedAnswer" in obj; }, get: function (obj) { return obj.suggestedAnswer; }, set: function (obj, value) { obj.suggestedAnswer = value; } }, metadata: _metadata }, _suggestedAnswer_initializers, _suggestedAnswer_extraInitializers);
            __esDecorate(null, null, _industryTags_decorators, { kind: "field", name: "industryTags", static: false, private: false, access: { has: function (obj) { return "industryTags" in obj; }, get: function (obj) { return obj.industryTags; }, set: function (obj, value) { obj.industryTags = value; } }, metadata: _metadata }, _industryTags_initializers, _industryTags_extraInitializers);
            __esDecorate(null, null, _documentMappings_decorators, { kind: "field", name: "documentMappings", static: false, private: false, access: { has: function (obj) { return "documentMappings" in obj; }, get: function (obj) { return obj.documentMappings; }, set: function (obj, value) { obj.documentMappings = value; } }, metadata: _metadata }, _documentMappings_initializers, _documentMappings_extraInitializers);
            __esDecorate(null, null, _orderIndex_decorators, { kind: "field", name: "orderIndex", static: false, private: false, access: { has: function (obj) { return "orderIndex" in obj; }, get: function (obj) { return obj.orderIndex; }, set: function (obj, value) { obj.orderIndex = value; } }, metadata: _metadata }, _orderIndex_initializers, _orderIndex_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateQuestionDto = CreateQuestionDto;
