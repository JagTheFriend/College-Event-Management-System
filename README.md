# College Event Management System

A full-stack web application for managing and registering for college events. Built with Next.js, Prisma, and MongoDB.

## Features

- **User Authentication** — JWT-based signup/login with bcrypt password hashing
- **Event Management** — Create, edit, and delete events (organizer-only)
- **Event Registration** — Students can register for and cancel event registrations
- **Attendance Tracking** — Mark and track event attendance
- **QR Code Generation** — Auto-generate QR codes for events
- **Category Filters & Search** — Browse events by category or search by title
- **User Dashboard** — View registrations, attendance history, and created events
- **Loading States** — Skeleton loaders and spinners throughout
- **Error Handling** — Form validation, API error responses, and user-friendly error messages

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4           |
| Backend  | Next.js API Routes (Route Handlers)            |
| Database | MongoDB via Prisma ORM 6                       |
| Auth     | JWT (jsonwebtoken), bcryptjs                   |
| Assets   | QR Code generation (qrcode)                    |

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB running locally on `mongodb://localhost:27017`

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd college-event-management-system

# 2. Install dependencies
npm install

# 3. Set up environment variables (already configured for local dev)
cp .env.example .env   # or edit .env directly

# 4. Generate Prisma client
npx prisma generate

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable       | Description                          | Default                                                |
| -------------- | ------------------------------------ | ------------------------------------------------------ |
| `DATABASE_URL` | MongoDB connection string            | `mongodb://localhost:27017/college-event-management`   |
| `JWT_SECRET`   | Secret key for signing JWT tokens    | *(auto-generated on first setup)*                      |

## Project Structure

```
app/
├── (auth)/              # Auth layout group
│   ├── login/page.tsx
│   └── signup/page.tsx
├── api/
│   ├── auth/            # Signup, login, me endpoints
│   ├── events/          # CRUD + register, attendance, QR
│   ├── registrations/   # User registration list
│   └── attendance/      # Attendance records
├── dashboard/page.tsx   # User dashboard
├── events/
│   ├── page.tsx         # Events listing
│   ├── create/page.tsx  # Create event form
│   └── [id]/
│       ├── page.tsx     # Event details
│       └── edit/page.tsx
├── layout.tsx           # Root layout with Navbar
├── page.tsx             # Home page (event listing)
└── globals.css          # Theme & glassmorphism styles
components/
├── EventCard.tsx        # Event card component
├── Navbar.tsx           # Navigation bar
├── Skeleton.tsx         # Loading skeleton components
└── Spinner.tsx          # Loading spinner
lib/
├── auth.ts              # JWT, bcrypt, auth helpers
├── prisma.ts            # Prisma client singleton
└── types.ts             # TypeScript interfaces
prisma/
└── schema.prisma        # Database schema (User, Event, Registration, Attendance)
```

## API Endpoints

| Method   | Endpoint                         | Auth Required | Description              |
| -------- | -------------------------------- | ------------- | ------------------------ |
| `POST`   | `/api/auth/signup`               | No            | Create account           |
| `POST`   | `/api/auth/login`                | No            | Sign in                  |
| `GET`    | `/api/auth/me`                   | Yes           | Get current user         |
| `GET`    | `/api/events`                    | No            | List events (with filters) |
| `POST`   | `/api/events`                    | Yes           | Create event (organizer) |
| `GET`    | `/api/events/[id]`              | No            | Get event details        |
| `PUT`    | `/api/events/[id]`              | Yes           | Update event (owner)     |
| `DELETE` | `/api/events/[id]`              | Yes           | Delete event (owner)     |
| `POST`   | `/api/events/[id]/register`     | Yes           | Register for event       |
| `DELETE` | `/api/events/[id]/register`     | Yes           | Cancel registration      |
| `GET`    | `/api/events/[id]/qr`           | No            | Get event QR code        |
| `POST`   | `/api/events/[id]/attendance`   | Yes           | Mark attendance          |
| `GET`    | `/api/events/[id]/attendance`   | Yes           | Get attendance status    |
| `GET`    | `/api/registrations`            | Yes           | List user registrations  |
| `GET`    | `/api/attendance`               | Yes           | List user attendance     |

## Theme

Colors and styles follow a consistent design system:

- **Primary**: Indigo `#4F46E5`
- **Secondary**: Purple `#7C3AED`
- **Accent**: Cyan `#06B6D4`
- **Background**: `#F8FAFC`
- **Cards**: `#FFFFFF` with glassmorphism
- **Success** / **Warning** / **Error**: `#22C55E` / `#F59E0B` / `#EF4444`
- UI: Glassmorphism cards, 12–16px rounded corners, soft shadows, gradient buttons
