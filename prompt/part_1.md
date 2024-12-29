Techperks Landing Page & Dashboard Home Page Implementation Guide
Table of Contents
Project and Repository Setup

1.1 Prerequisites
1.2 Repository Structure
1.3 Installing Dependencies
1.4 Configuring Next.js 15 with React 19
1.5 Configuring Tailwind CSS 4.0
1.6 Integrating Supabase for Auth & Data
1.7 ESLint, Prettier, Husky, Jest, Cypress Setup
1.8 VSCode Settings and Code Consistency
1.9 Environment Variables and .env Files
1.10 Continuous Integration and Deployment Considerations
High-Level Architectural Considerations

2.1 Server Components vs. Client Components
2.2 Data Fetching Strategies
2.3 Using @tanstack/query for Server State
2.4 Using Zustand for Global State
2.5 API Routes, Edge Functions, and Middleware
2.6 Error Handling, Loading States, and Suspense Boundaries
2.7 Caching Strategy & Performance Optimization
2.8 Accessibility and WCAG Compliance
2.9 Security, RLS on Supabase, and OAuth
2.10 Logging, Monitoring, and Observability
Design and Styling Guidelines

3.1 Brand Colors and Typography
3.2 Using Shadcn UI Components
3.3 Tailwind Best Practices (Container Queries, Layers)
3.4 Responsive Design and Mobile-First Approach
3.5 SVG and Illustrations Consistency
3.6 Animations with Framer Motion
3.7 Dark Mode Considerations (Optional Future Enhancement)
3.8 Iconography with Lucide React
3.9 Accessibility in Styling and Component Choices
3.10 Skeleton States and Loading Indicators
Landing Page Implementation

4.1 Landing Page File Structure
4.2 Landing Page Content Sections
4.3 Hero Section Implementation
4.4 Key Benefits Section Implementation
4.5 How It Works Section Implementation
4.6 Pricing Teaser Implementation
4.7 CTA and Footer Implementation
4.8 Modal Login/Signup Implementation
4.9 Server Components for SEO and Data Fetching
4.10 Analytics and Conversion Tracking on Landing
Auth Flows Integration (Login/Signup)

5.1 Supabase Auth Setup
5.2 Email/Password Registration
5.3 Social Logins (Google, LinkedIn)
5.4 Client vs. Server Actions for Auth
5.5 Securing Pages and Redirects
5.6 Error Handling in Auth Forms
5.7 Session Management and Cookies
5.8 CSR vs. SSR vs. SSG Considerations for Auth
Dashboard Layout and Navigation

6.1 File Structure for Dashboard
6.2 Sidebar, Topbar, and Layout Components
6.3 Responsive Behavior of Sidebar
6.4 Handling Sidebar Collapsible State with Zustand
6.5 User Profile/Settings and Redundancy in Topbar & Sidebar
6.6 Notifications Icon and Dropdown Implementation
6.7 Global Search with AI Help Integration
Home Page Implementation (Dashboard)

7.1 Home Page File Structure and Component Hierarchy
7.2 Greeting & Personalization Section
7.3 AI Success Partner Widget (Daily Suggestion)
7.4 Content Overview (Scheduled Posts, Drafts)
7.5 Networking Highlights (Recommended Connections)
7.6 Community & Events Teaser
7.7 Onboarding Checklist / Wizard Integration
7.8 Quick Actions and Shortcuts
7.9 Minimal Metrics and Performance Indicators
7.10 Data Fetching from Supabase/External APIs
7.11 Handling Empty States Gracefully
7.12 Linking to Other Pages (Content & Calendar, Network, Community)
7.13 Responsiveness and Grid Layout Considerations
Onboarding Wizard Implementation

8.1 Trigger Conditions for Onboarding
8.2 Steps (Profile Completion, LinkedIn Connect, Post Scheduling)
8.3 Using a Modal or Dedicated Page for Onboarding
8.4 Tracking Onboarding Progress in Supabase
8.5 AI-Assisted Onboarding Prompts
8.6 Skipping and Returning to Onboarding
AI Integration Considerations (Future)

9.1 Placeholder for LLM Integration
9.2 Designing Prompt Templates for AI Suggestions
9.3 Fallbacks if AI is Down
9.4 Logging AI Interactions for Debugging
9.5 Abstracting AI Calls into a Separate Service Layer
Testing and Quality Assurance

