# GRC MVP - Project Structure

## Complete Directory Tree

```
grc-mvp/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline configuration
│
├── backend/                          # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   ├── controllers/              # Request handlers
│   │   ├── middlewares/              # Express middlewares
│   │   ├── models/                   # Data models
│   │   ├── routes/                   # API routes
│   │   ├── services/                 # Business logic
│   │   ├── types/                    # TypeScript type definitions
│   │   ├── utils/                    # Utility functions
│   │   └── index.ts                  # Application entry point
│   │
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema definition
│   │   └── seed.ts                   # Database seeding script
│   │
│   ├── tests/
│   │   ├── unit/                     # Unit tests
│   │   ├── integration/              # Integration tests
│   │   ├── e2e/                      # End-to-end tests
│   │   └── setup.ts                  # Test setup configuration
│   │
│   ├── .env.example                  # Environment variables template
│   ├── .eslintrc.json                # ESLint configuration
│   ├── .prettierrc                   # Prettier configuration
│   ├── Dockerfile.dev                # Docker development configuration
│   ├── jest.config.js                # Jest testing configuration
│   ├── nodemon.json                  # Nodemon configuration
│   ├── package.json                  # Dependencies and scripts
│   └── tsconfig.json                 # TypeScript configuration
│
├── frontend/                         # React + TypeScript + Vite frontend
│   ├── public/                       # Static public assets
│   │
│   ├── src/
│   │   ├── assets/                   # Images, fonts, etc.
│   │   ├── components/               # Reusable React components
│   │   ├── features/                 # Feature-based modules
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API service layer
│   │   ├── store/                    # Redux store configuration
│   │   ├── styles/                   # Global styles
│   │   │   └── index.css             # Main CSS with Tailwind
│   │   ├── types/                    # TypeScript type definitions
│   │   ├── utils/                    # Utility functions
│   │   ├── App.tsx                   # Main App component
│   │   ├── main.tsx                  # Application entry point
│   │   └── vite-env.d.ts             # Vite environment types
│   │
│   ├── .env.example                  # Environment variables template
│   ├── .eslintrc.json                # ESLint configuration
│   ├── .prettierrc                   # Prettier configuration
│   ├── Dockerfile.dev                # Docker development configuration
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Dependencies and scripts
│   ├── postcss.config.js             # PostCSS configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tsconfig.node.json            # TypeScript Node configuration
│   └── vite.config.ts                # Vite configuration
│
├── docs/                             # Documentation
│   ├── api/                          # API documentation
│   ├── architecture/                 # Architecture diagrams
│   └── user-guides/                  # User guides
│
├── info/                             # Project planning documents
│   ├── execution-plan.md             # Sprint execution plan
│   ├── progress-log.md               # Development progress tracking
│   ├── requirements-checklist.md     # Client requirements checklist
│   └── technical-stack.md            # Technical stack reference
│
├── .env.example                      # Root environment variables
├── .gitignore                        # Git ignore rules
├── docker-compose.yml                # Docker Compose configuration
├── GETTING_STARTED.md                # Setup and installation guide
├── PROJECT_STRUCTURE.md              # This file
└── README.md                         # Project overview
```

## Key Files Explained

### Root Level

| File | Purpose |
|------|---------|
| `.gitignore` | Specifies files/folders to ignore in Git |
| `.env.example` | Template for environment variables |
| `docker-compose.yml` | Orchestrates PostgreSQL, backend, and frontend containers |
| `README.md` | Project overview and documentation |
| `GETTING_STARTED.md` | Setup instructions for developers |

### Backend Configuration

| File | Purpose |
|------|---------|
| `package.json` | Node.js dependencies and npm scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `.eslintrc.json` | Code linting rules |
| `.prettierrc` | Code formatting rules |
| `jest.config.js` | Testing framework configuration |
| `nodemon.json` | Development server configuration |
| `Dockerfile.dev` | Docker container for development |

### Frontend Configuration

