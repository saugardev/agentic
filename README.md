Here's a README.md for your project:

```markdown:README.md
# Game Project

## Prerequisites
- Docker and Docker Compose
- Node.js 18+ 
- npm/yarn/pnpm

## Setup

1. Start the database:
```bash
docker-compose up -d
```

2. Install dependencies:
```bash
cd ui
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

Add these variables to your `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/game_db
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
```

4. Run database migrations:
```bash
npm run db:generate
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000)

## Database Management

- Generate migrations: `npm run db:generate`
- Apply migrations: `npm run db:migrate`

## Docker Commands

- Start database: `docker-compose up -d`
- Stop database: `docker-compose down`
- View logs: `docker-compose logs -f`
- Reset data: `docker-compose down -v && docker-compose up -d`
```
