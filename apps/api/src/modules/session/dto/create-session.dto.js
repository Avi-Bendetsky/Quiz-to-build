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
exports.CreateSessionDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateSessionDto = function () {
    var _a;
    var _questionnaireId_decorators;
    var _questionnaireId_initializers = [];
    var _questionnaireId_extraInitializers = [];
    var _industry_decorators;
    var _industry_initializers = [];
    var _industry_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSessionDto() {
                this.questionnaireId = __runInitializers(this, _questionnaireId_initializers, void 0);
                this.industry = (__runInitializers(this, _questionnaireId_extraInitializers), __runInitializers(this, _industry_initializers, void 0));
                __runInitializers(this, _industry_extraInitializers);
            }
            return CreateSessionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _questionnaireId_decorators = [(0, swagger_1.ApiProperty)({ example: 'quest_001', description: 'ID of the questionnaire to start' }), (0, class_validator_1.IsUUID)()];
            _industry_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'saas', description: 'Industry context for adaptive logic' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            __esDecorate(null, null, _questionnaireId_decorators, { kind: "field", name: "questionnaireId", static: false, private: false, access: { has: function (obj) { return "questionnaireId" in obj; }, get: function (obj) { return obj.questionnaireId; }, set: function (obj, value) { obj.questionnaireId = value; } }, metadata: _metadata }, _questionnaireId_initializers, _questionnaireId_extraInitializers);
            __esDecorate(null, null, _industry_decorators, { kind: "field", name: "industry", static: false, private: false, access: { has: function (obj) { return "industry" in obj; }, get: function (obj) { return obj.industry; }, set: function (obj, value) { obj.industry = value; } }, metadata: _metadata }, _industry_initializers, _industry_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSessionDto = CreateSessionDto;
var CreateSessionDto = function () {
    var _a;
    var _questionnaireId_decorators;
    var _questionnaireId_initializers = [];
    var _questionnaireId_extraInitializers = [];
    var _industry_decorators;
    var _industry_initializers = [];
    var _industry_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSessionDto() {
                this.questionnaireId = __runInitializers(this, _questionnaireId_initializers, void 0);
                this.industry = (__runInitializers(this, _questionnaireId_extraInitializers), __runInitializers(this, _industry_initializers, void 0));
                __runInitializers(this, _industry_extraInitializers);
            }
            return CreateSessionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _questionnaireId_decorators = [(0, swagger_1.ApiProperty)({ example: 'quest_001', description: 'ID of the questionnaire to start' }), (0, class_validator_1.IsUUID)()];
            _industry_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'saas', description: 'Industry context for adaptive logic' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(100)];
            __esDecorate(null, null, _questionnaireId_decorators, { kind: "field", name: "questionnaireId", static: false, private: false, access: { has: function (obj) { return "questionnaireId" in obj; }, get: function (obj) { return obj.questionnaireId; }, set: function (obj, value) { obj.questionnaireId = value; } }, metadata: _metadata }, _questionnaireId_initializers, _questionnaireId_extraInitializers);
            __esDecorate(null, null, _industry_decorators, { kind: "field", name: "industry", static: false, private: false, access: { has: function (obj) { return "industry" in obj; }, get: function (obj) { return obj.industry; }, set: function (obj, value) { obj.industry = value; } }, metadata: _metadata }, _industry_initializers, _industry_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSessionDto = CreateSessionDto;
