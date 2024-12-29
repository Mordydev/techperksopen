# Essential Technology Rules

## MANDATORY TECHNOLOGY STACK
MUST use these exact technologies and versions:

Core Technologies:
- Next.js 14+ with App Router
- TypeScript in strict mode
- Supabase for database and auth
- Zustand for global state
- @tanstack/query for server state

UI & Styling:
- Shadcn UI for components
- Tailwind CSS for styling
- Sonner for toast notifications
- Lucide React for icons
- Framer Motion for animation

Form & Data:
- React Hook Form + Zod for forms
- Plotly.js for data visualization
- TipTap for rich text
- @tanstack/virtual for lists
- Day.js for date manipulation

Development Tools:
- ESLint with strict configuration
- Prettier for code formatting
- Husky for git hooks
- Jest and React Testing Library
- Cypress for E2E testing

## ARCHITECTURAL RULES

DO:
- Use React Server Components by default
- Keep client components in 'use client' files
- Implement proper suspense boundaries
- Use server actions for mutations
- Handle errors at page level
- Implement proper loading states
- Follow mobile-first design

DON'T:
- Use client components unnecessarily
- Mix client and server code
- Use class components
- Implement custom auth
- Create custom UI components
- Use CSS modules or styled-components

## CODE REVIEW & COMPONENT REUSE

BEFORE DEVELOPMENT:
- Review existing components in project structure
- Check for similar implementations
- Understand current patterns and conventions
- Review related features and functionality
- Analyze existing data structures
- Check for reusable utilities

DON'T CREATE NEW WHEN:
- Similar component exists
- Pattern can be extended
- Utility can be reused
- Feature can be composed
- Logic can be shared
- Structure can be adapted

## DATABASE & AUTH

SUPABASE SETUP:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

DATABASE RULES:
- Enable Row Level Security (RLS) for all tables
- Define explicit security policies
- Use TypeScript database types
- Implement proper migrations
- Enable point-in-time recovery
- Monitor query performance

AUTH IMPLEMENTATION:
```typescript
// Example auth hook
export function useAuth() {
  const { data: session } = await supabase.auth.getSession()
  return {
    user: session?.user,
    signIn: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut()
  }
}
```

SECURITY REQUIREMENTS:
- Implement RLS policies for all tables
- Encrypt sensitive data
- Use environment variables
- Implement proper error handling
- Monitor access patterns
- Regular security audits

ENVIRONMENT SETUP:
- Separate development/staging/production
- Use environment variables
- Implement proper logging
- Monitor performance
- Regular backups
- Audit trail enabled

DON'T:
- Store credentials in code
- Skip RLS policies
- Use raw SQL without types
- Store sensitive data client-side
- Skip proper error handling
- Mix environment configs

## STATE MANAGEMENT

DO:
- Use Zustand for global state
- Keep stores small and focused
- Use @tanstack/query for server state
- Implement proper loading states
- Handle optimistic updates
- Type all state properly

DON'T:
- Use Redux or other state managers
- Mix global and server state
- Store server data in global state
- Skip loading/error states
- Use context for global state
- Create complex state structures

## COMPONENT IMPLEMENTATION

DO:
- Use Shadcn UI components
- Use Sonner for all toasts
- Use Lucide React for icons
- Extend components properly
- Implement proper types
- Handle all error states
- Use proper loading states
- Follow accessibility guidelines

DON'T:
- Create custom base components
- Use other toast libraries
- Use other icon libraries
- Skip TypeScript types
- Mix presentation and logic
- Skip error handling
- Skip loading states
- Use inline styles

## CODE PATTERNS

TypeScript:
```typescript
// Component Pattern
interface Props {
  data: TData
  onAction: (id: string) => Promise<void>
}

export default function Component({ data, onAction }: Props) {
  return (...)
}

// Store Pattern
interface State {
  data: TData
  updateData: (data: TData) => void
}

export const useStore = create<State>((set) => ({
  data: initialData,
  updateData: (data) => set({ data })
}))

// Query Pattern
export function useData(id: string) {
  return useQuery({
    queryKey: ['data', id],
    queryFn: () => supabase.from('table').select().match({ id }),
    suspense: true
  })
}
```

## IMPLEMENTATION CHECKLIST

Before Creating Component:
1. Is it necessary on client?
2. Can it be a server component?
3. Are all props typed?
4. Is error handling implemented?
5. Are loading states handled?
6. Is it accessible?

Before Creating Feature:
1. Is data structure defined?
2. Are database types created?
3. Is state management planned?
4. Are components server-first?
5. Is error handling complete?
6. Is it fully typed?

## QUALITY REQUIREMENTS

Must Meet:
- 100% TypeScript coverage
- 0 any types
- All props typed
- All functions typed
- All errors handled
- All loading states implemented
- WCAG 2.2 AA compliance
- Core Web Vitals met

## ERROR HANDLING

DO:
- Use error boundaries
- Handle async errors
- Show user feedback
- Log errors properly
- Implement fallbacks
- Type error states

DON'T:
- Skip error cases
- Show technical errors
- Skip loading states
- Use alert()
- Throw unhandled errors
- Skip type checkings