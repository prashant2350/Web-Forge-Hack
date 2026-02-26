# Web-Forge-Hack

A modern, high-performance web development project built with React and Vite. Web-Forge-Hack is designed to provide a robust foundation for rapid web application development with hot module replacement (HMR) and optimized build processes.

## Features

- ⚡ **Lightning-fast development** with Vite's native ES modules support
- 🔄 **Hot Module Replace (HMR)** for instant feedback during development
- ⚛️ **React 19.2** with modern hooks and features
- 📦 **Optimized production builds** with automatic code splitting
- 🧹 **ESLint integration** for code quality and consistency
- 🎨 **Modular component architecture** for scalable development
- 🚀 **Zero-config setup** with sensible defaults

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd Web-Forge-Hack
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server with HMR:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the project for production:
```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Technologies

- **React 19.2** - UI library
- **Vite 7.3** - Build tool and development server
- **Babel/SWC** - JavaScript compiler
- **ESLint** - Code linting and quality

## Project Structure

```
Web-Forge-Hack/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── index.css        # Global styles
│   ├── main.jsx         # Application entry point
│   └── assets/          # Static assets
├── public/              # Public assets
├── index.html           # HTML template
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
└── eslint.config.js     # ESLint configuration
```

## Contributing

Contributions are welcome! Please ensure your code passes ESLint checks and follows project conventions.

## License

This project is provided as-is for hackathon and educational purposes.
