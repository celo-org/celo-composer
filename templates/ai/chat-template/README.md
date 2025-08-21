# Celo AI Agent

An intelligent AI assistant for interacting with the Celo blockchain ecosystem. This application provides a conversational interface to help users navigate Celo blockchain operations, smart contracts, and DeFi protocols through natural language interactions.

## Features

- **Multi-Model AI Support**: Integrates with multiple AI providers (OpenAI, Anthropic, Google, Mistral, DeepSeek, xAI)
- **Wallet Integration**: Connect and manage Celo wallet addresses
- **Interactive Chat Interface**: Real-time conversations with AI models
- **Artifact Generation**: Create and edit code, documents, and data visualizations
- **User Authentication**: Secure login and guest access
- **Chat History**: Persistent conversation storage and retrieval
- **File Upload Support**: Process and analyze uploaded documents

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with your API keys:

   ```env
   # AI Provider API Keys (at least one required)
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_key

   # Database
   POSTGRES_URL=your_postgres_connection_string

   # Authentication
   AUTH_SECRET=your_auth_secret
   ```

3. **Run database migrations:**

   ```bash
   pnpm db:migrate
   ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Project Structure

```
apps/web/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   └── (chat)/            # Chat interface and API routes
├── components/            # React components
├── lib/                   # Utilities and configurations
│   ├── ai/               # AI model providers and configurations
│   └── db/               # Database schemas and queries
└── artifacts/            # AI-generated artifact handlers
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm lint` - Run linting
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open database studio
- `pnpm test` - Run tests

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Authentication**: NextAuth.js
- **AI Integration**: Multiple provider support
- **Blockchain**: Celo integration via Thirdweb and Viem

## Configuration

The application supports multiple AI providers. Configure your preferred providers by setting the corresponding environment variables. The system will automatically detect available providers and enable them in the interface.

## Learn More

- [Celo Documentation](https://docs.celo.org/)
- [Celo Developer Resources](https://developers.celo.org/)