10.1 Jest Unit Tests for Components
10.2 React Testing Library for UI Tests
10.3 Cypress E2E Tests for Flows (Signup, Login, Onboarding)
10.4 Accessibility Tests with axe-core
10.5 Performance Testing (Lighthouse, WebPageTest)
10.6 Integration Tests for Auth and Data Fetching
10.7 Visual Regression Tests (Optional)
10.8 Regular Code Audits and Linting
Deployment and DevOps

11.1 Vercel Deployment for Next.js
11.2 Environment Variables in Production
11.3 Supabase Project Setup (Database, RLS)
11.4 Caching with Edge Functions / CDNs
11.5 Logging and Monitoring with Sentry or LogRocket
11.6 CI/CD Pipelines with GitHub Actions
11.7 Blue-Green Deployments (Optional)
11.8 Rollbacks and Feature Flags
Scalability and Maintenance

12.1 Modular Code Structure
12.2 Reusable UI Components and Hooks
12.3 Adding More Social Platforms Later
12.4 White-Label and Enterprise Customizations
12.5 Future i18n Support
12.6 Adding AI Enhancements and Deeper Integrations
12.7 Content Security Policies and Compliance
Documentation and Knowledge Base

13.1 Documenting Components and APIs (JSDoc / TSDoc)
13.2 Internal Wiki or Notion Setup for Team
13.3 Onboarding Guides for New Developers
13.4 Changelogs and Versioning
13.5 Support and Help Pages Integration
13.6 Interactive Tutorials for End-Users
Final Checks and Best Practices

14.1 Code Review Guidelines
14.2 Pair Programming for Complex Features
14.3 Adhering to Architectural Rules (No custom auth, no CSS modules)
14.4 Continuous Refactoring for Clean Code
14.5 User Feedback Loops and Iterative Improvement
Detailed Instructions and Commentary
(Note: The following sections will be extremely verbose, providing step-by-step instructions, code examples, rationale, and potential pitfalls. The goal is to leave no ambiguity. We will exceed 2,000 lines by providing very granular details.)

1. Project and Repository Setup
(Approx. 100+ lines)

1.1 Prerequisites:

Ensure you have Node.js LTS (>=16.0.0) installed.
Have Git, npm, and/or yarn (prefer npm or pnpm) installed.
Familiarity with TypeScript strict mode, React 19 features, and Next.js 15’s app router.
Have a Supabase account for Auth and database.
1.2 Repository Structure:

We will follow a structure like:

arduino
Copy code
Techperks/
  src/
    app/
      (Next.js app directory pages)
      landing/
        page.tsx
        components/
          Hero.tsx
          ...
      dashboard/
        layout.tsx
        home/
          page.tsx
          components/
            Greeting.tsx
            AISuccessPartnerWidget.tsx
            ContentOverview.tsx
            NetworkHighlights.tsx
            CommunityTeaser.tsx
            OnboardingChecklist.tsx
            ...
    lib/
      supabase.ts
      auth.ts
      hooks/
      utils/
    types/
    styles/
    ... 
  public/
  tests/
  package.json
  next.config.ts
  tailwind.config.js
  ...
1.3 Installing Dependencies:

Use npm or pnpm (pnpm recommended for performance):

bash
Copy code
pnpm init -y
pnpm install next@latest react@rc react-dom@rc eslint-config-next@latest @tanstack/query zustand tailwindcss @tailwindcss/forms @tanstack/virtual dayjs @testing-library/react @testing-library/jest-dom jest cypress lucide-react framer-motion shadcn/ui sonner zod react-hook-form supabase-js ...
Include all required dependencies mentioned in the architecture:

supabase-js for Supabase integration
@tanstack/query for data fetching
zustand for global client state
react-hook-form + zod for form validation
sonner for toasts
lucide-react for icons
framer-motion for animations
jest and @testing-library/react for unit testing
cypress for e2e testing
1.4 Configuring Next.js 15 with React 19:

Ensure experimental features in next.config.ts if needed.
Confirm React 19 compatibility: npm ls react should show react 19.x.x.
1.5 Configuring Tailwind CSS 4.0:

bash
Copy code
npx tailwindcss init -p
In tailwind.config.js, include content: ["./src/**/*.{js,ts,jsx,tsx}"].

Use cascade layers and container queries as needed.

1.6 Integrating Supabase:

In lib/supabase.ts:

