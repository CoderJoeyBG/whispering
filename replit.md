# Whispering Walls - Replit Project Guide

## Overview

Whispering Walls is an anonymous social platform designed for sharing short whispers, secrets, confessions, or thoughts in a safe and supportive environment. The application enables users to post anonymous messages (whispers) of up to 200 characters, browse and interact with community content through voting and replies, and connect through shared human experiences without revealing personal identity.

The platform emphasizes anonymity, empathy, and community support while providing robust moderation tools and content management features for administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack TypeScript Architecture
The application uses a modern full-stack TypeScript architecture with shared code between client and server:
- **Frontend**: React 18 with Vite for fast development and building
- **Backend**: Express.js with TypeScript for API endpoints
- **Shared**: Common schemas and types using Zod validation
- **Build System**: ESBuild for server bundling, Vite for client bundling

### Frontend Architecture
- **React SPA**: Single-page application using Wouter for lightweight routing
- **State Management**: TanStack Query for server state and caching
- **UI Framework**: Tailwind CSS with Radix UI components via shadcn/ui
- **Component Structure**: Modular component architecture with reusable UI primitives
- **Responsive Design**: Mobile-first approach with custom CSS variables for theming

### Backend Architecture
- **RESTful API**: Express.js server with typed route handlers
- **Authentication**: Replit OIDC integration with session-based auth
- **Rate Limiting**: Express rate limiting for whispers, replies, and votes
- **Middleware**: Request logging, error handling, and authentication middleware
- **File Organization**: Separate modules for routes, storage abstraction, and database connection

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon PostgreSQL (serverless)
- **Schema**: Comprehensive schema covering users, whispers, replies, tags, themes, votes, and moderation
- **Relations**: Proper foreign key relationships between entities
- **Migrations**: Drizzle Kit for database schema management

### Core Data Models
- **Users**: Basic user info for authenticated admin users
- **Whispers**: Anonymous posts with mood/topic tags and voting
- **Replies**: Threaded responses to whispers
- **Tags**: Mood and topic categorization system
- **Themes**: Time-based content themes for community engagement
- **Votes**: Upvote/downvote system for content ranking
- **Moderation**: Flagging and admin action tracking

### Authentication & Authorization
- **Anonymous Access**: No registration required for posting/browsing
- **Admin Authentication**: Replit OIDC for admin panel access
- **Session Management**: PostgreSQL-backed session storage
- **Role-Based Access**: Admin-only routes and functionality
- **Security**: CSRF protection and secure session handling

### Content Management
- **Anonymous Posting**: IP-based rate limiting without user tracking
- **Voting System**: Session-based vote tracking to prevent duplicate votes
- **Content Moderation**: Admin tools for managing whispers, replies, and users
- **Tagging System**: Predefined mood and topic tags for content categorization
- **Theme System**: Daily/weekly themed content campaigns

### Development & Deployment
- **Development**: Hot reload with Vite dev server and tsx for backend
- **Production**: Static file serving with Express for SPA deployment
- **Environment**: Replit-optimized with development mode detection
- **Build Process**: Separate client and server build processes with proper asset handling