| File | Purpose |
|------|---------|
| `package.json` | Node.js dependencies and npm scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `vite.config.ts` | Vite build tool configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration |
| `.eslintrc.json` | Code linting rules |
| `index.html` | HTML entry point |

### Database

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema definition with Prisma ORM |
| `prisma/seed.ts` | Script to populate database with initial data |

## Module Organization

### Backend Modules

```
src/
├── config/          # Configuration (database, env, constants)
├── controllers/     # HTTP request handlers
├── middlewares/     # Express middlewares (auth, validation, error handling)
├── models/          # Business domain models
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # TypeScript interfaces and types
└── utils/           # Helper functions
```

### Frontend Modules

```
src/
├── components/      # Reusable UI components
├── features/        # Feature modules (auth, compliance, risk, audit)
├── hooks/           # Custom React hooks
├── pages/           # Page-level components
├── services/        # API client and services
├── store/           # Redux store, slices, and actions
├── styles/          # Global CSS and theme
├── types/           # TypeScript interfaces and types
└── utils/           # Helper functions
```

## Database Schema Overview

The Prisma schema (`backend/prisma/schema.prisma`) includes:

### Core Entities

1. **Authentication & Authorization**
   - `User` - User accounts
   - `Role` - User roles (Admin, Compliance Manager, etc.)
   - `Permission` - Granular permissions
   - `UserRole` - User-role associations
   - `RolePermission` - Role-permission associations

2. **Multi-tenancy**
   - `Organization` - Tenant organizations
   - `OrganizationUser` - User-organization associations

3. **Compliance Management**
   - `Framework` - Compliance frameworks (ISO 27001, SOC 2, GDPR)
   - `Control` - Framework controls
   - `Policy` - Policy documents
   - `ComplianceRule` - Automated compliance rules
   - `ComplianceCheck` - Compliance check results

4. **Risk Management**
   - `Risk` - Risk register
   - `RiskCategory` - Risk categories
   - `MitigationPlan` - Risk mitigation plans
   - `RiskControl` - Risk-control linkage

5. **Audit Management**
   - `Audit` - Audit plans
   - `Evidence` - Audit evidence
   - `Finding` - Audit findings
   - `RemediationPlan` - Finding remediation

6. **AI Features**
   - `AIInsight` - AI-generated insights
   - `DocumentClassification` - Document classifications
   - `AnomalyDetection` - Detected anomalies

7. **Audit Trail**
   - `AuditLog` - Immutable activity logs

## Configuration Files

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/grc_dev
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
AZURE_STORAGE_CONNECTION_STRING=...
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_API_KEY=...
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=GRC Platform
VITE_ENABLE_AI_FEATURES=false
```

### Path Aliases

#### Backend (tsconfig.json)
```typescript
"@/*": ["src/*"]
"@controllers/*": ["src/controllers/*"]
"@services/*": ["src/services/*"]
"@middlewares/*": ["src/middlewares/*"]
// ... etc
```

#### Frontend (vite.config.ts)
```typescript
"@/*": ["src/*"]
"@components/*": ["src/components/*"]
"@pages/*": ["src/pages/*"]
"@features/*": ["src/features/*"]
// ... etc
```

## Development Workflow

### Starting Development

1. **Backend:**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Docker (All services):**
   ```bash
   docker-compose up
   ```

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Next Steps

1. Review [GETTING_STARTED.md](./GETTING_STARTED.md) for setup instructions
2. Review [info/execution-plan.md](./info/execution-plan.md) for development phases
3. Start implementing Sprint 1 features
4. Follow the progress in [info/progress-log.md](./info/progress-log.md)

## Architecture Principles

- **Modular Design:** Clear separation of concerns
- **Type Safety:** TypeScript throughout the stack
- **Multi-tenant Ready:** Tenant isolation at data layer
- **API-First:** RESTful API with clear boundaries
- **Security First:** RBAC, JWT auth, audit logging
- **Scalable:** Designed for Azure cloud deployment
- **Testable:** Comprehensive test coverage
- **Documented:** Inline documentation and external guides
