# GRC Platform MVP

A comprehensive SaaS-ready Governance, Risk, and Compliance (GRC) platform with AI-powered insights.

## Project Overview

**Timeline:** 4 weeks (6 sprints)
**Architecture:** Multi-tenant aware, single-tenant MVP
**Cloud Provider:** Microsoft Azure

## Tech Stack

### Backend
- Node.js 20 LTS
- Express.js 4.x
- TypeScript 5.x
- PostgreSQL 15+ (Azure Database)
- Prisma ORM
- JWT Authentication

### Frontend
- React 18+
- TypeScript 5.x
- Vite 5.x
- Material-UI (MUI) 5.x
- Tailwind CSS 3.x
- Redux Toolkit

### Infrastructure
- Azure App Service
- Azure Database for PostgreSQL
- Azure Blob Storage
- Azure OpenAI
- Azure Monitor

## Project Structure

```
grc-mvp/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   └── types/          # TypeScript types
│   ├── prisma/             # Database schema & migrations
│   ├── tests/              # Unit, integration, E2E tests
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Feature modules
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   ├── assets/         # Static assets
│   │   └── styles/         # Global styles
│   ├── public/             # Public assets
│   └── package.json
├── docs/                   # Documentation
│   ├── architecture/       # Architecture diagrams
│   ├── api/               # API documentation
│   └── user-guides/       # User guides
├── info/                   # Project planning documents
└── docker-compose.yml      # Local development setup
```

## Getting Started

### Prerequisites
- Node.js 20 LTS
- PostgreSQL 15+
- Azure account (for production)
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd grc-mvp
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
```bash
# Backend
cp backend/.env.example backend/.env
# Frontend
cp frontend/.env.example frontend/.env
```

5. Set up database
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

6. Start development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

## Phases

### Phase 1: Foundation (Sprint 1)
- Authentication & RBAC
- Database schema
- Framework structure
- Basic UI shell

### Phase 2: Core GRC Modules (Sprints 2-4)
- Compliance monitoring
- Risk management
- Audit management

### Phase 3: AI & Deployment (Sprints 5-6)
- AI-assisted insights
- Production deployment
- Documentation

## Documentation

- [Execution Plan](./info/execution-plan.md)
- [Technical Stack](./info/technical-stack.md)
- [Requirements Checklist](./info/requirements-checklist.md)
- [Progress Log](./info/progress-log.md)

## Contributing

This is a proprietary project. Please follow the established coding standards and commit conventions.

## License

Proprietary - All rights reserved
