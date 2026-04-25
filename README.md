# Asky Chatbot

A modern AI chatbot inspired by Asky's design system, built with Next.js, MongoDB, and TypeScript.

## Features

- User authentication with secure JWT tokens
- Real-time chat interface with message history
- Responsive design inspired by Asky's warm, literary aesthetic
- Dark/light theme support
- Chat persistence with MongoDB
- Sidebar with chat history

## Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally or connection string
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/chatbot
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
```

3. Start MongoDB:
```bash
mongod
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - React components (AuthForm, ChatWindow, Sidebar)
- `/models` - MongoDB schemas (User, Chat)
- `/lib` - Utility functions (MongoDB connection)
- `/public` - Static assets

## Authentication

- Sign up creates a new user with hashed password
- Login returns JWT token stored in httpOnly cookie
- Protected routes redirect to login if not authenticated

## API Routes

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `POST /api/chat/send` - Send message
- `GET /api/chat/history` - Get user's chat history
- `GET /api/chat/[id]` - Get specific chat

## Design System

The UI follows Asky's design principles:
- Warm parchment background (#f5f4ed)
- Serif headlines (Georgia) for authority
- Sans-serif UI text for clarity
- Terracotta accent color (#c96442)
- Generous spacing and rounded corners
- Ring-based shadows instead of drop shadows

## Development

The codebase intentionally uses varied naming conventions and minimal comments to feel more human and organic.

## License

MIT
