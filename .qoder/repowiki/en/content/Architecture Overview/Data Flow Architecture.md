# Data Flow Architecture

<cite>
**Referenced Files in This Document**
- [main.ts](file://apps/api/src/main.ts)
- [app.module.ts](file://apps/api/src/app.module.ts)
- [logging.interceptor.ts](file://apps/api/src/common/interceptors/logging.interceptor.ts)
- [transform.interceptor.ts](file://apps/api/src/common/interceptors/transform.interceptor.ts)
- [http-exception.filter.ts](file://apps/api/src/common/filters/http-exception.filter.ts)
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts)
- [questionnaire.controller.ts](file://apps/api/src/modules/questionnaire/questionnaire.controller.ts)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts)
- [rule.types.ts](file://apps/api/src/modules/adaptive-logic/types/rule.types.ts)
- [document-generator.module.ts](file://apps/api/src/modules/document-generator/document-generator.module.ts)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts)
- [document-controller.ts](file://apps/api/src/modules/document-generator/controllers/document.controller.ts)
- [document-admin.controller.ts](file://apps/api/src/modules/document-generator/controllers/document-admin.controller.ts)
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts)
- [document-builder.service.ts](file://apps/api/src/modules/document-generator/services/document-builder.service.ts)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts)
- [prisma.service.ts](file://libs/database/src/prisma.service.ts)
- [prisma.module.ts](file://libs/database/src/prisma.module.ts)
- [redis.service.ts](file://libs/redis/src/redis.service.ts)
- [redis.module.ts](file://libs/redis/src/redis.module.ts)
- [schema.prisma](file://prisma/schema.prisma)
</cite>

## Update Summary
**Changes Made**
- Removed comprehensive session state management documentation and diagrams
- Eliminated detailed adaptive state tracking sections that integrated Session Module with Adaptive Logic Module
- Removed ContinueSessionResponse and SubmitResponseResult interface documentation
- Updated architecture diagrams to reflect session integration removal
- Maintained authentication, adaptive logic, and document generation workflows

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Adaptive Logic Integration](#adaptive-logic-integration)
7. [Document Generation Workflow](#document-generation-workflow)
8. [Dependency Analysis](#dependency-analysis)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Conclusion](#conclusion)

## Introduction
This document describes the end-to-end data flow architecture for the Quiz-to-build system, focusing on authentication, adaptive logic integration, and document generation workflows. The system provides intelligent question routing based on user responses and automated document generation from questionnaire data, with comprehensive administrative controls for document types and quality assurance.

## Project Structure
The application is organized as a NestJS monorepo with enhanced modular architecture:
- Core modules for authentication, questionnaires, and standards
- Adaptive logic module for dynamic question routing and visibility rules
- Comprehensive document generation module with template engine and storage integration
- Shared libraries for database (Prisma) and cache (Redis)
- Advanced DTOs and service layers for complex business logic

```mermaid
graph TB
subgraph "Core Application"
MAIN["apps/api/src/main.ts"]
APPMOD["apps/api/src/app.module.ts"]
CTRL_AUTH["modules/auth/auth.controller.ts"]
CTRL_QUESTION["modules/questionnaire/questionnaire.controller.ts"]
INT_LOG["common/interceptors/logging.interceptor.ts"]
INT_TR["common/interceptors/transform.interceptor.ts"]
FILT_EX["common/filters/http-exception.filter.ts"]
end
subgraph "Enhanced Modules"
ADAPTIVE["modules/adaptive-logic/adaptive-logic.service.ts"]
CONDITION["modules/adaptive-logic/evaluators/condition.evaluator.ts"]
DOC_GEN["modules/document-generator/document-generator.module.ts"]
DOC_CTRL["modules/document-generator/controllers/document.controller.ts"]
DOC_ADMIN["modules/document-generator/controllers/document-admin.controller.ts"]
TEMPLATE["modules/document-generator/services/template-engine.service.ts"]
BUILDER["modules/document-generator/services/document-builder.service.ts"]
STORAGE["modules/document-generator/services/storage.service.ts"]
end
subgraph "Libraries"
PR_MOD["libs/database/src/prisma.module.ts"]
PR_SRV["libs/database/src/prisma.service.ts"]
RD_MOD["libs/redis/src/redis.module.ts"]
RD_SRV["libs/redis/src/redis.service.ts"]
end
SCHEMA["prisma/schema.prisma"]
MAIN --> APPMOD
APPMOD --> PR_MOD
APPMOD --> RD_MOD
APPMOD --> CTRL_AUTH
APPMOD --> CTRL_QUESTION
APPMOD --> ADAPTIVE
APPMOD --> DOC_GEN
CTRL_AUTH --> INT_LOG
CTRL_AUTH --> INT_TR
CTRL_QUESTION --> INT_LOG
CTRL_QUESTION --> INT_TR
ADAPTIVE --> CONDITION
DOC_GEN --> DOC_CTRL
DOC_GEN --> DOC_ADMIN
DOC_CTRL --> TEMPLATE
DOC_CTRL --> STORAGE
DOC_ADMIN --> TEMPLATE
DOC_ADMIN --> STORAGE
TEMPLATE --> BUILDER
BUILDER --> STORAGE
CTRL_AUTH --> FILT_EX
CTRL_QUESTION --> FILT_EX
ADAPTIVE --> PR_SRV
DOC_GEN --> PR_SRV
CTRL_AUTH --> RD_SRV
PR_SRV --> SCHEMA
RD_SRV --> RD_SRV
```

**Diagram sources**
- [main.ts](file://apps/api/src/main.ts#L11-L86)
- [app.module.ts](file://apps/api/src/app.module.ts#L16-L66)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L1-L264)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L1-L403)
- [document-generator.module.ts](file://apps/api/src/modules/document-generator/document-generator.module.ts#L1-L23)
- [document-controller.ts](file://apps/api/src/modules/document-generator/controllers/document.controller.ts#L1-L163)
- [document-admin.controller.ts](file://apps/api/src/modules/document-generator/controllers/document-admin.controller.ts#L1-L230)
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts#L1-L290)
- [document-builder.service.ts](file://apps/api/src/modules/document-generator/services/document-builder.service.ts#L1-L481)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts#L1-L160)

**Section sources**
- [main.ts](file://apps/api/src/main.ts#L11-L86)
- [app.module.ts](file://apps/api/src/app.module.ts#L16-L66)

## Core Components
- Bootstrap and global middleware:
  - Helmet security headers, CORS, global prefix, validation pipe, global exception filter, and global interceptors are configured at startup.
- Enhanced interceptors:
  - Logging interceptor captures request metadata and timing; logs both successes and errors.
  - Transform interceptor wraps all successful responses into a standardized envelope with success flag, data, and optional metadata.
- Exception filter:
  - Centralized handler for all exceptions, normalizing error responses with code, message, and requestId.
- Advanced modules and services:
  - Authentication service integrates JWT signing, bcrypt hashing, refresh token storage in Redis, and database persistence.
  - Adaptive logic service evaluates visibility rules, calculates adaptive changes, and manages branching logic.
  - Document generation service handles document creation, template processing, storage, and administrative workflows.
  - Database and Redis modules provide PrismaClient and Redis client instances with lifecycle hooks.

**Section sources**
- [main.ts](file://apps/api/src/main.ts#L20-L49)
- [logging.interceptor.ts](file://apps/api/src/common/interceptors/logging.interceptor.ts#L16-L60)
- [transform.interceptor.ts](file://apps/api/src/common/interceptors/transform.interceptor.ts#L21-L35)
- [http-exception.filter.ts](file://apps/api/src/common/filters/http-exception.filter.ts#L26-L82)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L34-L52)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L19-L264)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L28-L360)

## Architecture Overview
The system follows a layered architecture with adaptive intelligence and document automation:
- Transport layer: Express-based NestJS with global middleware and guards
- Presentation layer: Controllers expose endpoints and enforce auth guards
- Domain layer: Services encapsulate business logic, adaptive evaluation, and document generation
- Persistence layer: Prisma ORM for PostgreSQL and Redis for ephemeral state

```mermaid
graph TB
Client["Client"]
Helmet["Helmet"]
CORS["CORS"]
Guard["JWT Guard"]
CtrlAuth["AuthController"]
CtrlQuest["QuestionnaireController"]
CtrlDoc["DocumentController"]
CtrlAdmin["DocumentAdminController"]
IntLog["LoggingInterceptor"]
IntTr["TransformInterceptor"]
ExFilt["HttpExceptionFilter"]
SvcAuth["AuthService"]
SvcAdaptive["AdaptiveLogicService"]
SvcDocGen["DocumentGeneratorService"]
SvcTemplate["TemplateEngineService"]
SvcBuilder["DocumentBuilderService"]
SvcStorage["StorageService"]
Prisma["PrismaService"]
Redis["RedisService"]
DB["PostgreSQL"]
Cache["Redis"]
Client --> Helmet --> CORS --> Guard --> CtrlAuth
Client --> Helmet --> CORS --> Guard --> CtrlQuest
Client --> Helmet --> CORS --> Guard --> CtrlDoc
Client --> Helmet --> CORS --> Guard --> CtrlAdmin
CtrlAuth --> IntLog
CtrlAuth --> IntTr
CtrlQuest --> IntLog
CtrlQuest --> IntTr
CtrlDoc --> IntLog
CtrlDoc --> IntTr
CtrlAdmin --> IntLog
CtrlAdmin --> IntTr
CtrlAuth --> ExFilt
CtrlQuest --> ExFilt
CtrlDoc --> ExFilt
CtrlAdmin --> ExFilt
CtrlAuth --> SvcAuth
CtrlQuest --> SvcAdaptive
CtrlDoc --> SvcDocGen
CtrlAdmin --> SvcDocGen
SvcAdaptive --> Prisma
SvcDocGen --> SvcTemplate
SvcDocGen --> SvcBuilder
SvcDocGen --> SvcStorage
SvcTemplate --> Prisma
SvcBuilder --> Prisma
SvcStorage --> Prisma
SvcAuth --> Prisma
SvcAuth --> Redis
Prisma --> DB
Redis --> Cache
```

**Diagram sources**
- [main.ts](file://apps/api/src/main.ts#L20-L49)
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L24-L73)
- [questionnaire.controller.ts](file://apps/api/src/modules/questionnaire/questionnaire.controller.ts#L18-L55)
- [document-controller.ts](file://apps/api/src/modules/document-generator/controllers/document.controller.ts#L30-L163)
- [document-admin.controller.ts](file://apps/api/src/modules/document-generator/controllers/document-admin.controller.ts#L35-L230)
- [logging.interceptor.ts](file://apps/api/src/common/interceptors/logging.interceptor.ts#L16-L60)
- [transform.interceptor.ts](file://apps/api/src/common/interceptors/transform.interceptor.ts#L21-L35)
- [http-exception.filter.ts](file://apps/api/src/common/filters/http-exception.filter.ts#L26-L82)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L42-L52)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L19-L264)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L28-L360)
- [prisma.service.ts](file://libs/database/src/prisma.service.ts#L8-L40)
- [redis.service.ts](file://libs/redis/src/redis.service.ts#L10-L38)

## Detailed Component Analysis

### Authentication Data Flow
This flow covers user registration, login, token refresh, logout, and protected profile retrieval.

```mermaid
sequenceDiagram
participant C as "Client"
participant G as "JWT Guard"
participant AC as "AuthController"
participant AS as "AuthService"
participant PR as "PrismaService"
participant RS as "RedisService"
C->>AC : POST /auth/register
AC->>AS : register(dto)
AS->>PR : findUnique(email)
PR-->>AS : user|null
AS->>PR : create(user)
AS->>RS : setex(refresh : <token>, userId, ttl)
AS-->>AC : TokenResponseDto
AC-->>C : 201 {success : true, data : ...}
C->>AC : POST /auth/login
AC->>AS : login({email, password, ip})
AS->>PR : findUnique(email)
PR-->>AS : user
AS->>PR : update(lastLoginAt, failedLoginAttempts=0)
AS->>RS : setex(refresh : <token>, userId, ttl)
AS-->>AC : TokenResponseDto
AC-->>C : 200 {success : true, data : ...}
C->>AC : POST /auth/refresh
AC->>AS : refresh(refreshToken)
AS->>RS : get(refresh : <token>)
RS-->>AS : userId|nil
AS->>PR : findUnique(userId)
PR-->>AS : user
AS-->>AC : {accessToken, expiresIn}
AC-->>C : 200 {success : true, data : ...}
C->>AC : POST /auth/logout
AC->>AS : logout(refreshToken)
AS->>RS : del(refresh : <token>)
AS-->>AC : void
AC-->>C : 200 {success : true, data : {message}}
C->>AC : GET /auth/me
AC->>G : JwtAuthGuard
G->>AS : validateUser(payload)
AS->>PR : findUnique(userId)
PR-->>AS : user
AS-->>G : AuthenticatedUser
G-->>AC : user
AC-->>C : 200 {success : true, data : user}
```

**Diagram sources**
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L31-L72)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L54-L232)
- [prisma.service.ts](file://libs/database/src/prisma.service.ts#L8-L40)
- [redis.service.ts](file://libs/redis/src/redis.service.ts#L40-L59)

**Section sources**
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L27-L72)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L54-L232)
- [prisma.service.ts](file://libs/database/src/prisma.service.ts#L20-L40)
- [redis.service.ts](file://libs/redis/src/redis.service.ts#L40-L59)

### Request/Response Transformation Pipeline
The transform interceptor wraps all successful responses into a consistent envelope. The logging interceptor records request metadata and timing. The exception filter ensures all errors are normalized.

```mermaid
flowchart TD
Start(["Incoming Request"]) --> Guard["JWT Guard"]
Guard --> Controller["Controller Method"]
Controller --> Service["Service Logic"]
Service --> DB["Prisma ORM Queries"]
DB --> Service
Service --> Ok{"Success?"}
Ok --> |Yes| Transform["TransformInterceptor<br/>Wrap into {success:true, data, meta}"]
Transform --> Respond["Send Response"]
Ok --> |No| Error["HttpExceptionFilter<br/>Normalize error {success:false, error}"]
Error --> Respond
Respond --> Log["LoggingInterceptor<br/>Log method/url/status/duration/ip/userAgent/requestId"]
```

**Diagram sources**
- [transform.interceptor.ts](file://apps/api/src/common/interceptors/transform.interceptor.ts#L21-L35)
- [logging.interceptor.ts](file://apps/api/src/common/interceptors/logging.interceptor.ts#L16-L60)
- [http-exception.filter.ts](file://apps/api/src/common/filters/http-exception.filter.ts#L26-L82)

**Section sources**
- [transform.interceptor.ts](file://apps/api/src/common/interceptors/transform.interceptor.ts#L21-L35)
- [logging.interceptor.ts](file://apps/api/src/common/interceptors/logging.interceptor.ts#L16-L60)
- [http-exception.filter.ts](file://apps/api/src/common/filters/http-exception.filter.ts#L26-L82)

### Database Interaction Patterns Using Prisma ORM
- Initialization and lifecycle:
  - PrismaService extends PrismaClient and connects/disconnects on module init/destroy.
  - In development, slow queries are logged for performance tuning.
- Enhanced query execution:
  - Services call Prisma methods (find, create, upsert, update, count) to manage Users, Questionnaires, Sections, Questions, VisibilityRules, and Documents.
  - Complex queries now include visibility rule evaluation and document type mappings.
- Transactions and connection management:
  - The code does not explicitly use Prisma transactions; most operations are single-entity writes/read. For multi-entity consistency needs, explicit transactions could be introduced.

```mermaid
classDiagram
class PrismaService {
+onModuleInit()
+onModuleDestroy()
+$connect()
+$disconnect()
+$queryRaw()
+$executeRawUnsafe()
}
class User {
+id : string
+email : string
+role : UserRole
}
class Questionnaire {
+id : string
+name : string
+version : number
+sections : Section[]
}
class Section {
+id : string
+name : string
+orderIndex : number
+questions : Question[]
}
class Question {
+id : string
+text : string
+type : QuestionType
+isRequired : boolean
+validationRules : json
+visibilityRules : VisibilityRule[]
}
class VisibilityRule {
+id : string
+questionId : string
+condition : json
+action : VisibilityAction
+priority : number
+isActive : boolean
}
class Document {
+id : string
+questionnaireId : string
+documentTypeId : string
+status : DocumentStatus
+format : string
+storageUrl : string
}
PrismaService --> User : "manages"
PrismaService --> Questionnaire : "manages"
PrismaService --> Section : "manages"
PrismaService --> Question : "manages"
PrismaService --> VisibilityRule : "manages"
PrismaService --> Document : "manages"
Questionnaire "1" --> "*" Section : "has"
Section "1" --> "*" Question : "contains"
Question "1" --> "*" VisibilityRule : "has"
Questionnaire "1" --> "*" Document : "generates"
```

**Diagram sources**
- [prisma.service.ts](file://libs/database/src/prisma.service.ts#L8-L40)
- [schema.prisma](file://prisma/schema.prisma#L99-L147)
- [schema.prisma](file://prisma/schema.prisma#L270-L322)

**Section sources**
- [prisma.service.ts](file://libs/database/src/prisma.service.ts#L20-L40)
- [schema.prisma](file://prisma/schema.prisma#L99-L147)
- [schema.prisma](file://prisma/schema.prisma#L270-L322)

### Caching Strategy Using Redis
- Refresh token storage:
  - On login/register, refresh tokens are stored in Redis with TTL derived from configuration.
  - Token verification during refresh reads the token key; logout deletes the key.
- Redis client:
  - RedisService provides a pooled client with retry strategy, lifecycle hooks, and convenience methods for string/hash operations.

```mermaid
flowchart TD
A["AuthService: generateTokens(user)"] --> B["RedisService.setex(refresh:<token>, userId, ttl)"]
C["AuthService: refresh(refreshToken)"] --> D["RedisService.get(refresh:<token>)"]
D --> E{"Found?"}
E --> |Yes| F["PrismaService.findUnique(userId)"]
E --> |No| G["Throw Unauthorized"]
F --> H["Sign new access token"]
I["AuthService: logout(refreshToken)"] --> J["RedisService.del(refresh:<token>)"]
```

**Diagram sources**
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L192-L232)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L128-L164)
- [redis.service.ts](file://libs/redis/src/redis.service.ts#L40-L59)

**Section sources**
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L192-L232)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L128-L164)
- [redis.service.ts](file://libs/redis/src/redis.service.ts#L40-L59)

### Error Handling Throughout the Data Flow
- Centralized exception filter:
  - Converts HttpException and unhandled errors into a consistent error envelope with code, message, details, requestId, and timestamp.
  - Logs structured error entries with stack traces for debugging.
- Controller-level guard enforcement:
  - JWT guard protects endpoints; unauthorized access yields normalized 401 responses.
- Validation:
  - Global ValidationPipe enforces DTO constraints and transforms incoming data.

```mermaid
flowchart TD
Req["Request"] --> Pipe["ValidationPipe"]
Pipe --> Guard["JwtAuthGuard"]
Guard --> Ctrl["Controller"]
Ctrl --> Svc["Service"]
Svc --> Op{"Operation"}
Op --> |Success| OK["TransformInterceptor"]
Op --> |Error| EX["HttpExceptionFilter"]
OK --> Res["Response"]
EX --> Res
```

**Diagram sources**
- [main.ts](file://apps/api/src/main.ts#L34-L43)
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L64-L72)
- [http-exception.filter.ts](file://apps/api/src/common/filters/http-exception.filter.ts#L26-L82)
- [transform.interceptor.ts](file://apps/api/src/common/interceptors/transform.interceptor.ts#L21-L35)

**Section sources**
- [main.ts](file://apps/api/src/main.ts#L34-L43)
- [http-exception.filter.ts](file://apps/api/src/common/filters/http-exception.filter.ts#L26-L82)

### Logging and Monitoring Integration
- Logging interceptor:
  - Captures method, URL, status code, duration, IP, user agent, and request ID; logs both success and error outcomes.
- Prisma query logging:
  - Slow query warnings are emitted in development to aid performance analysis.
- Monitoring:
  - The system logs structured events suitable for ingestion by external monitoring systems (e.g., correlation by requestId).

```mermaid
sequenceDiagram
participant L as "LoggingInterceptor"
participant R as "Express Response"
L->>R : onEnd()
R-->>L : statusCode, duration
L->>L : log(JSON with metadata)
```

**Diagram sources**
- [logging.interceptor.ts](file://apps/api/src/common/interceptors/logging.interceptor.ts#L25-L59)
- [prisma.service.ts](file://libs/database/src/prisma.service.ts#L25-L33)

**Section sources**
- [logging.interceptor.ts](file://apps/api/src/common/interceptors/logging.interceptor.ts#L16-L60)
- [prisma.service.ts](file://libs/database/src/prisma.service.ts#L25-L33)

## Adaptive Logic Integration

### Adaptive Logic Service Architecture
The adaptive logic system provides intelligent question routing and visibility management based on user responses and predefined rules.

```mermaid
graph TB
ALS["AdaptiveLogicService"]
CE["ConditionEvaluator"]
PR["PrismaService"]
QR["QuestionnaireService"]
ALS --> CE
ALS --> PR
ALS --> QR
CE --> EQ["equals"]
CE --> INC["includes"]
CE --> NUM["numeric comparisons"]
CE --> STR["string operations"]
CE --> EMPTY["empty checks"]
ALS --> GVQ["getVisibleQuestions"]
ALS --> EQV["evaluateQuestionState"]
ALS --> GNQ["getNextQuestion"]
ALS --> CALC["calculateAdaptiveChanges"]
ALS --> GRF["getRulesForQuestion"]
ALS --> BDG["buildDependencyGraph"]
```

**Diagram sources**
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L19-L264)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L4-L403)
- [rule.types.ts](file://apps/api/src/modules/adaptive-logic/types/rule.types.ts#L3-L239)

### Condition Evaluation Engine
The condition evaluator supports complex logical operations and response value extraction.

```mermaid
flowchart TD
Start["Condition Evaluation Request"] --> CheckNested{"Has nested conditions?"}
CheckNested --> |Yes| EvalNested["Evaluate nested conditions<br/>with logical operator"]
CheckNested --> |No| CheckField{"Has field and operator?"}
EvalNested --> Result1["Return combined result"]
CheckField --> |No| True["Return true (no condition)"]
CheckField --> |Yes| Extract["Extract response value"]
Extract --> Compare["Apply operator comparison"]
Compare --> Result2["Return boolean result"]
True --> Result1
Result1 --> End["Evaluation Complete"]
Result2 --> End
```

**Diagram sources**
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L9-L403)

### Visibility Rule Processing
The system processes visibility rules to dynamically show/hide questions and adjust required fields.

```mermaid
sequenceDiagram
participant ALS as "AdaptiveLogicService"
participant PR as "PrismaService"
participant CE as "ConditionEvaluator"
ALS->>PR : findMany(questions with visibilityRules)
PR-->>ALS : questions with rules
ALS->>ALS : iterate through rules (highest priority first)
ALS->>CE : evaluateCondition(condition, responses)
CE-->>ALS : boolean result
ALS->>ALS : apply action (SHOW/HIDE/REQUIRE/UNREQUIRE)
ALS-->>ALS : final question state
```

**Diagram sources**
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L69-L110)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L9-L403)

**Section sources**
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L19-L264)
- [condition.evaluator.ts](file://apps/api/src/modules/adaptive-logic/evaluators/condition.evaluator.ts#L4-L403)
- [rule.types.ts](file://apps/api/src/modules/adaptive-logic/types/rule.types.ts#L3-L239)

## Document Generation Workflow

### Document Generation Architecture
The document generation system creates professional documents from questionnaire responses using templates and storage services.

```mermaid
graph TB
DG["DocumentGeneratorService"]
TE["TemplateEngineService"]
DB["DocumentBuilderService"]
ST["StorageService"]
PR["PrismaService"]
DG --> TE
DG --> DB
DG --> ST
DG --> PR
TE --> MAP["mapResponsesToContent"]
TE --> STD["buildStandardsSections"]
TE --> VAL["validateRequiredFields"]
DB --> SECTIONS["buildSections"]
DB --> CONTENT["buildContentSection"]
DB --> TABLES["buildTables"]
DB --> STYLES["apply document styles"]
ST --> UPLOAD["upload to Azure Blob Storage"]
ST --> SAS["generate SAS URLs"]
ST --> DELETE["delete documents"]
```

**Diagram sources**
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L28-L360)
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts#L26-L290)
- [document-builder.service.ts](file://apps/api/src/modules/document-generator/services/document-builder.service.ts#L28-L481)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts#L18-L160)

### Document Generation Process
The system generates documents through a multi-stage process with validation and storage.

```mermaid
sequenceDiagram
participant C as "Client"
participant DC as "DocumentController"
participant DGS as "DocumentGeneratorService"
participant TE as "TemplateEngineService"
participant DBS as "DocumentBuilderService"
participant STS as "StorageService"
participant PR as "PrismaService"
C->>DC : POST /documents/generate
DC->>DGS : generateDocument(params)
DGS->>PR : validate document type
DGS->>TE : assembleTemplateData(questionnaireId, slug)
TE->>PR : fetch responses and mappings
TE-->>TE : mapResponsesToContent()
TE-->>DGS : TemplateData
DGS->>DBS : buildDocument(templateData, typeInfo)
DBS-->>DGS : Buffer (DOCX)
DGS->>STS : upload(buffer, fileName, category)
STS-->>DGS : UploadResult
DGS->>PR : update document status
DGS-->>DC : Document
DC-->>C : 201 Created
```

**Diagram sources**
- [document-controller.ts](file://apps/api/src/modules/document-generator/controllers/document.controller.ts#L38-L54)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L42-L139)
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts#L35-L99)
- [document-builder.service.ts](file://apps/api/src/modules/document-generator/services/document-builder.service.ts#L35-L72)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts#L65-L95)

### Template Data Assembly
The template engine processes questionnaire responses into structured content for document generation.

```mermaid
flowchart TD
Start["assembleTemplateData"] --> FetchType["Fetch document type"]
FetchType --> FetchResponses["Fetch valid responses"]
FetchResponses --> MapContent["mapResponsesToContent"]
MapContent --> Extract["extractResponseValue"]
Extract --> SetNested["setNestedValue"]
SetNested --> BuildStandards["buildStandardsSections (CTO)"]
BuildStandards --> Return["Return TemplateData"]
```

**Diagram sources**
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts#L35-L136)

**Section sources**
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L28-L360)
- [document-controller.ts](file://apps/api/src/modules/document-generator/controllers/document.controller.ts#L30-L163)
- [template-engine.service.ts](file://apps/api/src/modules/document-generator/services/template-engine.service.ts#L26-L290)
- [document-builder.service.ts](file://apps/api/src/modules/document-generator/services/document-builder.service.ts#L28-L481)
- [storage.service.ts](file://apps/api/src/modules/document-generator/services/storage.service.ts#L18-L160)

## Dependency Analysis
- AppModule aggregates:
  - ConfigModule, ThrottlerModule, PrismaModule, RedisModule, and enhanced feature modules.
  - Registers global throttling guard and exposes guards via APP_GUARD.
- Enhanced feature modules depend on shared libraries:
  - Auth and Questionnaire modules inject PrismaService and RedisService.
  - Adaptive Logic module injects PrismaService and ConditionEvaluator.
  - Document Generator module injects PrismaService, TemplateEngineService, DocumentBuilderService, and StorageService.
- Controllers depend on services:
  - AuthController depends on AuthService.
  - QuestionnaireController depends on QuestionnaireService.
  - DocumentController depends on DocumentGeneratorService.
  - DocumentAdminController depends on DocumentGeneratorService and PrismaService.

```mermaid
graph LR
AppModule["AppModule"] --> Config["ConfigModule"]
AppModule --> Throttler["ThrottlerModule"]
AppModule --> PrismaMod["PrismaModule"]
AppModule --> RedisMod["RedisModule"]
AppModule --> AuthCtrl["AuthController"]
AppModule --> QuestionCtrl["QuestionnaireController"]
AppModule --> DocCtrl["DocumentController"]
AppModule --> DocAdminCtrl["DocumentAdminController"]
AppModule --> AdaptiveMod["AdaptiveLogicModule"]
AppModule --> DocGenMod["DocumentGeneratorModule"]
AuthCtrl --> AuthService
QuestionCtrl --> QuestionnaireService
DocCtrl --> DocumentGeneratorService
DocAdminCtrl --> DocumentGeneratorService
AdaptiveLogicService --> PrismaService
DocumentGeneratorService --> PrismaService
DocumentGeneratorService --> TemplateEngineService
DocumentGeneratorService --> DocumentBuilderService
DocumentGeneratorService --> StorageService
AuthService --> PrismaService
AuthService --> RedisService
```

**Diagram sources**
- [app.module.ts](file://apps/api/src/app.module.ts#L16-L66)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L19-L264)
- [document-generator.module.ts](file://apps/api/src/modules/document-generator/document-generator.module.ts#L11-L22)

**Section sources**
- [app.module.ts](file://apps/api/src/app.module.ts#L16-L66)

## Performance Considerations
- Interceptors:
  - Logging adds minimal overhead; ensure requestId propagation for tracing across services.
- Enhanced Prisma operations:
  - Use selective includes and where clauses to avoid N+1 queries; batch operations where possible.
  - Monitor slow queries in development; consider adding indexes for frequent filters.
  - Adaptive logic evaluation uses Map-based lookups for O(1) response access.
- Redis optimizations:
  - Keep TTLs aligned with token lifetimes; monitor key expiration and eviction policies.
  - Consider caching frequently accessed visibility rules and document templates.
- Document generation:
  - Template assembly processes responses in O(n) time; consider caching template data for repeated generations.
  - Storage operations use Azure Blob Storage with efficient upload and SAS URL generation.
- Validation:
  - ValidationPipe transforms inputs; keep DTOs concise to reduce unnecessary conversions.

## Troubleshooting Guide
- Unhandled errors:
  - Inspect the exception filter logs for stack traces and error envelopes.
- Authentication failures:
  - Check Redis refresh token presence and expiry; verify Prisma user existence and lockout fields.
- Document generation issues:
  - Check document type configuration and required question mappings.
  - Verify Azure Blob Storage connectivity and SAS URL generation.
  - Review template data assembly and document building process.
- Database connectivity:
  - Confirm PrismaService lifecycle logs and slow query warnings in development.
- Adaptive logic problems:
  - Validate visibility rule configurations and condition operators.
  - Check response value extraction for different question types.

**Section sources**
- [http-exception.filter.ts](file://apps/api/src/common/filters/http-exception.filter.ts#L56-L82)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L128-L164)
- [adaptive-logic.service.ts](file://apps/api/src/modules/adaptive-logic/adaptive-logic.service.ts#L19-L264)
- [document-generator.service.ts](file://apps/api/src/modules/document-generator/services/document-generator.service.ts#L42-L139)
- [prisma.service.ts](file://libs/database/src/prisma.service.ts#L20-L40)

## Conclusion
The Quiz-to-build system implements a comprehensive, intelligent architecture with adaptive logic integration and automated document generation. The system provides dynamic question routing based on user responses and professional document generation from questionnaire data. The adaptive logic engine evaluates complex visibility rules in real-time, while the document generation workflow transforms structured questionnaire responses into professional documents. The documented flows and diagrams serve as a blueprint for extending functionality, optimizing performance, and maintaining reliability in this enhanced system.