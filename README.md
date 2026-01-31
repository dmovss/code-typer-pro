# 🎯 CodeTyper Pro

A high-fidelity, production-ready code typing practice application built with React, TypeScript, and modern web technologies. Features a stunning macOS-style glassmorphism interface that looks like a professional developer tool.

![CodeTyper Pro](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

## ✨ Features

- 🎨 **macOS-Style Interface**: Authentic window controls, glassmorphism effects, and rounded corners
- ⚡ **Smart Typing**: Auto-skips indentation so you focus on actual code logic
- 🎯 **Real-time Feedback**: Correct characters turn emerald, errors flash red
- 📊 **Live Metrics**: WPM and accuracy percentage tracked in real-time
- 🗂️ **File Explorer**: Switch between multiple React/TypeScript code snippets
- 🏆 **Completion Modal**: Beautiful celebration screen with performance stats
- 💾 **State Management**: Powered by Zustand for optimal performance
- 🎬 **Smooth Animations**: Framer Motion for buttery transitions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Clone or download** this project:
```bash
cd code-typer-pro
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start development server**:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser** to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The production-ready files will be in the `dist/` folder.

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and deploy!

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## 🎮 How to Use

1. **Select a file** from the Explorer sidebar
2. **Start typing** - the timer begins on your first keystroke
3. **Focus on code** - indentation is auto-handled
4. **Track progress** - watch your WPM and accuracy in real-time
5. **Complete the challenge** - get your performance stats!

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
code-typer-pro/
├── src/
│   ├── components/          # React components
│   │   ├── WindowControls.tsx
│   │   ├── FileExplorer.tsx
│   │   ├── CodeEditor.tsx
│   │   ├── StatusBar.tsx
│   │   └── CompletionModal.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useTypingStore.ts
│   │   └── useKeyboardHandler.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── data/               # Code snippets
│   │   └── snippets.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind config
├── vite.config.ts          # Vite config
└── README.md              # You are here!
```

## 🎨 Customization

### Add New Code Snippets

Edit `src/data/snippets.ts`:

```typescript
{
  id: '6',
  filename: 'yourFile.tsx',
  language: 'typescript',
  difficulty: 'medium',
  code: `your code here...`
}
```

### Modify Theme Colors

Edit `src/index.css` and Tailwind classes throughout components.

## 📝 License

MIT License - feel free to use this project for learning and personal projects!

## 🙌 Credits

Built with ❤️ as a pet project to help developers improve their code typing speed.

---

**Happy Typing! 🚀**
