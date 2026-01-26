"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.StandardWithMappingsDto = exports.DocumentTypeMappingDto = exports.StandardsSectionResponseDto = exports.DocumentStandardsParamDto = exports.StandardCategoryParamDto = exports.StandardResponseDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var StandardResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _principles_decorators;
    var _principles_initializers = [];
    var _principles_extraInitializers = [];
    var _version_decorators;
    var _version_initializers = [];
    var _version_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function StandardResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.category = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.title = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.principles = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _principles_initializers, void 0));
                this.version = (__runInitializers(this, _principles_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.isActive = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return StandardResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard ID' })];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: client_1.StandardCategory, description: 'Standard category' })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard title' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard description' })];
            _principles_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of principles', type: 'array' })];
            _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard version' })];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether the standard is active' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _principles_decorators, { kind: "field", name: "principles", static: false, private: false, access: { has: function (obj) { return "principles" in obj; }, get: function (obj) { return obj.principles; }, set: function (obj, value) { obj.principles = value; } }, metadata: _metadata }, _principles_initializers, _principles_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: function (obj) { return "version" in obj; }, get: function (obj) { return obj.version; }, set: function (obj, value) { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StandardResponseDto = StandardResponseDto;
var StandardCategoryParamDto = function () {
    var _a;
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    return _a = /** @class */ (function () {
            function StandardCategoryParamDto() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                __runInitializers(this, _category_extraInitializers);
            }
            return StandardCategoryParamDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: client_1.StandardCategory, description: 'Standard category' }), (0, class_validator_1.IsEnum)(client_1.StandardCategory)];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StandardCategoryParamDto = StandardCategoryParamDto;
var DocumentStandardsParamDto = function () {
    var _a;
    var _documentTypeId_decorators;
    var _documentTypeId_initializers = [];
    var _documentTypeId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DocumentStandardsParamDto() {
                this.documentTypeId = __runInitializers(this, _documentTypeId_initializers, void 0);
                __runInitializers(this, _documentTypeId_extraInitializers);
            }
            return DocumentStandardsParamDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _documentTypeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type ID or slug' }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _documentTypeId_decorators, { kind: "field", name: "documentTypeId", static: false, private: false, access: { has: function (obj) { return "documentTypeId" in obj; }, get: function (obj) { return obj.documentTypeId; }, set: function (obj, value) { obj.documentTypeId = value; } }, metadata: _metadata }, _documentTypeId_initializers, _documentTypeId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DocumentStandardsParamDto = DocumentStandardsParamDto;
var StandardsSectionResponseDto = function () {
    var _a;
    var _markdown_decorators;
    var _markdown_initializers = [];
    var _markdown_extraInitializers = [];
    var _standards_decorators;
    var _standards_initializers = [];
    var _standards_extraInitializers = [];
    return _a = /** @class */ (function () {
            function StandardsSectionResponseDto() {
                this.markdown = __runInitializers(this, _markdown_initializers, void 0);
                this.standards = (__runInitializers(this, _markdown_extraInitializers), __runInitializers(this, _standards_initializers, void 0));
                __runInitializers(this, _standards_extraInitializers);
            }
            return StandardsSectionResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _markdown_decorators = [(0, swagger_1.ApiProperty)({ description: 'Generated Markdown content' })];
            _standards_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standards included in the section', type: 'array' })];
            __esDecorate(null, null, _markdown_decorators, { kind: "field", name: "markdown", static: false, private: false, access: { has: function (obj) { return "markdown" in obj; }, get: function (obj) { return obj.markdown; }, set: function (obj, value) { obj.markdown = value; } }, metadata: _metadata }, _markdown_initializers, _markdown_extraInitializers);
            __esDecorate(null, null, _standards_decorators, { kind: "field", name: "standards", static: false, private: false, access: { has: function (obj) { return "standards" in obj; }, get: function (obj) { return obj.standards; }, set: function (obj, value) { obj.standards = value; } }, metadata: _metadata }, _standards_initializers, _standards_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StandardsSectionResponseDto = StandardsSectionResponseDto;
var DocumentTypeMappingDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    var _sectionTitle_decorators;
    var _sectionTitle_initializers = [];
    var _sectionTitle_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DocumentTypeMappingDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.slug = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                this.sectionTitle = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _sectionTitle_initializers, void 0));
                this.priority = (__runInitializers(this, _sectionTitle_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
            return DocumentTypeMappingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type ID' })];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type name' })];
            _slug_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type slug' })];
            _sectionTitle_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom section title for this document' })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority order in the document' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _sectionTitle_decorators, { kind: "field", name: "sectionTitle", static: false, private: false, access: { has: function (obj) { return "sectionTitle" in obj; }, get: function (obj) { return obj.sectionTitle; }, set: function (obj, value) { obj.sectionTitle = value; } }, metadata: _metadata }, _sectionTitle_initializers, _sectionTitle_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DocumentTypeMappingDto = DocumentTypeMappingDto;
var StandardWithMappingsDto = function () {
    var _a;
    var _classSuper = StandardResponseDto;
    var _documentTypes_decorators;
    var _documentTypes_initializers = [];
    var _documentTypes_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(StandardWithMappingsDto, _super);
            function StandardWithMappingsDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.documentTypes = __runInitializers(_this, _documentTypes_initializers, void 0);
                __runInitializers(_this, _documentTypes_extraInitializers);
                return _this;
            }
            return StandardWithMappingsDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _documentTypes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document types this standard is mapped to', type: [DocumentTypeMappingDto] })];
            __esDecorate(null, null, _documentTypes_decorators, { kind: "field", name: "documentTypes", static: false, private: false, access: { has: function (obj) { return "documentTypes" in obj; }, get: function (obj) { return obj.documentTypes; }, set: function (obj, value) { obj.documentTypes = value; } }, metadata: _metadata }, _documentTypes_initializers, _documentTypes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StandardWithMappingsDto = StandardWithMappingsDto;
var StandardResponseDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _principles_decorators;
    var _principles_initializers = [];
    var _principles_extraInitializers = [];
    var _version_decorators;
    var _version_initializers = [];
    var _version_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function StandardResponseDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.category = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.title = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.principles = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _principles_initializers, void 0));
                this.version = (__runInitializers(this, _principles_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.isActive = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return StandardResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard ID' })];
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: client_1.StandardCategory, description: 'Standard category' })];
            _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard title' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard description' })];
            _principles_decorators = [(0, swagger_1.ApiProperty)({ description: 'List of principles', type: 'array' })];
            _version_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standard version' })];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether the standard is active' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _principles_decorators, { kind: "field", name: "principles", static: false, private: false, access: { has: function (obj) { return "principles" in obj; }, get: function (obj) { return obj.principles; }, set: function (obj, value) { obj.principles = value; } }, metadata: _metadata }, _principles_initializers, _principles_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: function (obj) { return "version" in obj; }, get: function (obj) { return obj.version; }, set: function (obj, value) { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StandardResponseDto = StandardResponseDto;
var StandardCategoryParamDto = function () {
    var _a;
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    return _a = /** @class */ (function () {
            function StandardCategoryParamDto() {
                this.category = __runInitializers(this, _category_initializers, void 0);
                __runInitializers(this, _category_extraInitializers);
            }
            return StandardCategoryParamDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _category_decorators = [(0, swagger_1.ApiProperty)({ enum: client_1.StandardCategory, description: 'Standard category' }), (0, class_validator_1.IsEnum)(client_1.StandardCategory)];
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StandardCategoryParamDto = StandardCategoryParamDto;
var DocumentStandardsParamDto = function () {
    var _a;
    var _documentTypeId_decorators;
    var _documentTypeId_initializers = [];
    var _documentTypeId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DocumentStandardsParamDto() {
                this.documentTypeId = __runInitializers(this, _documentTypeId_initializers, void 0);
                __runInitializers(this, _documentTypeId_extraInitializers);
            }
            return DocumentStandardsParamDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _documentTypeId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type ID or slug' }), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _documentTypeId_decorators, { kind: "field", name: "documentTypeId", static: false, private: false, access: { has: function (obj) { return "documentTypeId" in obj; }, get: function (obj) { return obj.documentTypeId; }, set: function (obj, value) { obj.documentTypeId = value; } }, metadata: _metadata }, _documentTypeId_initializers, _documentTypeId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DocumentStandardsParamDto = DocumentStandardsParamDto;
var StandardsSectionResponseDto = function () {
    var _a;
    var _markdown_decorators;
    var _markdown_initializers = [];
    var _markdown_extraInitializers = [];
    var _standards_decorators;
    var _standards_initializers = [];
    var _standards_extraInitializers = [];
    return _a = /** @class */ (function () {
            function StandardsSectionResponseDto() {
                this.markdown = __runInitializers(this, _markdown_initializers, void 0);
                this.standards = (__runInitializers(this, _markdown_extraInitializers), __runInitializers(this, _standards_initializers, void 0));
                __runInitializers(this, _standards_extraInitializers);
            }
            return StandardsSectionResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _markdown_decorators = [(0, swagger_1.ApiProperty)({ description: 'Generated Markdown content' })];
            _standards_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standards included in the section', type: 'array' })];
            __esDecorate(null, null, _markdown_decorators, { kind: "field", name: "markdown", static: false, private: false, access: { has: function (obj) { return "markdown" in obj; }, get: function (obj) { return obj.markdown; }, set: function (obj, value) { obj.markdown = value; } }, metadata: _metadata }, _markdown_initializers, _markdown_extraInitializers);
            __esDecorate(null, null, _standards_decorators, { kind: "field", name: "standards", static: false, private: false, access: { has: function (obj) { return "standards" in obj; }, get: function (obj) { return obj.standards; }, set: function (obj, value) { obj.standards = value; } }, metadata: _metadata }, _standards_initializers, _standards_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StandardsSectionResponseDto = StandardsSectionResponseDto;
var DocumentTypeMappingDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _slug_decorators;
    var _slug_initializers = [];
    var _slug_extraInitializers = [];
    var _sectionTitle_decorators;
    var _sectionTitle_initializers = [];
    var _sectionTitle_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DocumentTypeMappingDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.slug = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
                this.sectionTitle = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _sectionTitle_initializers, void 0));
                this.priority = (__runInitializers(this, _sectionTitle_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
            return DocumentTypeMappingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type ID' })];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type name' })];
            _slug_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type slug' })];
            _sectionTitle_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom section title for this document' })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority order in the document' })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: function (obj) { return "slug" in obj; }, get: function (obj) { return obj.slug; }, set: function (obj, value) { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
            __esDecorate(null, null, _sectionTitle_decorators, { kind: "field", name: "sectionTitle", static: false, private: false, access: { has: function (obj) { return "sectionTitle" in obj; }, get: function (obj) { return obj.sectionTitle; }, set: function (obj, value) { obj.sectionTitle = value; } }, metadata: _metadata }, _sectionTitle_initializers, _sectionTitle_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DocumentTypeMappingDto = DocumentTypeMappingDto;
var StandardWithMappingsDto = function () {
    var _a;
    var _classSuper = StandardResponseDto;
    var _documentTypes_decorators;
    var _documentTypes_initializers = [];
    var _documentTypes_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(StandardWithMappingsDto, _super);
            function StandardWithMappingsDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.documentTypes = __runInitializers(_this, _documentTypes_initializers, void 0);
                __runInitializers(_this, _documentTypes_extraInitializers);
                return _this;
            }
            return StandardWithMappingsDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _documentTypes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document types this standard is mapped to', type: [DocumentTypeMappingDto] })];
            __esDecorate(null, null, _documentTypes_decorators, { kind: "field", name: "documentTypes", static: false, private: false, access: { has: function (obj) { return "documentTypes" in obj; }, get: function (obj) { return obj.documentTypes; }, set: function (obj, value) { obj.documentTypes = value; } }, metadata: _metadata }, _documentTypes_initializers, _documentTypes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.StandardWithMappingsDto = StandardWithMappingsDto;
