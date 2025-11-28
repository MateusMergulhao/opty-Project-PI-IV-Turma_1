# Opty - Front-end

## Prerequisites

Before you begin, make sure you have installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- Access to the backend (Java API and WebSocket)

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:eduardokairalla1/opty-frontend.git
cd opty-frontend
```

### 2. Install dependencies

```bash
npm install
```

or

```bash
yarn install
```

or

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file at the project root based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file with your settings


**Available environment variables:**

- `APP_PORT`: Port where the development server will run
- `VITE_WS_URL`: WebSocket server URL for real-time communication
- `VITE_JAVA_API_URL`: Java REST API URL

## How to Run

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5000` (or the port configured in `APP_PORT`)

### Production Build

```bash
npm run build
```

The build will be generated in the `dist/` folder

### Development Build

```bash
npm run build:dev
```

Creates a build with development settings

### Preview Build

```bash
npm run preview
```

Preview the production build locally

### Linting

```bash
npm run lint
```

Run ESLint to check code quality

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # UI components (shadcn/ui)
│   ├── ChatMessage.tsx
│   ├── DashboardNav.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── ProgressBar.tsx
├── hooks/              # Custom React Hooks
│   ├── useClientChat.ts
│   ├── useSupervisorChat.ts
│   ├── useSupervisorQueue.ts
│   ├── useWebSocket.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utilities and configurations
│   └── utils.ts
├── pages/              # Application pages
│   ├── Index.tsx       # Home page
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Onboarding.tsx  # Onboarding process
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Resultados.tsx  # Results page
│   ├── Perfil.tsx      # User profile
│   ├── ChatCliente.tsx # Client chat
│   ├── ChatSupervisor.tsx # Supervisor chat
│   └── NotFound.tsx    # 404 page
├── App.tsx             # Main component
└── main.tsx            # Entry point
```

## Available Routes

- `/` - Home page
- `/login` - User authentication
- `/register` - New user registration
- `/onboarding` - Onboarding process
- `/dashboard` - Main dashboard
- `/resultados` - Results visualization
- `/perfil` - User profile
- `/chat/cliente` - Client chat
- `/chat/supervisor/:sessionId?` - Supervisor chat (with optional session ID)