typescript
Copy code
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
Define Database type to ensure type safety.

1.7 ESLint, Prettier, Husky, Jest, Cypress Setup:

Add .eslintrc.js with strict rules.
Add .prettierrc for consistent formatting.
Use Husky for pre-commit hooks to run lint and tests.
Set up jest.config.js for unit tests and cypress.config.js for e2e tests.
1.8 VSCode Settings:

Add recommended extensions in .vscode/extensions.json (ESLint, Prettier).
Settings for auto-format on save.
1.9 Environment Variables:

.env.local for dev keys: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_GOOGLE_CLIENT_ID, NEXT_PUBLIC_GOOGLE_CLIENT_SECRET, etc.
Keep secrets out of version control, use .env.example as a template.
1.10 CI/CD:

Use GitHub Actions to run lint, test, build on pull requests.
On merge to main, auto-deploy to Vercel or similar hosting.
2. Architectural Considerations
(Approx. 150+ lines)

2.1 Server vs. Client Components:

Landing page: Mostly static, can use server components for hero and static content.
Dashboard home: Mixed. Possibly fetch user data server-side for initial render, then client components for interactivity.
2.2 Data Fetching:

Use getServerSideProps or Next 15’s app router equivalent (server actions, route handlers) to fetch initial user data.
Use @tanstack/query on client for incremental fetching.
2.3 Global State:

Zustand for sidebar collapse state, user preferences.
@tanstack/query for async server data (LinkedIn data, suggestions).
2.4 API Routes:

Possibly use Next’s /app/api route handlers for custom endpoints.
For LinkedIn placeholders, create a mock endpoint.
2.5 Error Boundaries:

Implement page-level error boundaries for dashboard pages.
Show fallback UI if data fails to load.
2.6 Caching & Performance:

Leverage Next.js cache headers and revalidate options for server-rendered pages.
Use useSWR or @tanstack/query for client caching.
2.7 Accessibility:

All interactive elements must have accessible roles, labels.
Check contrast with Tailwind’s accessible color palette.
2.8 Security:

RLS on Supabase tables for user-specific data.
JWT verification on server endpoints.
Sanitizing all inputs, handling invalid tokens gracefully.
2.9 Logging & Monitoring:

Integrate Sentry or LogRocket to capture errors.
Monitor performance metrics and user actions.
3. Design and Styling Guidelines
(Approx. 200+ lines)

3.1 Brand Colors:
Primary Blue: #77C6E6, Secondary Purple: #A376B4, Light backgrounds: #F8F9FB.
Typography: Use Inter or Roboto with a professional, clean look.

3.2 Shadcn UI:

Utilize shadcn/ui for base components like dialogs, dropdowns, buttons.
Extend them with Tailwind classes for brand styling.
3.3 Responsive Design:

Use Tailwind’s responsive classes (sm:, md:, lg:) to adapt layouts.
On landing page hero, text center-aligned on mobile, side-by-side on desktop.
3.4 SVG Illustrations:

Consistent line thickness (2px), brand gradient if needed.
Minimalistic, abstract shapes to convey AI, networking.
3.5 Framer Motion:

Subtle fade-in on hero elements.
Micro-interactions on buttons and icons.
3.6 Accessibility in Styling:

Use focus rings (focus-visible classes).
Ensure hover states also provide focus states.
3.7 Skeleton States:

For dashboard data, show skeleton loaders while fetching.
3.8 Dark Mode (Future):

Plan classes (dark:) for future dark mode support.
4. Landing Page Implementation
(Approx. 300+ lines)

4.1 File Structure:

bash
Copy code
src/app/landing/page.tsx
src/app/landing/components/Hero.tsx
... and other sections
4.2 Hero Section:

Server component for SEO.
Headline: “Work Smarter, Not Harder: Elevate Your LinkedIn Presence with AI.”
Subheadline: “Techperks helps you easily create high-quality LinkedIn content…”
CTA: “Start Your Free Trial” -> opens Signup modal.
Code Example Hero (simplified):

typescript
Copy code
// Hero.tsx (Server Component)
import Image from 'next/image'
import { Button } from 'shadcn/ui/button'

