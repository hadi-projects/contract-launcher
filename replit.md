# SmartContract Studio

## Overview

SmartContract Studio is a full-stack web application for smart contract development, deployment, and interaction. It provides a comprehensive IDE-like experience for blockchain developers, featuring contract templates, deployment tools, interaction interfaces, and transaction monitoring capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 12, 2025
- ✅ Implemented comprehensive advanced features suite including security scanner, multi-chain deployer, testing framework, advanced code editor, and analytics dashboard
- ✅ Added state management to integrate all components (code editor feeds into security scanner and testing suite)
- ✅ Enhanced UI with dark/light mode support across all new components
- ✅ Added sample data and interactive charts for analytics visualization
- ✅ User confirmed satisfaction with complete platform functionality

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with React plugin
- **UI Components**: Comprehensive component library based on Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **API Pattern**: RESTful API with Express routes
- **Session Management**: PostgreSQL-based sessions using connect-pg-simple

### Monorepo Structure
- `client/` - Frontend React application
- `server/` - Backend Express.js API
- `shared/` - Shared TypeScript types and database schema
- Root level configuration files for build tools and development

## Advanced Features

### Security & Testing
- **Automated Security Scanning**: Real-time vulnerability detection for common smart contract issues
- **Multi-Network Testing**: Support for testing across different blockchain networks
- **Gas Optimization**: Analysis and suggestions for reducing gas consumption
- **Code Quality Checks**: Linting and best practice enforcement

### Development Tools
- **Syntax Highlighting**: Full Solidity language support with error detection
- **Auto-completion**: Smart code completion with OpenZeppelin library integration
- **Real-time Compilation**: Instant feedback on code changes with error highlighting
- **Template System**: Pre-built contract templates for common use cases

### Analytics & Monitoring
- **Deployment Analytics**: Track success rates, gas usage, and network distribution
- **Performance Metrics**: Monitor contract interaction patterns and optimization opportunities
- **Cost Analysis**: Detailed breakdown of deployment and interaction costs across networks
- **Activity Tracking**: Real-time monitoring of user actions and system performance

## Key Components

### Database Schema (shared/schema.ts)
- **Contracts Table**: Stores deployed contract information including ABI, bytecode, source code, and deployment details
- **Transactions Table**: Tracks all blockchain transactions with gas usage, status, and metadata
- **Contract Templates Table**: Pre-built contract templates with categories and difficulty levels

### Frontend Components
- **ContractDeploy**: Interface for compiling and deploying smart contracts
- **ContractInteract**: Tool for calling contract functions and viewing results
- **TransactionHistory**: Display of user's transaction history with filtering
- **ContractTemplates**: Gallery of pre-built contract templates
- **WalletConnection**: Web3 wallet integration with network switching
- **ContractSecurityScanner**: Automated security vulnerability analysis with recommendations
- **MultiChainDeployer**: Deploy contracts across multiple blockchain networks simultaneously
- **ContractTestingSuite**: Comprehensive testing framework with auto-generated test cases
- **AdvancedCodeEditor**: Full-featured Solidity editor with syntax highlighting and real-time analysis
- **AnalyticsDashboard**: Contract deployment and interaction analytics with visualizations

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Route Handlers**: RESTful endpoints for contracts, transactions, and templates
- **Web3 Integration**: Utilities for contract compilation and blockchain interaction

### Web3 Integration
- **Wallet Connection**: MetaMask and other Web3 wallet support
- **Multi-Network**: Support for Ethereum mainnet, testnets, and other EVM chains
- **Contract Compilation**: Client-side Solidity compilation capabilities
- **Transaction Monitoring**: Real-time transaction status tracking

## Data Flow

### Contract Deployment Flow
1. User selects template or writes custom contract
2. Frontend compiles Solidity code using Web3 utilities
3. User configures deployment parameters (gas, constructor args)
4. Transaction submitted to blockchain via Web3 provider
5. Contract and transaction details stored in database
6. Real-time status updates displayed to user

### Contract Interaction Flow
1. User enters contract address or selects from deployed contracts
2. Contract ABI loaded from database or user input
3. Available functions displayed with input forms
4. Function calls submitted to blockchain
5. Results displayed and transaction recorded

### Data Persistence
- All contract deployments, transactions, and user interactions stored in PostgreSQL
- Session-based user state management
- Template library pre-populated with common contract patterns

## External Dependencies

### Blockchain Infrastructure
- **Neon Database**: Serverless PostgreSQL for production deployment
- **Web3 Providers**: MetaMask, WalletConnect for blockchain interaction
- **Ethereum Networks**: Support for multiple EVM-compatible chains

### UI/UX Libraries
- **Radix UI**: Accessible, unstyled component primitives
- **Lucide React**: Icon library
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Utility for component variant management

### Development Tools
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Fast JavaScript bundling for production
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend development
- TSX for running TypeScript server code
- In-memory storage for rapid prototyping
- Replit-specific optimizations for cloud development

### Production Build
- Vite builds optimized frontend bundle to `dist/public`
- ESBuild bundles server code to `dist/index.js`
- Single Node.js process serves both static files and API
- PostgreSQL database connection via environment variables

### Environment Configuration
- Development: File-based routing and in-memory storage
- Production: Database-backed persistence with proper session management
- Database migrations handled via Drizzle Kit
- Environment-specific configuration through process.env

### Key Design Decisions

**Database Choice**: PostgreSQL with Drizzle ORM chosen for ACID compliance and complex query support needed for blockchain data relationships.

**Frontend Framework**: React with TypeScript provides type safety and rich ecosystem. Vite chosen for fast development experience.

**Component Library**: shadcn/ui provides consistent, accessible components while allowing customization through Tailwind CSS.

**State Management**: React Query handles server state caching and synchronization, reducing complexity compared to Redux-style solutions.

**Monorepo Structure**: Shared types between client and server ensure type safety across the full stack while maintaining clear separation of concerns.


