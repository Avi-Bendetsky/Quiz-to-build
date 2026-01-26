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
exports.DocumentBuilderService = void 0;
var common_1 = require("@nestjs/common");
var docx_1 = require("docx");
var client_1 = require("@prisma/client");
var DocumentBuilderService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DocumentBuilderService = _classThis = /** @class */ (function () {
        function DocumentBuilderService_1() {
            this.logger = new common_1.Logger(DocumentBuilderService.name);
        }
        /**
         * Build a DOCX document from template data
         */
        DocumentBuilderService_1.prototype.buildDocument = function (templateData, documentType) {
            return __awaiter(this, void 0, void 0, function () {
                var sections, doc;
                return __generator(this, function (_a) {
                    this.logger.log("Building document: ".concat(documentType.name));
                    sections = this.buildSections(templateData, documentType);
                    doc = new docx_1.Document({
                        creator: 'Adaptive Questionnaire System',
                        title: documentType.name,
                        description: "Generated ".concat(documentType.name, " document"),
                        styles: this.getDocumentStyles(),
                        sections: [
                            {
                                properties: {
                                    page: {
                                        margin: {
                                            top: 1440, // 1 inch = 1440 twips
                                            right: 1440,
                                            bottom: 1440,
                                            left: 1440,
                                        },
                                    },
                                },
                                headers: {
                                    default: this.buildHeader(documentType.name),
                                },
                                footers: {
                                    default: this.buildFooter(),
                                },
                                children: sections,
                            },
                        ],
                    });
                    return [2 /*return*/, docx_1.Packer.toBuffer(doc)];
                });
            });
        };
        /**
         * Build document sections based on category and content
         */
        DocumentBuilderService_1.prototype.buildSections = function (templateData, documentType) {
            var sections = [];
            // Title
            sections.push(this.buildTitle(documentType.name));
            // Document Control section
            sections.push.apply(sections, this.buildDocumentControl(templateData));
            // Content sections based on category
            switch (documentType.category) {
                case client_1.DocumentCategory.CTO:
                    sections.push.apply(sections, this.buildCTOContent(templateData));
                    break;
                case client_1.DocumentCategory.CFO:
                    sections.push.apply(sections, this.buildCFOContent(templateData));
                    break;
                case client_1.DocumentCategory.BA:
                    sections.push.apply(sections, this.buildBAContent(templateData));
                    break;
            }
            // Standards section for CTO documents
            if (templateData.standards && templateData.standards.length > 0) {
                sections.push.apply(sections, this.buildStandardsSection(templateData.standards));
            }
            return sections;
        };
        /**
         * Build document title
         */
        DocumentBuilderService_1.prototype.buildTitle = function (title) {
            return new docx_1.Paragraph({
                children: [
                    new docx_1.TextRun({
                        text: title,
                        bold: true,
                        size: 48, // 24pt
                    }),
                ],
                heading: docx_1.HeadingLevel.TITLE,
                alignment: docx_1.AlignmentType.CENTER,
                spacing: { after: 400 },
            });
        };
        /**
         * Build document control section
         */
        DocumentBuilderService_1.prototype.buildDocumentControl = function (templateData) {
            return [
                this.buildHeading('Document Control', docx_1.HeadingLevel.HEADING_1),
                this.buildTable([
                    ['Version', templateData.metadata.version],
                    ['Date', templateData.metadata.generatedAt.toISOString().split('T')[0]],
                    ['Document Type', templateData.metadata.documentType],
                    ['Classification', 'Internal'],
                ]),
                this.buildEmptyParagraph(),
            ];
        };
        /**
         * Build CTO document content
         */
        DocumentBuilderService_1.prototype.buildCTOContent = function (templateData) {
            var _a;
            var sections = [];
            var content = templateData.content;
            // Executive Summary
            if (content.executive_summary) {
                sections.push(this.buildHeading('Executive Summary', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.executive_summary));
            }
            // Technical Overview
            if (content.technical_overview || content.architecture) {
                sections.push(this.buildHeading('Technical Overview', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection((_a = content.technical_overview) !== null && _a !== void 0 ? _a : content.architecture));
            }
            // Infrastructure
            if (content.infrastructure) {
                sections.push(this.buildHeading('Infrastructure', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.infrastructure));
            }
            // Security
            if (content.security) {
                sections.push(this.buildHeading('Security', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.security));
            }
            return sections;
        };
        /**
         * Build CFO document content (Business Plan)
         */
        DocumentBuilderService_1.prototype.buildCFOContent = function (templateData) {
            var sections = [];
            var content = templateData.content;
            // Executive Summary
            if (content.executive_summary) {
                sections.push(this.buildHeading('Executive Summary', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.executive_summary));
            }
            // Company Description
            if (content.company_description) {
                sections.push(this.buildHeading('Company Description', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.company_description));
            }
            // Market Analysis
            if (content.market_analysis) {
                sections.push(this.buildHeading('Market Analysis', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.market_analysis));
            }
            // Financial Projections
            if (content.financial_projections) {
                sections.push(this.buildHeading('Financial Projections', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.financial_projections));
            }
            // Risk Management
            if (content.risk_management) {
                sections.push(this.buildHeading('Risk Management', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.risk_management));
            }
            return sections;
        };
        /**
         * Build BA document content
         */
        DocumentBuilderService_1.prototype.buildBAContent = function (templateData) {
            var _a;
            var sections = [];
            var content = templateData.content;
            // Introduction/Overview
            if (content.introduction || content.overview) {
                sections.push(this.buildHeading('Introduction', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection((_a = content.introduction) !== null && _a !== void 0 ? _a : content.overview));
            }
            // Business Requirements
            if (content.business_requirements) {
                sections.push(this.buildHeading('Business Requirements', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.business_requirements));
            }
            // Functional Requirements
            if (content.functional_requirements) {
                sections.push(this.buildHeading('Functional Requirements', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.functional_requirements));
            }
            // User Stories
            if (content.user_stories) {
                sections.push(this.buildHeading('User Stories', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.user_stories));
            }
            // Process Flows
            if (content.process_flows) {
                sections.push(this.buildHeading('Process Flows', docx_1.HeadingLevel.HEADING_1));
                sections.push.apply(sections, this.buildContentSection(content.process_flows));
            }
            return sections;
        };
        /**
         * Build standards section for CTO documents
         */
        DocumentBuilderService_1.prototype.buildStandardsSection = function (standards) {
            var sections = [];
            sections.push(this.buildHeading('Engineering Standards', docx_1.HeadingLevel.HEADING_1));
            for (var _i = 0, standards_1 = standards; _i < standards_1.length; _i++) {
                var standard = standards_1[_i];
                sections.push(this.buildHeading(standard.title, docx_1.HeadingLevel.HEADING_2));
                sections.push(this.buildParagraph(standard.description));
                for (var _a = 0, _b = standard.principles; _a < _b.length; _a++) {
                    var principle = _b[_a];
                    sections.push(this.buildHeading(principle.title, docx_1.HeadingLevel.HEADING_3));
                    sections.push(this.buildParagraph(principle.description));
                }
            }
            return sections;
        };
        /**
         * Build content section from nested object
         */
        DocumentBuilderService_1.prototype.buildContentSection = function (content) {
            var paragraphs = [];
            if (typeof content === 'string') {
                paragraphs.push(this.buildParagraph(content));
            }
            else if (Array.isArray(content)) {
                for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
                    var item = content_1[_i];
                    paragraphs.push(this.buildBulletPoint(String(item)));
                }
            }
            else if (typeof content === 'object' && content !== null) {
                for (var _a = 0, _b = Object.entries(content); _a < _b.length; _a++) {
                    var _c = _b[_a], key = _c[0], value = _c[1];
                    var label = this.formatLabel(key);
                    if (typeof value === 'string' || typeof value === 'number') {
                        paragraphs.push(this.buildLabeledParagraph(label, String(value)));
                    }
                    else if (Array.isArray(value)) {
                        paragraphs.push(this.buildHeading(label, docx_1.HeadingLevel.HEADING_3));
                        for (var _d = 0, value_1 = value; _d < value_1.length; _d++) {
                            var item = value_1[_d];
                            paragraphs.push(this.buildBulletPoint(String(item)));
                        }
                    }
                    else if (typeof value === 'object' && value !== null) {
                        paragraphs.push(this.buildHeading(label, docx_1.HeadingLevel.HEADING_2));
                        paragraphs.push.apply(paragraphs, this.buildContentSection(value));
                    }
                }
            }
            return paragraphs;
        };
        /**
         * Build a heading paragraph
         */
        DocumentBuilderService_1.prototype.buildHeading = function (text, level) {
            return new docx_1.Paragraph({
                children: [new docx_1.TextRun({ text: text, bold: true })],
                heading: level,
                spacing: { before: 240, after: 120 },
            });
        };
        /**
         * Build a regular paragraph
         */
        DocumentBuilderService_1.prototype.buildParagraph = function (text) {
            return new docx_1.Paragraph({
                children: [new docx_1.TextRun({ text: text })],
                spacing: { after: 120 },
            });
        };
        /**
         * Build a labeled paragraph (bold label: value)
         */
        DocumentBuilderService_1.prototype.buildLabeledParagraph = function (label, value) {
            return new docx_1.Paragraph({
                children: [
                    new docx_1.TextRun({ text: "".concat(label, ": "), bold: true }),
                    new docx_1.TextRun({ text: value }),
                ],
                spacing: { after: 120 },
            });
        };
        /**
         * Build a bullet point
         */
        DocumentBuilderService_1.prototype.buildBulletPoint = function (text) {
            return new docx_1.Paragraph({
                children: [new docx_1.TextRun({ text: text })],
                bullet: { level: 0 },
                spacing: { after: 60 },
            });
        };
        /**
         * Build an empty paragraph for spacing
         */
        DocumentBuilderService_1.prototype.buildEmptyParagraph = function () {
            return new docx_1.Paragraph({ children: [], spacing: { after: 200 } });
        };
        /**
         * Build a simple two-column table
         */
        DocumentBuilderService_1.prototype.buildTable = function (rows) {
            return new docx_1.Table({
                width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
                rows: rows.map(function (row) {
                    return new docx_1.TableRow({
                        children: row.map(function (cell, index) {
                            return new docx_1.TableCell({
                                children: [
                                    new docx_1.Paragraph({
                                        children: [
                                            new docx_1.TextRun({
                                                text: cell,
                                                bold: index === 0,
                                            }),
                                        ],
                                    }),
                                ],
                                width: { size: index === 0 ? 30 : 70, type: docx_1.WidthType.PERCENTAGE },
                                borders: {
                                    top: { style: docx_1.BorderStyle.SINGLE, size: 1 },
                                    bottom: { style: docx_1.BorderStyle.SINGLE, size: 1 },
                                    left: { style: docx_1.BorderStyle.SINGLE, size: 1 },
                                    right: { style: docx_1.BorderStyle.SINGLE, size: 1 },
                                },
                            });
                        }),
                    });
                }),
            });
        };
        /**
         * Build document header
         */
        DocumentBuilderService_1.prototype.buildHeader = function (title) {
            return new docx_1.Header({
                children: [
                    new docx_1.Paragraph({
                        children: [
                            new docx_1.TextRun({
                                text: title,
                                size: 20,
                                color: '666666',
                            }),
                        ],
                        alignment: docx_1.AlignmentType.RIGHT,
                    }),
                ],
            });
        };
        /**
         * Build document footer with page numbers
         */
        DocumentBuilderService_1.prototype.buildFooter = function () {
            return new docx_1.Footer({
                children: [
                    new docx_1.Paragraph({
                        children: [
                            new docx_1.TextRun({
                                text: 'Page ',
                                size: 20,
                            }),
                            new docx_1.TextRun({
                                children: [docx_1.PageNumber.CURRENT],
                                size: 20,
                            }),
                            new docx_1.TextRun({
                                text: ' of ',
                                size: 20,
                            }),
                            new docx_1.TextRun({
                                children: [docx_1.PageNumber.TOTAL_PAGES],
                                size: 20,
                            }),
                        ],
                        alignment: docx_1.AlignmentType.CENTER,
                    }),
                ],
            });
        };
        /**
         * Get document styles
         */
        DocumentBuilderService_1.prototype.getDocumentStyles = function () {
            return {
                default: {
                    document: {
                        run: {
                            font: 'Calibri',
                            size: 24, // 12pt
                        },
                        paragraph: {
                            spacing: {
                                line: 276, // 1.15 line spacing
                            },
                        },
                    },
                },
            };
        };
        /**
         * Format a key to a human-readable label
         */
        DocumentBuilderService_1.prototype.formatLabel = function (key) {
            return key
                .replace(/_/g, ' ')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        };
        return DocumentBuilderService_1;
    }());
    __setFunctionName(_classThis, "DocumentBuilderService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentBuilderService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentBuilderService = _classThis;
}();
exports.DocumentBuilderService = DocumentBuilderService;