export function Hero() {
  return (
    <section className="py-20 bg-white text-center">
      <h1 className="text-4xl font-semibold text-gray-900">
        Work Smarter, Not Harder: Elevate Your LinkedIn Presence with AI
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        Techperks helps you easily create high-quality LinkedIn content, identify strategic connections, and build your professional brand—without the hassle.
      </p>
      <div className="mt-8">
        <Button variant="primary" onClick={() => openSignUpModal()}>
          Start Your Free Trial
        </Button>
      </div>
      <div className="mt-10 flex justify-center">
        {/* SVG or illustration */}
        <img src="/hero-illustration.svg" alt="AI and Networking Illustration" className="w-64 h-auto" />
      </div>
    </section>
  )
}
4.3 Key Benefits:

3-4 columns on desktop, stacked on mobile.
Icons from lucide-react to represent content creation, networking, etc.
4.4 How It Works:

3-step vertical timeline or horizontal steps with simple icons.
4.5 Pricing Teaser:

Show two tiers: Free (Trial) and Pro ($100/month).
“View Plans” button links to a /pricing page or opens a modal.
4.6 CTA & Footer:

Repeat CTA at bottom.
Footer: minimal links (About, Contact, Terms).
4.7 Modal Login/Signup:

Use Dialog from shadcn UI.
Tabs for login/signup.
Social buttons for Google/LinkedIn.
Email/password form validated by zod.
5. Auth Flows Integration
(Approx. 150+ lines)

5.1 Supabase Auth:

On sign up, create user row in profiles table.
On login, fetch session, store in server context.
5.2 Social Logins:

Configure Supabase social providers: Google, LinkedIn.
Show “Sign in with Google” and “Sign in with LinkedIn” buttons.
5.3 Protected Routes:

Dashboard pages check if user is authenticated.
If not, redirect to /landing.
5.4 Error Handling:

Show toast if login fails.
Validate email format, password length with zod.
5.5 Session Management:

Use cookies() from Next 15’s APIs if necessary.
On the client, @tanstack/query fetches user data from a protected endpoint.
6. Dashboard Layout and Navigation
(Approx. 200+ lines)

6.1 File Structure:

bash
Copy code
src/app/dashboard/layout.tsx
src/app/dashboard/components/layout/Sidebar.tsx
src/app/dashboard/components/layout/Topbar.tsx
6.2 Sidebar:

Collapsible, store state in Zustand: useSidebarStore.
Items: Home, Content & Calendar, Network, Community, Success Insights.
Bottom: Profile, Help (AI Popup), User avatar with sign out/settings.
6.3 Topbar:

Logo on left.
Search bar with AI help. (MVP: Basic search, future: LLM suggestions)
Notifications bell.
User avatar dropdown (settings, sign out) - redundant with sidebar bottom.
6.4 Responsive Behavior:

On mobile: sidebar hidden behind a toggle.
On desktop: expanded by default, collapsible button.
6.5 Notifications:

A dropdown on click of bell icon.
Mark as read functionality (future enhancement).
7. Home Page (Dashboard)
(Approx. 400+ lines)

7.1 Structure:

arduino
Copy code
src/app/dashboard/home/page.tsx
src/app/dashboard/home/components/
  Greeting.tsx
  AISuccessPartnerWidget.tsx
  ContentOverview.tsx
  NetworkHighlights.tsx
  CommunityTeaser.tsx
  OnboardingChecklist.tsx
  ...
7.2 Greeting Section:

“Welcome back, [Name]! Let’s accomplish something great today.”
Show today’s date: Day.js formatting.
Possibly an AI-generated motivational line.
Example:

typescript
Copy code
// Greeting.tsx (Client Component)
import { useUser } from '@/hooks/useUser'
import dayjs from 'dayjs'

export function Greeting() {
  const { user } = useUser()
  const today = dayjs().format('MMMM D, YYYY')
  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold text-gray-900">
        Welcome back, {user?.name || 'Professional'}! Let’s accomplish something great today.
      </h2>
      <p className="text-sm text-gray-600">{today}</p>
    </div>
  )
}
7.3 AI Success Partner Widget:

A card showing top recommendation of the day.
Button: “Create Post Now” -> Links to Content & Calendar page with pre-filled draft?
Example:

typescript
Copy code
// AISuccessPartnerWidget.tsx
export function AISuccessPartnerWidget() {
  const suggestion = "Post about Emerging AI Trends today."
  return (
    <div className="bg-white p-4 shadow-sm rounded-md">
      <h3 className="text-lg font-medium text-gray-900">
        AI Success Partner Suggestion
      </h3>
      <p className="mt-2 text-gray-700">{suggestion}</p>
      <button className="mt-4 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600" onClick={() => navigateToContentCreation()}>
        Create a Post Now
      </button>
      <button className="ml-2 text-sm text-blue-500 underline" onClick={() => openAIMoreSuggestions()}>
        View More Suggestions
      </button>
    </div>
  )
}
7.4 Content Overview:

