# Getting Started with GRC MVP

This guide will help you set up and run the GRC Platform MVP on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20 LTS or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 15 or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Docker** (optional, for containerized development) ([Download](https://www.docker.com/))

## Project Structure

```
grc-mvp/
├── backend/                 # Node.js + Express backend
│   ├── src/                # Source code
│   ├── prisma/             # Database schema & migrations
│   └── tests/              # Test files
├── frontend/               # React frontend
│   ├── src/                # Source code
│   └── public/             # Static assets
├── docs/                   # Documentation
├── info/                   # Project planning documents
└── docker-compose.yml      # Docker orchestration
```

## Setup Instructions

### Option 1: Local Development (Recommended for development)

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd grc-mvp
```

#### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your database credentials
# Edit DATABASE_URL to match your PostgreSQL setup
```

#### 3. Set Up Database

```bash
# Create PostgreSQL database
createdb grc_dev

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed the database with initial data
npm run prisma:seed
```

**Default admin credentials:**
- Email: `admin@demo.grc.local`
- Password: `Admin@123`

#### 4. Set Up Frontend

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env if needed (defaults should work)
```

#### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

### Option 2: Docker Development

```bash
# From project root
docker-compose up
```

This will start:
- PostgreSQL on port 5432
- Backend on port 3000
- Frontend on port 5173

## Verify Installation

1. **Check Backend:** Visit http://localhost:3000/health
   - Should return: `{"status":"ok","timestamp":"...","environment":"development"}`

2. **Check Frontend:** Visit http://localhost:5173
   - Should display: "GRC Platform" welcome page

3. **Check Database:**
   ```bash
   cd backend
   npx prisma studio
   ```
   - Opens Prisma Studio on http://localhost:5555

## Development Workflow

### Backend Development

```bash
cd backend

# Start dev server with hot reload
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format

# Open Prisma Studio (DB GUI)
npx prisma studio
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

### Database Management

```bash
cd backend

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database
npm run prisma:seed

# Open Prisma Studio
npx prisma studio
```

## Project Scripts

### Backend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run all tests with coverage |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run prisma:seed` | Seed database |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run lint` | Lint code |
| `npm run type-check` | TypeScript type checking |
| `npm run format` | Format code with Prettier |

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/grc_dev
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=GRC Platform
VITE_ENABLE_AI_FEATURES=false
```

## Database Schema

The database schema includes the following main entities:

- **Users & Auth:** users, roles, permissions, user_roles, role_permissions
- **Organizations:** organizations, organization_users
- **Compliance:** frameworks, controls, policies, compliance_checks, compliance_rules
- **Risk Management:** risks, risk_categories, mitigation_plans, risk_controls
- **Audit:** audits, evidence, findings, remediation_plans
- **AI Features:** ai_insights, document_classifications, anomaly_detections
- **Audit Trail:** audit_logs

## Next Steps

1. **Familiarize yourself with the codebase:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`
   - Database: `backend/prisma/schema.prisma`

2. **Review the documentation:**
   - [Execution Plan](./info/execution-plan.md)
   - [Technical Stack](./info/technical-stack.md)
   - [Requirements Checklist](./info/requirements-checklist.md)

3. **Start development:**
   - Follow the Sprint 1 tasks in the execution plan
   - Refer to the progress log for tracking

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Check PostgreSQL version
psql --version

# Connect to database
psql -d grc_dev
```

### Port Already in Use

```bash
# Find process using port 3000 (backend)
lsof -i :3000

# Find process using port 5173 (frontend)
lsof -i :5173

# Kill process
kill -9 <PID>
```

### Prisma Issues

```bash
# Reset Prisma client
rm -rf node_modules/.prisma
npx prisma generate

# Reset database
npx prisma migrate reset
```

## Support

For issues or questions:
- Review the documentation in `info/` directory
- Check the project README
- Contact the development team

## License

Proprietary - All rights reserved
