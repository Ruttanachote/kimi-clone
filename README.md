# 🌙 Kimi AI Clone - v1.0 Complete

Full-featured AI chat application built with Next.js 14

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## ✨ Features

### Core Chat
- Real-time streaming responses
- Virtual scrolling (10,000+ messages)
- Smart auto-scroll (pauses when user scrolls up)
- Message grouping (Today/Yesterday/Date)
- Typing indicators

### Tools
- Web Builder
- Document Creator
- Presentation Maker
- Spreadsheet Generator
- Deep Research
- Agent Swarm (Beta)
- Code Interpreter
- Kimi+ Features

### Interaction
- Slash commands (/image, /code, /search, /doc)
- Right-click context menu
- Quote & Branch messages
- File upload (drag & drop, clipboard paste)
- Voice input

### Organization
- Folder system with colors
- Tags
- Star/Archive chats
- Global search
- Chat history with date grouping

### UI/UX
- Dark/Light/System theme
- Responsive design (Mobile/Desktop)
- Context window indicator
- Keyboard shortcuts (Ctrl+B for sidebar)
- Smooth animations

## 🛠 Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Virtuoso (Virtual List)
- Radix UI (Primitives)
- React Markdown
- Framer Motion

## 📝 Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations

## 🔧 Environment Variables

Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kimi_clone"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📄 License

MIT