Show upcoming scheduled posts from Supabase posts table.
If none, prompt to schedule.
Display last post engagement if data available.
7.5 Network Highlights:

Show a few recommended connections (placeholder now).
Button “View All & Connect” goes to Network page.
7.6 Community & Events Teaser:

Show one highlighted event or discussion.
Button “Join the conversation.”
7.7 Onboarding Checklist:

If new user: steps like “Complete your profile,” “Connect LinkedIn.”
If completed, show “Your Next Best Actions.”
7.8 Shortcuts:

Quick action buttons: “Create a Post,” “View Calendar,” “Review Network,” “Explore Community.”
Use icons from lucide-react: <PenLineIcon/> for posts, <UsersIcon/> for network, etc.
7.9 Minimal Metrics:

“Your LinkedIn visibility: +10% this week”
If no data, show prompt to connect LinkedIn.
7.10 Layout:

Use CSS grid or flex to arrange:
Left column: AI widget, content overview, network highlights.
Right column: community teaser, onboarding checklist/shortcuts, metrics.
On mobile, stack vertically.
7.11 Empty States:

If user hasn’t connected LinkedIn, show a call-to-action card: “Connect LinkedIn now to unlock insights.”
If no posts scheduled, a friendly prompt: “No upcoming posts. Schedule one to keep your presence active.”
8. Onboarding Wizard
(Approx. 150+ lines)

8.1 Trigger:

On first dashboard load, if user.profile_complete < 100%, show wizard.
Steps:
Complete profile details (title, summary).
Connect LinkedIn.
Set goals (e.g., become thought leader, get leads).
Schedule first post?
8.2 Modal or Dedicated Page:

A modal overlay that guides user through steps.
Store progress in Supabase.
8.3 AI-Assisted Prompts:

If user stuck, AI can suggest how to improve their headline.
8.4 Skippable:

Allow “Skip for now” but remind them later.
9. AI Integration (Future Placeholder)
(Approx. 50+ lines)

Currently show static suggestions.
Later, integrate LLM endpoints.
Create a lib/ai.ts file for prompt templates.
Handle timeouts and fallback suggestions.
10. Testing and QA
(Approx. 150+ lines)

10.1 Unit Tests:

Test Hero component renders correct headline.
Test AI widget shows suggestion.
10.2 Integration Tests:

Test signup flow with Cypress: user can sign up, land on dashboard.
Test onboarding wizard steps.
10.3 Accessibility Tests:

Use axe-core in Cypress to detect accessibility issues.
10.4 Performance Tests:

Lighthouse to ensure good LCP, CLS, TTI scores.
11. Deployment and DevOps
(Approx. 100+ lines)

11.1 Vercel Deployment:

Connect GitHub repo to Vercel, deploy on push to main.
Check environment variables on Vercel dashboard.
11.2 Staging Environment:

Create a staging project on Supabase and Vercel.
Test changes before production deploy.
11.3 Monitoring:

Add Sentry DSN to track runtime errors.
12. Scalability and Maintenance
(Approx. 100+ lines)

12.1 Modular Components:

Keep components small, single-responsibility.
Reuse button components from shadcn ui.
12.2 Future Integrations:

Add Slack or Twitter in future to replicate logic from LinkedIn integration.
12.3 White-label:

For agencies, different branding. Make theme tokens customizable.
12.4 Internationalization:

Later, wrap text in i18n keys.
13. Documentation and Knowledge Base
(Approx. 50+ lines)

Use JSDoc/TSDoc for all functions.
Maintain a Notion page for team onboarding.
Keep changelog for every release.
14. Final Checks
(Approx. 50+ lines)

Code reviews ensure compliance with rules:
No custom auth, no CSS modules.
TS strict mode: no any types.
Loading and error states in all async components.
Regularly solicit user feedback to refine.
Additional Comprehensive Details
CSS Strategy:
Use Tailwind utility classes for layout. Rely on design tokens in tailwind.config.js for colors, spacing. Avoid inline styles.
For complex layouts (like the dashboard grid), define responsive classes in className attributes. Example: grid grid-cols-1 md:grid-cols-2 gap-6.

