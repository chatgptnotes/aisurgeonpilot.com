# AI Surgeon Pilot

> Your AI-Powered Digital Office – Empowering Surgeons with Intelligent Automation

Transform your surgical practice with AI agents that handle patient communication, create educational content, automate WhatsApp messaging, and manage appointments – so you can focus on what matters most: your patients' care.

## Features

- **AI Voice Agents**: Intelligent voice assistants that handle patient calls, answer questions, and provide pre/post-op instructions 24/7
- **WhatsApp Automation**: Automated WhatsApp messaging for appointment reminders, follow-ups, and personalized patient communication
- **Patient Education Videos**: AI-generated personalized educational videos for patients about procedures, recovery, and post-operative care
- **Smart Scheduling**: AI-powered appointment scheduling that optimizes your calendar and reduces no-shows automatically

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn-ui components
- **Icons**: Google Material Icons (no emojis)
- **Backend**: Supabase
- **AI Integration**: OpenAI API
- **Messaging**: DoubleTick WhatsApp API
- **Runtime**: Node.js 18+

## Quickstart

### Prerequisites

- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Git installed

### Installation

```bash
# Clone the repository
git clone https://github.com/chatgptnotes/aisurgeonpilot.com.git

# Navigate to the project directory
cd aisurgeonpilot.com

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration for AI features
VITE_OPENAI_API_KEY=your_openai_api_key_here

# DoubleTick WhatsApp API Configuration
VITE_DOUBLETICK_API_KEY=key_8sc9MP6JpQ
VITE_DOUBLETICK_TEMPLATE_NAME=emergency_location_alert
# Template Variables: {victim_location}, {nearby_hospital}, {Phone_number}
```

See `.env.example` for detailed configuration options.

## Available Commands

```bash
# Development
npm run dev          # Start development server with hot reload

# Build
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm run typecheck    # Run TypeScript type checking

# Testing
npm test             # Run tests (if configured)
```

## Project Structure

```
aisurgeonpilot.com/
├── .claude/              # Claude Code configuration
│   ├── commands/         # Custom slash commands
│   └── settings.local.json
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── lib/             # Utility functions
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── .env.example         # Environment variables template
├── CLAUDE.md           # Autonomy prompt for Claude Code
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## Development Workflow

### Auto-Confirm Mode

This project uses Claude Code with auto-confirm mode enabled. To toggle:

```bash
/auto-confirm on     # Enable auto-confirmation
/auto-confirm off    # Disable auto-confirmation
/auto-confirm status # Check current status
```

Auto-confirm settings are stored in `.claude/settings.local.json`.

### Versioning

The application uses semantic versioning (1.0, 1.1, 1.2, etc.) displayed in the footer. The version increments automatically with each Git push.

Current version is displayed at the bottom of the landing page as:
```
Version X.Y | Last Updated: YYYY-MM-DD
```

## Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

### Option 3: Manual Deployment

```bash
# Build the project
npm run build

# The dist/ folder contains the production build
# Upload the contents to your web server
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## FAQ

### How do I add a new AI agent feature?

1. Create the agent component in `src/components/agents/`
2. Integrate with OpenAI API using the existing patterns
3. Add configuration in `.env` if needed
4. Update the landing page to showcase the new feature

### How do I customize WhatsApp templates?

Edit the template configuration in your DoubleTick dashboard and update the `VITE_DOUBLETICK_TEMPLATE_NAME` environment variable.

### How do I run the project without Claude Code?

Simply use the standard npm commands:
```bash
npm install
npm run dev
```

### What's the difference between development and production builds?

- Development (`npm run dev`): Hot module replacement, source maps, debugging tools
- Production (`npm run build`): Minified, optimized, tree-shaken code

### How do I update dependencies?

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest
```

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team or open an issue in the GitHub repository.

---

**Version 1.0** | Built with AI Surgeon Pilot
