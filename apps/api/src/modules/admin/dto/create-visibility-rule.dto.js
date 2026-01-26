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
exports.CreateVisibilityRuleDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var client_1 = require("@prisma/client");
var CreateVisibilityRuleDto = function () {
    var _a;
    var _condition_decorators;
    var _condition_initializers = [];
    var _condition_extraInitializers = [];
    var _action_decorators;
    var _action_initializers = [];
    var _action_extraInitializers = [];
    var _targetQuestionIds_decorators;
    var _targetQuestionIds_initializers = [];
    var _targetQuestionIds_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateVisibilityRuleDto() {
                this.condition = __runInitializers(this, _condition_initializers, void 0);
                this.action = (__runInitializers(this, _condition_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                this.targetQuestionIds = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _targetQuestionIds_initializers, void 0));
                this.priority = (__runInitializers(this, _targetQuestionIds_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.isActive = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return CreateVisibilityRuleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _condition_decorators = [(0, swagger_1.ApiProperty)({
                    example: {
                        type: 'AND',
                        conditions: [
                            { questionId: '123', operator: 'equals', value: 'yes' },
                        ],
                    },
                    description: 'JSON condition structure',
                }), (0, class_validator_1.IsObject)()];
            _action_decorators = [(0, swagger_1.ApiProperty)({ enum: client_1.VisibilityAction, example: client_1.VisibilityAction.SHOW }), (0, class_validator_1.IsEnum)(client_1.VisibilityAction)];
            _targetQuestionIds_decorators = [(0, swagger_1.ApiProperty)({
                    example: ['123e4567-e89b-12d3-a456-426614174000'],
                    description: 'UUIDs of questions affected by this rule',
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUUID)('4', { each: true })];
            _priority_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 0, description: 'Rule evaluation priority' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _isActive_decorators = [(0, swagger_1.ApiPropertyOptional)({ default: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _condition_decorators, { kind: "field", name: "condition", static: false, private: false, access: { has: function (obj) { return "condition" in obj; }, get: function (obj) { return obj.condition; }, set: function (obj, value) { obj.condition = value; } }, metadata: _metadata }, _condition_initializers, _condition_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: function (obj) { return "action" in obj; }, get: function (obj) { return obj.action; }, set: function (obj, value) { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            __esDecorate(null, null, _targetQuestionIds_decorators, { kind: "field", name: "targetQuestionIds", static: false, private: false, access: { has: function (obj) { return "targetQuestionIds" in obj; }, get: function (obj) { return obj.targetQuestionIds; }, set: function (obj, value) { obj.targetQuestionIds = value; } }, metadata: _metadata }, _targetQuestionIds_initializers, _targetQuestionIds_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateVisibilityRuleDto = CreateVisibilityRuleDto;
