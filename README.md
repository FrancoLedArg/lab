# 🏥 Medical Biochemistry Lab Management System

A modern, web-based laboratory management system designed to streamline patient data management, bloodwork result processing, and report generation for medical biochemistry labs.

## ✨ Features

### 🔄 Streamlined Workflow

- **Unified System**: Capture all patient information and lab requirements in one place
- **No Double Entry**: Eliminate manual data transfer from folders to legacy software
- **Fast Data Entry**: Configurable shortcuts for rapid result input

### 📱 Remote Access & Validation

- **Remote Validation**: Doctors can review and validate results from anywhere
- **Mobile-Friendly**: Responsive design for phone and tablet access
- **Multi-Location Support**: Work seamlessly across multiple lab locations

### 📊 Advanced Lab Management

- **Flexible Lab Practices**: Dynamic, user-configurable lab practice definitions
- **Multi-Field Results**: Support complex analyses (physical, chemical, microscopical sections)
- **Authorization Tracking**: Track social security provider authorization status per practice
- **Reference Values**: Per-field reference ranges with validation alerts

### 📄 Professional Reports

- **PDF Generation**: Generate professional lab reports
- **Browser Printing**: Direct print support from the browser
- **Digital Signatures**: Doctor digital signatures on all reports

### 🔍 Improved Data Access

- **Fast Search**: Quick retrieval of historical bloodwork data
- **Status Tracking**: Clear visibility into result status (draft → pending validation → validated → final)
- **Audit Functions**: Track reports by doctor, provider, and time period

### 🔐 Secure Authentication

- **Passwordless Login**: Simplified authentication for lab staff
- **Better Auth**: Secure, modern authentication system

## 🛠️ Tech Stack

### Core Framework

- **Next.js 16** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript** - Type-safe development

### Data & Backend

- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Database (Neon Serverless)
- **Better Auth** - Authentication system
- **next-safe-action** - Type-safe server actions

### UI & Styling

- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Tailwind CSS 4** - Utility-first styling
- **TanStack React Form** - Powerful form management
- **Sonner** - Toast notifications

### Validation & Monitoring

- **Zod** - Schema validation
- **Sentry** - Error tracking and monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd lab
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your database credentials and other config
```

4. Set up the database

```bash
pnpm db:push
```

5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
lab/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   └── auth/             # Authentication pages
├── actions/               # Server actions
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── Form/            # Form components
├── lib/                  # Shared utilities
│   ├── auth/            # Auth configuration
│   ├── db/              # Database schema & utilities
│   └── validation/      # Zod schemas
├── config/               # Configuration files
└── public/               # Static assets
```

## 🗄️ Database

### Available Commands

- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## 🎯 Key Workflows

### Lab Order Creation

1. Patient visits lab (new or returning)
2. Blood extraction performed
3. New lab order created with requested practices
4. Authorization status recorded per practice

### Results Entry & Validation

1. Technician enters results using shortcuts
2. Status: `draft` → `pending_validation`
3. Doctor reviews and edits results
4. Doctor validates: `validated` → `final`
5. PDF report generated with digital signature

## 📝 Development Guidelines

- **Type Safety**: Full TypeScript coverage with strict mode
- **Validation**: All user inputs validated with Zod
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Code Quality**: Focus on readability, modularity, and reusability
- **Best Practices**: Follow Next.js and React best practices

## 🔒 Security & Privacy

- **Data Protection**: Sensitive medical data never exposed in logs or errors
- **Server-Side Only**: Database queries and sensitive operations server-side only
- **Input Validation**: Client and server-side validation for all inputs
- **Environment Variables**: All secrets stored securely in environment variables

## 🗺️ Roadmap

- [x] Basic authentication
- [x] Patient management
- [ ] Lab practice management
- [ ] Results entry with shortcuts
- [ ] Remote validation workflow
- [ ] PDF report generation
- [ ] Role-based access control
- [ ] GUI for lab practices (replacing shortcuts)
- [ ] Report templates

## 📄 License

Private project - All rights reserved

## 👥 Contributing

This is an internal project. For questions or suggestions, please contact the development team.

---

**Built with ❤️ for modern medical laboratories**
