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
exports.SubmitResponseDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var SubmitResponseDto = function () {
    var _a;
    var _questionId_decorators;
    var _questionId_initializers = [];
    var _questionId_extraInitializers = [];
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    var _timeSpentSeconds_decorators;
    var _timeSpentSeconds_initializers = [];
    var _timeSpentSeconds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SubmitResponseDto() {
                this.questionId = __runInitializers(this, _questionId_initializers, void 0);
                this.value = (__runInitializers(this, _questionId_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.timeSpentSeconds = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _timeSpentSeconds_initializers, void 0));
                __runInitializers(this, _timeSpentSeconds_extraInitializers);
            }
            return SubmitResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _questionId_decorators = [(0, swagger_1.ApiProperty)({ example: 'q_015', description: 'ID of the question being answered' }), (0, class_validator_1.IsUUID)()];
            _value_decorators = [(0, swagger_1.ApiProperty)({
                    example: { selectedOptionId: 'opt_001' },
                    description: 'Response value (structure depends on question type)',
                }), (0, class_validator_1.IsNotEmpty)()];
            _timeSpentSeconds_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 30, description: 'Time spent on this question in seconds' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _questionId_decorators, { kind: "field", name: "questionId", static: false, private: false, access: { has: function (obj) { return "questionId" in obj; }, get: function (obj) { return obj.questionId; }, set: function (obj, value) { obj.questionId = value; } }, metadata: _metadata }, _questionId_initializers, _questionId_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _timeSpentSeconds_decorators, { kind: "field", name: "timeSpentSeconds", static: false, private: false, access: { has: function (obj) { return "timeSpentSeconds" in obj; }, get: function (obj) { return obj.timeSpentSeconds; }, set: function (obj, value) { obj.timeSpentSeconds = value; } }, metadata: _metadata }, _timeSpentSeconds_initializers, _timeSpentSeconds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SubmitResponseDto = SubmitResponseDto;
var SubmitResponseDto = function () {
    var _a;
    var _questionId_decorators;
    var _questionId_initializers = [];
    var _questionId_extraInitializers = [];
    var _value_decorators;
    var _value_initializers = [];
    var _value_extraInitializers = [];
    var _timeSpentSeconds_decorators;
    var _timeSpentSeconds_initializers = [];
    var _timeSpentSeconds_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SubmitResponseDto() {
                this.questionId = __runInitializers(this, _questionId_initializers, void 0);
                this.value = (__runInitializers(this, _questionId_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.timeSpentSeconds = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _timeSpentSeconds_initializers, void 0));
                __runInitializers(this, _timeSpentSeconds_extraInitializers);
            }
            return SubmitResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _questionId_decorators = [(0, swagger_1.ApiProperty)({ example: 'q_015', description: 'ID of the question being answered' }), (0, class_validator_1.IsUUID)()];
            _value_decorators = [(0, swagger_1.ApiProperty)({
                    example: { selectedOptionId: 'opt_001' },
                    description: 'Response value (structure depends on question type)',
                }), (0, class_validator_1.IsNotEmpty)()];
            _timeSpentSeconds_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 30, description: 'Time spent on this question in seconds' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _questionId_decorators, { kind: "field", name: "questionId", static: false, private: false, access: { has: function (obj) { return "questionId" in obj; }, get: function (obj) { return obj.questionId; }, set: function (obj, value) { obj.questionId = value; } }, metadata: _metadata }, _questionId_initializers, _questionId_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: function (obj) { return "value" in obj; }, get: function (obj) { return obj.value; }, set: function (obj, value) { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _timeSpentSeconds_decorators, { kind: "field", name: "timeSpentSeconds", static: false, private: false, access: { has: function (obj) { return "timeSpentSeconds" in obj; }, get: function (obj) { return obj.timeSpentSeconds; }, set: function (obj, value) { obj.timeSpentSeconds = value; } }, metadata: _metadata }, _timeSpentSeconds_initializers, _timeSpentSeconds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SubmitResponseDto = SubmitResponseDto;
