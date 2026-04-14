# WriteSpace

A modern, distraction-free writing application built with Next.js and Tailwind CSS. WriteSpace provides a clean, minimal interface for focused writing with automatic local storage persistence.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Storage:** localStorage (browser-based, no backend required)
- **Language:** JavaScript (JSX)

## Features

- 📝 Distraction-free writing environment
- 💾 Automatic saving to localStorage — your work persists across sessions
- 🌗 Dark mode support
- 📱 Fully responsive design for desktop, tablet, and mobile
- ⚡ Fast, client-side rendering with no external database dependencies
- 📄 Create, edit, and delete documents
- 🔍 Search and filter through saved writings
- 📊 Word and character count tracking

## Folder Structure

```
writespace/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   │   ├── layout.js        # Root layout
│   │   ├── page.js          # Home page
│   │   └── editor/
│   │       └── [id]/
│   │           └── page.js  # Editor page
│   ├── components/          # Reusable UI components
│   │   ├── Editor.js        # Main writing editor component
│   │   ├── Sidebar.js       # Document list sidebar
│   │   ├── DocumentCard.js  # Document preview card
│   │   ├── Header.js        # App header/navigation
│   │   └── ThemeToggle.js   # Dark/light mode toggle
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocalStorage.js   # localStorage read/write hook
│   │   └── useDocuments.js      # Document CRUD operations hook
│   └── utils/               # Utility functions
│       ├── storage.js        # localStorage helper functions
│       └── helpers.js        # General utility functions
├── .gitignore
├── jsconfig.json
├── next.config.js           # Next.js configuration
├── package.json
├── postcss.config.js        # PostCSS configuration for Tailwind
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd writespace
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Linting

```bash
npm run lint
```

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Vercel will automatically detect the Next.js framework and configure the build settings.
4. Click **Deploy**.

No environment variables are required — all data is stored in the user's browser via localStorage.

### Notes

- Since WriteSpace uses localStorage for persistence, each user's data is stored locally in their browser. Data does not sync across devices or browsers.
- No server-side database or API keys are needed.
- The application is fully static-compatible and can also be exported as a static site using `next export` if needed.

## License

Private — All rights reserved.