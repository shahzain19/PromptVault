# PromptVault

> Your Prompt System for Clarity. Designed for creators who think faster than they can type.

PromptVault is a modern web application that helps you organize, manage, and access your AI prompts with ease. Built with React, TypeScript, and Supabase, it provides a clean, fast, and intuitive interface for prompt management.

![PromptVault Preview](public/AppPreview.png)

## ✨ Features

- **🎯 Clarity First** - A distraction-free interface built for focus
- **⚡ Fast by Design** - Instant search and real-time updates
- **🏷️ Smart Organization** - Tag, search, and filter your prompts effortlessly
- **🔐 Secure Authentication** - User accounts with email verification
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🔄 Real-time Sync** - Your prompts are always up-to-date across devices

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4.x
- **Backend**: Supabase (Database + Authentication)
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite with Rolldown

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── PromptCard.tsx
├── features/           # Feature-based modules
│   ├── auth/          # Authentication logic
│   │   ├── useAuth.ts
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── ProtectedRoute.tsx
│   └── prompts/       # Prompt management
│       ├── PromptContext.tsx
│       ├── PromptList.tsx
│       ├── AddPromptModal.tsx
│       └── EditPromptModal.tsx
├── lib/               # Utilities and configurations
│   ├── supabaseClient.ts
│   ├── errors.ts
│   └── validation.ts
├── pages/             # Page components
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── routes/            # Routing configuration
│   └── AppRoutes.tsx
└── styles/            # Global styles
    ├── App.css
    └── index.css
```

## 🎨 Key Components

### Authentication System
- **Secure user registration and login** with email verification
- **Protected routes** for authenticated users
- **Session management** with automatic token refresh

### Prompt Management
- **CRUD operations** for prompts (Create, Read, Update, Delete)
- **Real-time search** and filtering
- **Input validation** and sanitization
- **Error handling** with user-friendly messages

### UI/UX Design
- **M