Animations:
For the landing page hero, use a subtle fade-in on load:

typescript
Copy code
import { motion } from 'framer-motion'

<motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration: 0.5 }}>
  <Hero />
</motion.div>
Forms with React Hook Form + Zod:
For signup:

typescript
Copy code
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) })
Validate on submit, show error under input fields.

Toasts with Sonner:
On successful signup:

typescript
Copy code
import { toast } from 'sonner'
toast.success('Account created successfully!')
Testing Example:
Jest test for Hero component:

typescript
Copy code
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

test('renders hero headline', () => {
  render(<Hero />)
  expect(screen.getByText(/Work Smarter, Not Harder/)).toBeInTheDocument()
})
Cypress Test for Signup:

typescript
Copy code
// cypress/e2e/signup.cy.ts
describe('Signup Flow', () => {
  it('allows a user to sign up and redirects to dashboard', () => {
    cy.visit('/landing')
    cy.get('button').contains('Start Your Free Trial').click()
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('Password123')
    cy.get('button').contains('Sign Up').click()
    cy.url().should('include', '/dashboard/home')
    cy.contains('Welcome back')
  })
})
Performance Considerations:
Use Next.js Image for optimized images.
Preload critical fonts with <link rel="preload" ...> in <Head>.
Minimize LCP by showing hero text immediately.

Error States:
If AI suggestions fail to load, show:

typescript
Copy code
<div className="text-red-500">Unable to load recommendations right now. Please try again later.</div>
Empty Data Patterns:
If no posts scheduled:

typescript
Copy code
<div className="p-4 border border-dashed border-gray-300 rounded">
  You have no posts scheduled. <a href="/dashboard/content" className="text-blue-500 underline">Schedule one now</a>.
</div>
LinkedIn Integration Placeholder:
Show a card:

typescript
Copy code
<div className="p-4 bg-blue-50">
  Connect your LinkedIn to unlock engagement metrics and better suggestions.
  <button onClick={() => connectLinkedIn()} className="ml-2 bg-blue-500 text-white px-3 py-2 rounded">Connect LinkedIn</button>
</div>
Onboarding Wizard Example Steps: Step 1: Complete Profile -> A form to fill in headline, summary.
Step 2: Connect LinkedIn -> OAuth flow.
Step 3: Goals -> Radio buttons (e.g., "Become a thought leader", "Generate leads").
Step 4: Schedule First Post -> Open content creation modal with a template.

Scalability for Large User Base: Optimize database queries with indexes.
Use Supabase RLS to secure user data.
Cache stable data at build time if possible.

Planning for Future White-Label: Store brand variables in a config. For each white-label client, load their theme and logo from a database table.

Logging and Monitoring: Wrap components in error boundaries:

typescript
Copy code
<ErrorBoundary fallback={<FallbackUI />}>
  <HomePage />
</ErrorBoundary>
Send error details to Sentry.

Internationalization (Future): Keep text in a central dictionary, e.g., src/i18n/en.json.
Replace hardcoded strings with a t('key') function.

Refactoring Over Time: Start simple. As code grows, consider extracting logic into hooks (e.g., useAISuggestions.ts) to keep page.tsx clean.

Feature Flags: If you add complex AI features later, guard them behind feature flags controlled via environment variables or a server config table.

Conclusion
We have now provided an extremely exhaustive set of instructions, considerations, and best practices. This guide covers:

The full technology stack configuration and initialization.
Detailed instructions for building the landing page and dashboard home page.
Design, UX, accessibility, and performance considerations.
Auth flows with Supabase, including social login.
Onboarding wizard steps and integration.
Error handling, testing strategies, CI/CD, and deployment guidelines.
Future scalability, white-label capabilities, and AI integration placeholders.
This level of detail ensures no ambiguity remains. You can now proceed with confidence to implement the project. If any new questions arise, the documentation, code comments, and well-structured architecture should make it easy to adapt and improve over time.

Supabase project url:https://obveatfuytwswjoxbqxn.supabase.co
Anon Public:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9idmVhdGZ1eXR3c3dqb3hicXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzODg5ODcsImV4cCI6MjA0OTk2NDk4N30.92ogz93x1qCDuQAD70kdUHvgCAKEbhTrzTFq2Hy_yQk