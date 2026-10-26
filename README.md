# NEARSTAY: Smart PG/Hostel Finder and Booking System for Students

NearStay is a production-minded Master's minor project for student accommodation discovery, booking requests, owner listing management, and admin moderation.

## Workspace

- `frontend`: Next.js, TypeScript, Tailwind CSS, React Query, Redux Toolkit, TanStack Table.
- `backend`: Node.js, Express, TypeScript, Prisma, MySQL, Zod, JWT-ready modular architecture.

## Initial Setup

```bash
npm install
cp backend/.env.example backend/.env
npm run prisma:generate -w backend
npm run dev:backend
npm run dev:frontend
```

Create the first migration after setting `DATABASE_URL`:

```bash
npm run prisma:migrate -w backend -- --name init
```
