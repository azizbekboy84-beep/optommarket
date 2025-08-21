# Overview

This is a full-stack e-commerce marketplace application called Optombazar.uz, designed as a wholesale trading platform for Uzbekistan. The application provides a bilingual (Uzbek and Russian) interface for browsing categories, products, and facilitating wholesale transactions. It's built with a modern React frontend, Express.js backend, and uses PostgreSQL for data persistence through Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes (August 21, 2025)

## Migration to Replit Environment Completed
- ✓ Successfully migrated project from Replit Agent to Replit environment
- ✓ All packages installed and configured properly
- ✓ Workflow restarted and running smoothly on port 5000
- ✓ Fixed language localization issues (removed English text from UI)
- ✓ Updated contact information throughout the application:
  - Phone: +998996448444 (updated in header, footer, contact page)
  - Email: akramjon2504@gmail.com (updated in header, footer, contact page)
  - Address: Toshkent shahri, Uchtepa tumani, O'rikzor bozori
- ✓ Fixed language switcher display (changed "uz Uz" to "🇺🇿 O'z")
- ✓ Localized app store download buttons in footer

## Migration Status
- **Successfully completed migration to Replit**
- **Application running on port 5000 with full functionality**
- **All bilingual features (Uzbek/Russian) working correctly**
- **Ready for further development and enhancements**

## Previous Deployment Preparation
- ✓ Created comprehensive deployment configuration for Render.com
- ✓ Added health check endpoints (/health, /api/health) for monitoring
- ✓ Created production-ready Docker configuration
- ✓ Fixed seed data loading issues for production environment
- ✓ Generated deployment scripts (build.sh, deploy.sh, start.sh)
- ✓ Created bilingual deployment guide (English + Uzbek)
- ✓ Configured render.yaml for automatic deployment
- ✓ Added real data from actual Optombazar.uz website

# System Architecture

## Frontend Architecture
The client-side application is built with **React 18** using TypeScript and follows a component-based architecture. Key architectural decisions include:

- **State Management**: Uses TanStack Query (React Query) for server state management, providing automatic caching, background refetching, and optimistic updates
- **Routing**: Implements client-side routing with Wouter, a lightweight alternative to React Router
- **UI Framework**: Built on shadcn/ui components with Radix UI primitives, providing accessible and customizable components
- **Styling**: Uses Tailwind CSS with CSS variables for theming, supporting a consistent design system
- **Internationalization**: Custom language provider supporting Uzbek and Russian with localStorage persistence

## Backend Architecture
The server uses **Express.js** with TypeScript in ESM format:

- **API Design**: RESTful API endpoints organized under `/api` prefix with proper error handling and request logging
- **Storage Layer**: Abstract storage interface (IStorage) with in-memory implementation for development, designed to be easily replaceable with database implementations
- **Development Environment**: Vite integration for hot module replacement and development tooling

## Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations:

- **Schema Design**: Comprehensive schema supporting users, categories, products, orders, order items, blog posts, and chat messages with proper relationships
- **Multilingual Support**: Database schema includes separate fields for Uzbek and Russian content (nameUz, nameRu, etc.)
- **AI Chat Storage**: Chat messages are stored with session tracking for conversation history
- **Migration Management**: Uses Drizzle Kit for schema migrations with configuration pointing to `./migrations` directory

## Authentication and Authorization
While authentication infrastructure is defined in the schema, the current implementation uses a basic role-based system:

- **User Roles**: Supports customer, seller, and admin roles
- **Session Management**: Prepared for PostgreSQL session storage using connect-pg-simple
- **Security**: Framework in place for expanding authentication features

## Key Features
- **Multilingual Support**: Full Uzbek/Russian localization throughout the application
- **Product Management**: Comprehensive product catalog with categories, pricing tiers (retail/wholesale), and inventory tracking
- **Search Functionality**: Product search capabilities across multiple criteria
- **AI Chat Assistant**: Google Gemini-powered chat widget providing real-time customer support in Uzbek language
- **Push Notifications**: Web push notification system with VAPID keys for user engagement
- **SEO & Analytics**: Google Analytics 4 integration with comprehensive SEO monitoring dashboard
- **Admin Analytics**: Real-time analytics dashboard with SEO metrics, Google Analytics data, and Search Console integration
- **Marketing Tracking**: Google Tag Manager (GTM) integration with Facebook Pixel, UTM parameter tracking, and conversion monitoring
- **Digital Marketing**: Complete advertising campaign tracking for Google Ads, Facebook, and Instagram with ROAS monitoring
- **Responsive Design**: Mobile-first approach with responsive layouts

# External Dependencies

## AI Services
- **Google Gemini API**: Powers the AI chat assistant with natural language processing and contextual responses in Uzbek language

## Database Services
- **Neon Database**: Uses `@neondatabase/serverless` for PostgreSQL hosting, configured via DATABASE_URL environment variable
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect

## Development Tools
- **Vite**: Frontend build tool and development server with React plugin
- **ESBuild**: Backend bundling for production deployment
- **Replit Integration**: Development environment optimizations with runtime error handling and cartographer plugin

## UI and Styling
- **Radix UI**: Comprehensive collection of accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Pre-built component library built on Radix UI primitives
- **Lucide React**: Icon library for consistent iconography

## Utility Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation support via `@hookform/resolvers`
- **Zod**: Runtime type validation integrated with Drizzle for schema validation
- **date-fns**: Date manipulation and formatting utilities
- **clsx & class-variance-authority**: Conditional CSS class management

## Session and Storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod for validation

The architecture is designed for scalability and maintainability, with clear separation of concerns between frontend and backend, and a flexible storage layer that can accommodate future growth and feature additions.