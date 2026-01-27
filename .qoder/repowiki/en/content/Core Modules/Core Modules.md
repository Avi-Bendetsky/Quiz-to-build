# Core Modules

<cite>
**Referenced Files in This Document**
- [app.module.ts](file://apps/api/src/app.module.ts)
- [auth.module.ts](file://apps/api/src/modules/auth/auth.module.ts)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts)
- [users.module.ts](file://apps/api/src/modules/users/users.module.ts)
- [users.service.ts](file://apps/api/src/modules/users/users.service.ts)
- [questionnaire.module.ts](file://apps/api/src/modules/questionnaire/questionnaire.module.ts)
- [questionnaire.service.ts](file://apps/api/src/modules/questionnaire/questionnaire.service.ts)
- [session.module.ts](file://apps/api/src/modules/session/session.module.ts)
- [session.service.ts](file://apps/api/src/modules/session/session.service.ts)
- [standards.module.ts](file://apps/api/src/modules/standards/standards.module.ts)
- [standards.service.ts](file://apps/api/src/modules/standards/standards.service.ts)
- [adaptive-logic.module.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.module.ts)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts)
- [rule.types.ts](file://apps/api/src/modules/adaptive-logic/types/rule.types.ts)
- [standard.types.ts](file://apps/api/src/modules/standards/types/standard.types.ts)
- [register.dto.ts](file://apps/api/src/modules/auth/dto/register.dto.ts)
- [create-session.dto.ts](file://apps/api/src/modules/session/dto/create-session.dto.ts)
- [admin.module.ts](file://apps/api/src/modules/admin/admin.module.ts)
- [admin-questionnaire.service.ts](file://apps/api/src/modules/admin/services/admin-questionnaire.service.ts)
- [admin-audit.service.ts](file://apps/api/src/modules/admin/services/admin-audit.service.ts)
- [admin-questionnaire.controller.ts](file://apps/api/src/modules/admin/controllers/admin-questionnaire.controller.ts)
- [document-generator.module.ts](file://apps/api/src/modules/document-generator/document-generator.module.ts)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts)
- [document-controller.ts](file://apps/api/src/modules/document-generator/controllers/document.controller.ts)
- [document-admin.controller.ts](file://apps/api/src/modules/document-generator/controllers/document-admin.controller.ts)
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts)
- [document-builder.service.ts](file://apps/api/src/modules/document-generator/services/document-builder.service.ts)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts)
</cite>

## Update Summary
**Changes Made**
- Added comprehensive documentation for 8 new core modules that transform the system from a simple questionnaire platform to a full adaptive platform
- Documented the Admin module for questionnaire management and audit trails
- Documented the Document Generator module for automated document creation and management
- Updated architectural overview to reflect the expanded 8-module system
- Enhanced dependency analysis to include new modules and their relationships
- Added detailed component analysis for new administrative and document generation capabilities

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document explains the core modules that power the Quiz-to-build adaptive platform system. The system has evolved from a simple questionnaire platform to a comprehensive adaptive platform with 8 core modules. These modules include Authentication, User Management, Questionnaire, Session, Standards, Adaptive Logic, Admin, and Document Generator. Each module encapsulates distinct business capabilities and integrates through NestJS modules and services. Together, they orchestrate a secure, adaptive, scalable quiz/survey experience with dynamic question flows, user lifecycle management, compliance-driven content generation, administrative capabilities, and automated document production.

## Project Structure
The application is organized as a NestJS monorepo-style setup under apps/api with feature-based modules. The AppModule wires together configuration, rate limiting, database, cache, and all 8 feature modules. Each module exposes controllers and services, with internal submodules for specialized concerns like adaptive logic evaluation, standards mapping, administrative operations, and document generation.

```mermaid
graph TB
subgraph "App Layer"
AppModule["AppModule<br/>Imports: Config, Throttler, Prisma, Redis,<br/>Auth, Users, Questionnaire, Session, AdaptiveLogic, Standards,<br/>Admin, DocumentGenerator"]
end
subgraph "Core Feature Modules"
AuthModule["AuthModule"]
UsersModule["UsersModule"]
QuestionnaireModule["QuestionnaireModule"]
SessionModule["SessionModule"]
AdaptiveLogicModule["AdaptiveLogicModule"]
StandardsModule["StandardsModule"]
end
subgraph "Extended Feature Modules"
AdminModule["AdminModule"]
DocumentGeneratorModule["DocumentGeneratorModule"]
end
subgraph "Libraries"
PrismaModule["PrismaModule"]
RedisModule["RedisModule"]
end
AppModule --> AuthModule
AppModule --> UsersModule
AppModule --> QuestionnaireModule
AppModule --> SessionModule
AppModule --> AdaptiveLogicModule
AppModule --> StandardsModule
AppModule --> AdminModule
AppModule --> DocumentGeneratorModule
AppModule --> PrismaModule
AppModule --> RedisModule
SessionModule --> QuestionnaireModule
SessionModule -. forwardRef .-> AdaptiveLogicModule
AdaptiveLogicModule -. forwardRef .-> SessionModule
StandardsModule --> PrismaModule
AdminModule --> PrismaModule
DocumentGeneratorModule --> PrismaModule
DocumentGeneratorModule --> ConfigModule
```

**Diagram sources**
- [app.module.ts](file://apps/api/src/app.module.ts#L16-L66)
- [auth.module.ts](file://apps/api/src/modules/auth/auth.module.ts#L11-L28)
- [users.module.ts](file://apps/api/src/modules/users/users.module.ts#L5-L9)
- [questionnaire.module.ts](file://apps/api/src/modules/questionnaire/questionnaire.module.ts#L5-L8)
- [session.module.ts](file://apps/api/src/modules/session/session.module.ts#L7-L14)
- [adaptive-logic.module.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.module.ts#L6-L9)
- [standards.module.ts](file://apps/api/src/modules/standards/standards.module.ts#L6-L10)
- [admin.module.ts](file://apps/api/src/modules/admin/admin.module.ts#L1-L14)
- [document-generator.module.ts](file://apps/api/src/modules/document-generator/document-generator.module.ts#L1-L23)

**Section sources**
- [app.module.ts](file://apps/api/src/app.module.ts#L1-L67)

## Core Components
This section outlines each module's purpose, scope, and primary responsibilities.

- Authentication (AuthModule/AuthService)
  - Purpose: Secure user registration, login, JWT issuance, refresh token lifecycle, logout, and user validation.
  - Scope: Password hashing, failed login locking, Redis-backed refresh tokens, and guarded routes via JWT and role guards.
  - Key integrations: Prisma for persistence, Redis for refresh token storage, ConfigService for secrets and TTLs.

- User Management (UsersModule/UsersService)
  - Purpose: Retrieve and update user profiles, compute derived statistics, and list users with pagination.
  - Scope: Profile fields, preferences, organization linkage, and completion metrics.
  - Key integrations: Prisma queries and mapped DTOs for consistent responses.

- Questionnaire (QuestionnaireModule/QuestionnaireService)
  - Purpose: Manage questionnaire metadata, sections, and questions; expose lists and details with visibility rules.
  - Scope: Pagination, industry filtering, question option normalization, and validation rule mapping.
  - Key integrations: Prisma for hierarchical data retrieval.

- Session (SessionModule/SessionService)
  - Purpose: Drive interactive quiz sessions, manage progress, enforce validation, and integrate adaptive logic.
  - Scope: Create, continue, submit responses, calculate progress, and determine completion eligibility.
  - Key integrations: QuestionnaireService for question metadata, AdaptiveLogicService for visibility, Prisma for persistence.

- Adaptive Logic (AdaptiveLogicModule/AdaptiveLogicService)
  - Purpose: Evaluate visibility and requirement rules, derive next questions, and compute adaptive changes.
  - Scope: Condition evaluation engine, rule prioritization, dependency graph building, and metrics-friendly APIs.
  - Key integrations: Prisma for rule and question data, ConditionEvaluator for operator logic.

- Standards (StandardsModule/StandardsService)
  - Purpose: Provide engineering standards, map standards to document types, and generate standardized content sections.
  - Scope: Category-based retrieval, mapping resolution, and markdown generation for compliance sections.
  - Key integrations: Prisma for standards and mappings.

- Admin (AdminModule/AdminQuestionnaireService)
  - Purpose: Comprehensive questionnaire administration, CRUD operations, visibility rule management, and audit logging.
  - Scope: Questionnaire lifecycle management, section and question organization, rule creation and modification, audit trail maintenance.
  - Key integrations: Prisma for all administrative operations, AdminAuditService for compliance logging.

- Document Generator (DocumentGeneratorModule/DocumentGeneratorService)
  - Purpose: Automated document generation from questionnaire responses, template processing, and document lifecycle management.
  - Scope: Multi-category document types (CTO, CFO, BA), template assembly, DOCX generation, cloud storage integration, review workflows.
  - Key integrations: Prisma for document metadata, TemplateEngineService for data mapping, DocumentBuilderService for DOCX construction, StorageService for Azure Blob integration.

**Section sources**
- [auth.module.ts](file://apps/api/src/modules/auth/auth.module.ts#L1-L30)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L34-L278)
- [users.module.ts](file://apps/api/src/modules/users/users.module.ts#L1-L11)
- [users.service.ts](file://apps/api/src/modules/users/users.service.ts#L37-L200)
- [questionnaire.module.ts](file://apps/api/src/modules/questionnaire/questionnaire.module.ts#L1-L11)
- [questionnaire.service.ts](file://apps/api/src/modules/questionnaire/questionnaire.service.ts#L63-L253)
- [session.module.ts](file://apps/api/src/modules/session/session.module.ts#L1-L17)
- [session.service.ts](file://apps/api/src/modules/session/session.service.ts#L87-L684)
- [adaptive-logic.module.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.module.ts#L1-L12)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L19-L307)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L1-L402)
- [standards.module.ts](file://apps/api/src/modules/standards/standards.module.ts#L1-L13)
- [standards.service.ts](file://apps/api/src/modules/standards/standards.service.ts#L12-L197)
- [admin.module.ts](file://apps/api/src/modules/admin/admin.module.ts#L1-L14)
- [admin-questionnaire.service.ts](file://apps/api/src/modules/admin/services/admin-questionnaire.service.ts#L1-L608)
- [document-generator.module.ts](file://apps/api/src/modules/document-generator/document-generator.module.ts#L1-L23)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L1-L360)

## Architecture Overview
The system follows a layered, modular architecture with 8 core modules:
- AppModule orchestrates configuration, guards, and all feature modules.
- Core feature modules (Auth, Users, Questionnaire, Session, AdaptiveLogic, Standards) handle fundamental questionnaire functionality.
- Extended feature modules (Admin, DocumentGenerator) provide administrative and document automation capabilities.
- Cross-cutting concerns (security, caching, persistence) are provided by libraries (PrismaModule, RedisModule).
- Adaptive Logic is a specialized engine invoked by SessionService to dynamically shape the questionnaire flow.
- Document Generation integrates with Standards to create compliance-focused documents.

```mermaid
graph TB
Client["Client"]
AuthSvc["AuthService"]
UsersSvc["UsersService"]
QnSvc["QuestionnaireService"]
SessSvc["SessionService"]
AdvSvc["AdaptiveLogicService"]
CondEval["ConditionEvaluator"]
StdSvc["StandardsService"]
AdminSvc["AdminQuestionnaireService"]
DocGenSvc["DocumentGeneratorService"]
AuditSvc["AdminAuditService"]
TemplateSvc["TemplateEngineService"]
BuilderSvc["DocumentBuilderService"]
StorageSvc["StorageService"]
Client --> AuthSvc
Client --> UsersSvc
Client --> QnSvc
Client --> SessSvc
Client --> StdSvc
Client --> DocGenSvc
SessSvc --> QnSvc
SessSvc --> AdvSvc
AdvSvc --> CondEval
StdSvc --> QnSvc
AdminSvc --> AuditSvc
DocGenSvc --> TemplateSvc
DocGenSvc --> BuilderSvc
DocGenSvc --> StorageSvc
```

**Diagram sources**
- [app.module.ts](file://apps/api/src/app.module.ts#L50-L56)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L34-L278)
- [users.service.ts](file://apps/api/src/modules/users/users.service.ts#L37-L200)
- [questionnaire.service.ts](file://apps/api/src/modules/questionnaire/questionnaire.service.ts#L63-L253)
- [session.service.ts](file://apps/api/src/modules/session/session.service.ts#L87-L684)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L19-L307)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L1-L402)
- [standards.service.ts](file://apps/api/src/modules/standards/standards.service.ts#L12-L197)
- [admin-questionnaire.service.ts](file://apps/api/src/modules/admin/services/admin-questionnaire.service.ts#L46-L608)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L29-L360)
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts#L27-L290)
- [document-builder.service.ts](file://apps/api/src/modules/document-generator/services/document-builder.service.ts#L29-L481)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts#L19-L160)

## Detailed Component Analysis

### Authentication Module
Purpose:
- Provide secure user onboarding and session management with robust validation and resilience controls.

Key responsibilities:
- Registration with uniqueness checks and hashed passwords.
- Login with credential verification, lockout policy, and audit updates.
- Refresh token issuance and revocation using Redis and database records.
- JWT payload validation and protected route enforcement.

```mermaid
sequenceDiagram
participant C as "Client"
participant A as "AuthService"
participant P as "PrismaService"
participant R as "RedisService"
C->>A : "POST /auth/register"
A->>P : "Find user by email"
A->>P : "Create user with hashed password"
A->>A : "Generate access/refresh tokens"
A->>R : "Store refresh token"
A-->>C : "TokenResponseDto"
C->>A : "POST /auth/login"
A->>P : "Find user"
A->>A : "Verify password"
A->>P : "Reset failed attempts and update timestamps"
A-->>C : "TokenResponseDto"
C->>A : "POST /auth/refresh"
A->>R : "Lookup refresh token"
A->>P : "Load user"
A-->>C : "{accessToken, expiresIn}"
C->>A : "POST /auth/logout"
A->>R : "Delete refresh token"
A-->>C : "OK"
```

**Diagram sources**
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L54-L164)

**Section sources**
- [auth.module.ts](file://apps/api/src/modules/auth/auth.module.ts#L11-L28)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L34-L278)
- [register.dto.ts](file://apps/api/src/modules/auth/dto/register.dto.ts#L1-L24)

### User Management Module
Purpose:
- Centralize user profile operations with strict access control and rich statistics.

Key responsibilities:
- Fetch user by ID with organization and completion counts.
- Update profile fields and preferences with role-aware permissions.
- Paginated listing with optional role filter.

```mermaid
flowchart TD
Start(["User Request"]) --> Find["Find User by ID"]
Find --> Exists{"Exists and not deleted?"}
Exists --> |No| NotFound["Throw NotFound"]
Exists --> |Yes| Compute["Compute Documents Count"]
Compute --> Map["Map to UserProfile"]
Map --> Return["Return UserProfile"]
```

**Diagram sources**
- [users.service.ts](file://apps/api/src/modules/users/users.service.ts#L41-L73)

**Section sources**
- [users.module.ts](file://apps/api/src/modules/users/users.module.ts#L1-L11)
- [users.service.ts](file://apps/api/src/modules/users/users.service.ts#L37-L200)

### Questionnaire Module
Purpose:
- Serve structured questionnaires with sections, questions, and visibility rules.

Key responsibilities:
- List and detail questionnaires with pagination and industry filtering.
- Resolve question metadata and normalize options/validation rules.
- Provide helpers to fetch questions by section and compute totals.

```mermaid
flowchart TD
Start(["Get Questionnaire Detail"]) --> Load["Load Questionnaire with Sections/Questions"]
Load --> Sections["Order Sections by Index"]
Sections --> Questions["Order Questions by Index"]
Questions --> Normalize["Normalize Options and Validation"]
Normalize --> Return["Return Detail Model"]
```

**Diagram sources**
- [questionnaire.service.ts](file://apps/api/src/modules/questionnaire/questionnaire.service.ts#L100-L123)

**Section sources**
- [questionnaire.module.ts](file://apps/api/src/modules/questionnaire/questionnaire.module.ts#L1-L11)
- [questionnaire.service.ts](file://apps/api/src/modules/questionnaire/questionnaire.service.ts#L63-L253)

### Session Module
Purpose:
- Drive interactive quiz sessions with dynamic visibility, validation, and progress tracking.

Key responsibilities:
- Create sessions and initialize adaptive state.
- Provide next questions respecting visibility and prior answers.
- Submit responses, validate inputs, and update progress.
- Continue sessions, compute section-level progress, and assess completion readiness.

```mermaid
sequenceDiagram
participant C as "Client"
participant S as "SessionService"
participant Q as "QuestionnaireService"
participant A as "AdaptiveLogicService"
participant DB as "PrismaService"
C->>S : "GET /sessions/{id}/continue?count=N"
S->>DB : "Load Session"
S->>Q : "Get Current Question"
S->>A : "Get Visible Questions"
A-->>S : "Visible Question List"
S->>DB : "List Responses"
S-->>C : "Next Questions + Section Progress"
C->>S : "POST /sessions/{id}/responses"
S->>Q : "Validate Question Exists"
S->>S : "Validate Response Value"
S->>DB : "Upsert Response"
S->>A : "Re-evaluate Visible Questions"
S->>DB : "Update Session Progress"
S-->>C : "SubmitResponseResult"
```

**Diagram sources**
- [session.service.ts](file://apps/api/src/modules/session/session.service.ts#L198-L268)
- [session.service.ts](file://apps/api/src/modules/session/session.service.ts#L270-L359)
- [questionnaire.service.ts](file://apps/api/src/modules/questionnaire/questionnaire.service.ts#L150-L162)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L31-L66)

**Section sources**
- [session.module.ts](file://apps/api/src/modules/session/session.module.ts#L1-L17)
- [session.service.ts](file://apps/api/src/modules/session/session.service.ts#L87-L684)

### Adaptive Logic Module
Purpose:
- Evaluate visibility and requirement rules, derive next questions, and quantify adaptive changes.

Key responsibilities:
- Load questions with active visibility rules and evaluate them against current responses.
- Support complex nested conditions with multiple operators and logical combinations.
- Compute differences between previous and current visible sets to inform UI updates.

```mermaid
flowchart TD
Start(["Evaluate Question State"]) --> Init["Initialize State (visible=true, required=isRequired)"]
Init --> Rules{"Has Active Rules?"}
Rules --> |No| Return["Return Default State"]
Rules --> |Yes| Sort["Sort Rules by Priority Desc"]
Sort --> Loop["For Each Rule"]
Loop --> Eval["Evaluate Condition Against Responses"]
Eval --> Action{"Condition True?"}
Action --> |Yes| Apply["Apply Action (SHOW/HIDE/REQUIRE/UNREQUIRE)<br/>Mark Resolved Flags"]
Action --> |No| Next["Next Rule"]
Apply --> Check["Both Visibility and Required Resolved?"]
Check --> |Yes| Done["Stop Applying Rules"]
Check --> |No| Loop
Done --> Return["Return Final State"]
```

**Diagram sources**
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L71-L153)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L9-L22)
- [rule.types.ts](file://apps/api/src/modules/adaptive-logic/types/rule.types.ts#L38-L53)

**Section sources**
- [adaptive-logic.module.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.module.ts#L1-L12)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L19-L307)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L1-L402)
- [rule.types.ts](file://apps/api/src/modules/adaptive-logic/types/rule.types.ts#L1-L120)

### Standards Module
Purpose:
- Provide standardized engineering principles and generate compliance sections for documents.

Key responsibilities:
- Retrieve standards by category or list all active standards.
- Map standards to document types and generate markdown sections.
- Expose typed models for consistent API responses.

```mermaid
flowchart TD
Start(["Generate Standards Section"]) --> Lookup["Find Document Type"]
Lookup --> Found{"Found?"}
Found --> |No| Error["Throw NotFound"]
Found --> |Yes| Mappings["Resolve Standard Mappings"]
Mappings --> Build["Build Standards List with Titles"]
Build --> Markdown["Generate Markdown"]
Markdown --> Return["Return GeneratedStandardsSection"]
```

**Diagram sources**
- [standards.service.ts](file://apps/api/src/modules/standards/standards.service.ts#L105-L151)
- [standard.types.ts](file://apps/api/src/modules/standards/types/standard.types.ts#L42-L49)

**Section sources**
- [standards.module.ts](file://apps/api/src/modules/standards/standards.module.ts#L1-L13)
- [standards.service.ts](file://apps/api/src/modules/standards/standards.service.ts#L12-L197)
- [standard.types.ts](file://apps/api/src/modules/standards/types/standard.types.ts#L1-L60)

### Admin Module
Purpose:
- Provide comprehensive administrative capabilities for questionnaire management and system oversight.

Key responsibilities:
- Full CRUD operations for questionnaires, sections, and questions.
- Visibility rule management with priority and action control.
- Audit logging for all administrative actions with IP tracking and user agent capture.
- Role-based access control with ADMIN and SUPER_ADMIN permissions.

```mermaid
flowchart TD
Start(["Admin Operation"]) --> Auth["JWT + Roles Guard"]
Auth --> Valid{"Valid Admin?"}
Valid --> |No| Deny["403 Forbidden"]
Valid --> |Yes| Action{"Operation Type"}
Action --> |Create| Create["Create Resource"]
Action --> |Update| Update["Update Resource"]
Action --> |Delete| Delete["Soft Delete/Restrict"]
Action --> |List| List["Paginated List"]
Create --> Audit["Log Audit Event"]
Update --> Audit
Delete --> Audit
Audit --> Return["Return Result"]
```

**Diagram sources**
- [admin-questionnaire.controller.ts](file://apps/api/src/modules/admin/controllers/admin-questionnaire.controller.ts#L44-L284)
- [admin-audit.service.ts](file://apps/api/src/modules/admin/services/admin-audit.service.ts#L20-L46)

**Section sources**
- [admin.module.ts](file://apps/api/src/modules/admin/admin.module.ts#L1-L14)
- [admin-questionnaire.service.ts](file://apps/api/src/modules/admin/services/admin-questionnaire.service.ts#L46-L608)
- [admin-audit.service.ts](file://apps/api/src/modules/admin/services/admin-audit.service.ts#L1-L48)

### Document Generator Module
Purpose:
- Automate document creation from questionnaire responses with multi-category support and compliance integration.

Key responsibilities:
- Multi-category document generation (CTO, CFO, BA) with specialized content structures.
- Template engine for assembling response data into structured content objects.
- DOCX document builder with professional styling and page numbering.
- Cloud storage integration with Azure Blob for document retention and secure access.
- Review workflow management with approval and rejection processes.

```mermaid
sequenceDiagram
participant C as "Client"
participant DC as "DocumentController"
participant DGS as "DocumentGeneratorService"
participant TES as "TemplateEngineService"
participant DBS as "DocumentBuilderService"
participant SS as "StorageService"
C->>DC : "POST /documents/generate"
DC->>DGS : "generateDocument()"
DGS->>DGS : "Validate Session & Document Type"
DGS->>TES : "assembleTemplateData()"
TES->>TES : "Map Responses to Content"
TES-->>DGS : "TemplateData"
DGS->>DBS : "buildDocument()"
DBS->>DBS : "Build DOCX with Styles"
DBS-->>DGS : "Buffer"
DGS->>SS : "upload()"
SS-->>DGS : "Storage URL"
DGS-->>DC : "Document Metadata"
DC-->>C : "DocumentResponseDto"
```

**Diagram sources**
- [document-controller.ts](file://apps/api/src/modules/document-generator/controllers/document.controller.ts#L34-L163)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L42-L194)
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts#L35-L99)
- [document-builder.service.ts](file://apps/api/src/modules/document-generator/services/document-builder.service.ts#L35-L72)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts#L65-L95)

**Section sources**
- [document-generator.module.ts](file://apps/api/src/modules/document-generator/document-generator.module.ts#L1-L23)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L1-L360)
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts#L1-L290)
- [document-builder.service.ts](file://apps/api/src/modules/document-generator/services/document-builder.service.ts#L1-L481)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts#L1-L160)

## Dependency Analysis
Module-level dependencies and coupling with the expanded 8-module system:
- AppModule aggregates all 8 modules and cross-cutting services (PrismaModule, RedisModule).
- SessionModule depends on QuestionnaireModule and imports AdaptiveLogicModule via forwardRef to avoid circular dependencies.
- AdaptiveLogicModule depends on SessionModule via forwardRef to resolve next-question logic and to avoid cycles.
- StandardsModule depends on PrismaModule for data access.
- AdminModule depends on PrismaModule for all administrative operations and uses AdminAuditService for compliance logging.
- DocumentGeneratorModule depends on PrismaModule, ConfigModule, and integrates with Azure Blob Storage.
- AuthModule depends on ConfigModule and JwtModule for security configuration.

```mermaid
graph LR
AppModule --> AuthModule
AppModule --> UsersModule
AppModule --> QuestionnaireModule
AppModule --> SessionModule
AppModule --> AdaptiveLogicModule
AppModule --> StandardsModule
AppModule --> AdminModule
AppModule --> DocumentGeneratorModule
AppModule --> PrismaModule
AppModule --> RedisModule
SessionModule --> QuestionnaireModule
SessionModule -. forwardRef .-> AdaptiveLogicModule
AdaptiveLogicModule -. forwardRef .-> SessionModule
StandardsModule --> PrismaModule
AdminModule --> PrismaModule
DocumentGeneratorModule --> PrismaModule
DocumentGeneratorModule --> ConfigModule
```

**Diagram sources**
- [app.module.ts](file://apps/api/src/app.module.ts#L50-L56)
- [session.module.ts](file://apps/api/src/modules/session/session.module.ts#L7-L14)
- [adaptive-logic.module.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.module.ts#L6-L9)
- [standards.module.ts](file://apps/api/src/modules/standards/standards.module.ts#L6-L10)
- [admin.module.ts](file://apps/api/src/modules/admin/admin.module.ts#L1-L14)
- [document-generator.module.ts](file://apps/api/src/modules/document-generator/document-generator.module.ts#L1-L23)

**Section sources**
- [app.module.ts](file://apps/api/src/app.module.ts#L1-L67)
- [session.module.ts](file://apps/api/src/modules/session/session.module.ts#L1-L17)
- [adaptive-logic.module.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.module.ts#L1-L12)
- [standards.module.ts](file://apps/api/src/modules/standards/standards.module.ts#L1-L13)
- [admin.module.ts](file://apps/api/src/modules/admin/admin.module.ts#L1-L14)
- [document-generator.module.ts](file://apps/api/src/modules/document-generator/document-generator.module.ts#L1-L23)

## Performance Considerations
- Database queries leverage include/orderBy/count batching to minimize round trips across all 8 modules (e.g., UsersService, QuestionnaireService, AdminQuestionnaireService).
- SessionService computes progress and visibility deterministically; caching strategies can be considered for frequently accessed questionnaires.
- AdaptiveLogicService sorts rules by priority and short-circuits actions to reduce redundant evaluations.
- DTO validation occurs at the boundaries (e.g., RegisterDto, CreateSessionDto, Admin DTOs) to fail fast and reduce downstream processing overhead.
- Document generation processes are designed to be asynchronous, with proper error handling and status tracking.
- Template engine efficiently maps questionnaire responses to document content using optimized data structures.

## Troubleshooting Guide
Common issues and resolutions across the expanded 8-module system:

- Authentication failures
  - Invalid credentials or locked accounts trigger explicit exceptions; review failed login attempts and lockout thresholds.
  - Refresh token errors indicate missing or expired tokens in Redis or database.

- Access control
  - Session access checks ensure the requesting user owns the session; verify user ID propagation in requests.
  - Admin endpoints require proper role-based authorization (ADMIN/SUPER_ADMIN); verify user roles and permissions.

- Validation errors
  - Response validation enforces required fields and type-specific constraints; confirm question validation rules align with client payloads.
  - Admin operations validate data integrity and referential constraints; check for soft-deleted resources or orphaned relationships.

- Adaptive logic anomalies
  - Rule priority ordering determines final state; verify rule priorities and target question IDs.
  - ConditionEvaluator supports nested conditions and multiple operators; ensure payload shapes match expectations.

- Document generation issues
  - Session must be COMPLETED before document generation; verify session status and required question completion.
  - Document type validation ensures required questions are answered; check document type configuration and mapping.
  - Storage integration requires proper Azure Blob configuration; verify connection strings and container access.

- Administrative operations
  - Soft-delete restrictions prevent deletion of resources with associated data; clean up dependencies first.
  - Audit logging captures all administrative actions; use audit trails for troubleshooting and compliance.

**Section sources**
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L85-L126)
- [session.service.ts](file://apps/api/src/modules/session/session.service.ts#L548-L565)
- [session.service.ts](file://apps/api/src/modules/session/session.service.ts#L622-L659)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L87-L153)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L44-L109)
- [admin-questionnaire.service.ts](file://apps/api/src/modules/admin/services/admin-questionnaire.service.ts#L170-L193)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L42-L103)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts#L26-L56)

## Conclusion
The Quiz-to-build system has evolved into a comprehensive adaptive platform with 8 core modules, transforming from a simple questionnaire system to a full-featured adaptive platform. Each module maintains clear responsibilities and interacts through well-defined services and DTOs. AppModule orchestrates the entire system, while cross-module dependencies are carefully managed with forwardRef to prevent cycles. The addition of Admin and Document Generator modules significantly expands the platform's capabilities, enabling comprehensive questionnaire administration and automated document generation. Extending modules should preserve these boundaries: introduce new services for domain logic, keep controllers thin, and reuse shared DTOs and libraries for consistency. The modular architecture supports future expansion while maintaining system integrity and scalability.