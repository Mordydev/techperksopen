Techperks Content Page Comprehensive Implementation Guide
Table of Contents
High-Level Overview

1.1 Purpose of the Content Page
1.2 Key User Flows and Business Logic
1.3 Dependencies on Other Systems (AI, Supabase, LinkedIn)
1.4 Integrations with Voice Memos, AI Voice Calls, and AI Suggestions
1.5 Relationship to Other Pages (Home, Success Insights)
User Scenarios and Use Cases

2.1 Primary Scenario: AI Voice Call to Generate a Draft Post
2.2 Creating Content from Voice Memos (Threading)
2.3 Direct AI Brainstorming for Topics and Idea Generation
2.4 Scheduling Posts via Calendar and Editing Scheduled Times
2.5 Switching between Calendar and List View
2.6 Uploading/Using Images, Videos, and AI-Generated Media
2.7 Publishing Directly vs. Posting Manually on LinkedIn
2.8 Notifications and Reminders (Email, In-App)
2.9 Viewing Basic Performance Data and Linking to Insights Page
Data Flow and Architecture

3.1 Data Model for Posts in Supabase
3.2 Statuses: Draft, In-Progress (AI Generating), Scheduled, Published, Failed
3.3 Fields: Title, Body (Text), AI Context, Media, Scheduled Time
3.4 Voice Memo Threads and Their Relationship to Draft Posts
3.5 Handling AI Processing (Assembly Line / Expert Panel) in Background
3.6 LinkedIn Integration and Publishing Flow
3.7 Caching and Performance Considerations
UI and UX Design Considerations

4.1 Layout of the Content Page
4.2 Calendar vs. List View Toggle
4.3 “In-Progress” Drafts with Loading Indicators
4.4 Sidebar or Drawer for Voice Memo Threads and Content Bank
4.5 Buttons and Controls for AI Brainstorming, Topic Suggestions
4.6 Scheduling Modal or Popup for Editing Date/Time
4.7 Media Upload and AI Media Generation UI
4.8 Accessibility and Responsive Design
Voice-Based Content Creation Flow

5.1 Scheduling AI Voice Calls
5.2 Handling Real-Time Transcription and Follow-Up Questions
5.3 Submitting Recorded Voice Memos for Processing
5.4 Multi-Step Assembly Line and Expert Panel Integration
5.5 Displaying Draft Results when AI Generation Completes
5.6 Revision Requests and Feedback Loops
AI Suggestions and Brainstorming

6.1 Topic Suggestions: Showing Top 3 and “View More”
6.2 Chat-based Brainstorming with AI: Using Profile and Past Data as Context
6.3 Converting a Chat Discussion into a Post Draft
6.4 Iterative Improvements: “Make it more concise,” “Change tone,” etc.
6.5 Handling AI Timeouts or Fallbacks if the AI is Down
Calendar and Scheduling

7.1 Calendar View Implementation (Monthly/Weekly/Yearly filters)
7.2 Switching to List View for Simpler Browsing
7.3 Editing Scheduled Time by Clicking the Post in Calendar
7.4 No Drag-and-Drop Initially: Use a Modal for Date/Time Updates
7.5 Handling Time Zones (Assume User’s Local Time)
7.6 Handling Reminders and Notifications Before Posting
Publishing Options

8.1 Direct Publish to LinkedIn (If Authorized)
8.2 Remind User to Post Manually if They Prefer
8.3 Post-Publish Confirmations and Error Handling
8.4 Retry Logic if LinkedIn Publishing Fails
8.5 Fallbacks: If LinkedIn Integration is Not Available, Just Store the Draft
Media Management

9.1 Uploading User-Provided Images/Videos
9.2 Integrating Replicate API or Other AI Providers for Image/Video Generation
9.3 Attaching Media to Draft Posts
9.4 Handling Media Previews and File Size Limits
9.5 Storing Media in Supabase Storage or External CDN
Content Bank and Voice Memo Threads

10.1 Accessing Past Voice Memos from a Sidebar/Panel
10.2 Tagging and Searching Voice Memos
10.3 Converting Selected Voice Memo Threads into Drafts
10.4 Storing Metadata about Threads: Topic, Date Recorded
10.5 Integrating AI to Summarize a Long Voice Thread into a Concise Draft
Notifications and Reminders

11.1 Email Notifications Before a Scheduled Post Goes Live
11.2 In-App Notifications for Post Ready for Review
11.3 Retry and Error Alerts for Failed Publishing
11.4 Customizing Notification Preferences
Basic Performance Metrics

12.1 Showing Minimal Metrics (Engagement Count) on Published Posts
12.2 Linking “View More Insights” to the Success Insights Page
12.3 Possibly Showing Post Performance from Past 30 Days
12.4 Encouraging User to Connect LinkedIn for Deeper Insights
Data Handling and API Routes

13.1 Creating API Endpoints for Retrieving/Saving Drafts
13.2 Endpoint for Requesting AI Suggestions
13.3 Endpoint for Scheduling AI Voice Calls
13.4 Endpoint for LinkedIn Publishing (Server Action)
13.5 Endpoint for Attaching Media and Processing it
Error Handling and Edge Cases

14.1 AI Generation Fails: Show a Retry Button or Default Template
14.2 LinkedIn Auth Expired: Prompt User to Reconnect
14.3 Invalid Dates or Times: Validation and Graceful Errors
14.4 Network Failures for Media Uploads
14.5 Missing User Profile Data: Prompt to Complete Profile for Better AI Results
Testing and QA

15.1 Unit Tests for Post Editing and Scheduling Components
15.2 Integration Tests for AI Generation Flow (Voice Memos -> Draft)
15.3 E2E Tests for Scheduling a Post and Receiving a Notification
15.4 Accessibility Tests with axe-core
15.5 Performance Testing: Calendar Loading, Media Upload Times
Deployment and Monitoring

16.1 Ensure CI/CD Checks (Lint, Test) Before Deployment
16.2 Logging AI Calls and Errors with Sentry
16.3 Monitoring Performance of Calendar and AI Calls
16.4 Scalability Considerations with More Users and Posts
Scalability and Future Enhancements

17.1 Adding More Social Platforms Later
17.2 Introducing Content Approval Workflows (Enterprise)
17.3 More Advanced Drag-and-Drop Scheduling
17.4 Enhanced Analytics and Trend Predictions
Documentation and Ongoing Maintenance

18.1 Internal Docs for AI Prompt Templates
18.2 Onboarding Guidelines for New Team Members
18.3 Change Logs for Each Feature Addition
Detailed Implementation Steps and Considerations
(We will now dive deep into each section, providing even more explicit instructions, code examples, and reasoning. The goal is to exceed the thoroughness of previous instructions.)

1. High-Level Overview
1.1 Purpose of the Content Page:
The Content Page is the hub for creating, managing, and scheduling LinkedIn posts using AI-driven workflows. Unlike a simple text editor, it leverages voice inputs, AI voice calls, multi-stage assembly line processing, and a panel of AI experts behind the scenes to produce polished drafts. The user can review, revise, schedule, and eventually publish these posts directly or manually.

1.2 Key User Flows:

Voice Call-Generated Drafts:
Users schedule a call with the AI. The call is transcribed and refined through the AI pipeline, ultimately producing a draft that appears on the Content Page.
Voice Memo Threads to Drafts:
Users record voice memos at any time. Later, they can select a thread of memos on the Content Page, send it through the AI pipeline, and generate a draft.
AI Brainstorming Chat:
Users can chat with the AI to get topic ideas. After finalizing an idea in chat form, they click “Convert to Draft” and see a post draft ready for editing and scheduling.
Calendar and Scheduling:
The user can view all drafts and scheduled posts in a calendar view. Clicking a slot creates a new scheduled post or edits an existing one. Times can be updated, and posts can be marked for autopublish or reminder-only.
1.3 Dependencies:

Supabase for storing posts, voice memos, user data, and scheduling info.
AI Pipeline: Uses multi-agent assembly lines. The user doesn’t see this complexity. Just a “Generating Draft…” state until done.
LinkedIn Integration: OAuth-based. If authorized, can publish automatically at the scheduled time.
1.4 Integrations with Voice and AI:

The platform’s unique selling point is capturing the user’s style via voice. We’ll store voice memos in the Content Bank. The AI uses this audio to understand tone, style, and user’s brand, producing authentic, on-brand posts.
1.5 Relationship to Other Pages:

The Home Page might show a quick snippet of upcoming posts or recommended content actions, but the Content Page is where the bulk of content creation and scheduling logic resides.
The Success Insights page shows detailed analytics; the Content Page can link to it if the user wants deeper insights into performance.
2. User Scenarios and Use Cases
(We will incorporate the clarified business logic from the user’s message.)

Scenario: AI Voice Call Generation
User has a weekly scheduled call (based on their plan) with AI. They talk for ~10 minutes about topics they want to cover. The call ends. Behind the scenes, the transcript is processed through the AI assembly line. After a few minutes, a new draft appears in the Content Page’s “Drafts” section with a “New” label. The user can then review, make minor edits, and schedule it.

Scenario: Voice Memo Threads
The user recorded several voice memos over the week. On the Content Page, they open the “Content Bank” (a sidebar panel), select a thread of memos tagged “AI in Healthcare.” They click “Generate Post,” and after processing, a draft emerges. This reduces friction and ensures authenticity.

Scenario: Brainstorming with AI Chat
On the Content Page, user clicks “Brainstorm Topics.” A chat modal appears. They type: “I want to talk about the future of AI in finance.” The AI suggests 3 angles. The user picks one and refines it. When done, they click “Convert to Draft.” A new draft post is created, ready for final touches.

Scenario: Scheduling and Calendar View
The user sees a calendar showing upcoming posts. One post is scheduled for next Wednesday at 10 AM. They realize they need it earlier, so they click the post in the calendar, open an edit modal, change the time to Tuesday at 9 AM, and save. The interface updates instantly.

Scenario: Publishing and Notifications
The user sets the post to auto-publish directly to LinkedIn. On the scheduled date/time, the system attempts to publish. If successful, the user gets an in-app and email notification: “Your post went live!” If it fails (e.g., LinkedIn token expired), user gets a notification and a link to fix the issue.

3. Data Flow and Architecture
3.1 Data Model in Supabase (Posts Table):

sql
Copy code
Table: posts
Columns:
- id (uuid)
- user_id (uuid)
- title (text, optional)
- body (text)
- media_url (text, optional)
- media_type (enum: 'image', 'video', 'none')
- status (enum: 'draft', 'in_progress', 'scheduled', 'published', 'failed')
- scheduled_time (timestamp with time zone, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- linkedIn_post_id (text, optional)
- ai_context (jsonb, optional) // store AI notes or references
- voice_thread_id (uuid, optional) // references a voice memo thread
- publish_method (enum: 'auto'|'manual')
3.2 Statuses:

in_progress: Means AI is still generating the draft.
draft: Ready for user edits.
scheduled: Has a scheduled_time and will either auto-publish or remind user at that time.
published: Successfully posted to LinkedIn or user manually posted and marked as done.
failed: Failed to publish automatically. Show error and allow retry.
3.3 Voice Memos & Threads:

sql
Copy code
Table: voice_memos
- id (uuid)
- user_id
- audio_url (text)
- transcript (text, generated after processing)
- created_at
- tags (text[])

Table: voice_threads
- id (uuid)
- user_id
- memo_ids (uuid[])
- summary (text, generated by AI after optional request)
- created_at
3.4 AI Processing:

When user requests a draft from voice, we send transcript + instructions to the AI pipeline.
A background job updates the post record from in_progress to draft when done.
3.5 LinkedIn Integration:

If user connected LinkedIn, we have their OAuth token in user_profiles.
On scheduled_time, a serverless function tries to publish the post to LinkedIn.
On success, status => published. On failure, status => failed.
4. UI and UX Design Considerations
4.1 Layout:

Top: Page title “Content & Calendar”
Below: Tabs or toggle switch for “Calendar View” and “List View”
On the left side: A button “Brainstorm with AI,” “View Content Bank”
A prominent “Create New Post” button
Calendar view: a monthly/weekly view. Clicking a day/time slot opens “Create Post” modal.
List view: a table or cards of upcoming and past posts, filter by status/time.
4.2 In-Progress Draft UI:

Show a skeleton card or “Generating your draft...” loading state.
Possibly a progress indicator if we can estimate, or a simple spinner.
4.3 Voice Memo Threads Panel:

A sidebar that can slide out from the right. Lists voice threads with tags and dates.
Clicking a thread: details and “Generate Post from This Thread” button.
4.4 Brainstorming UI:

A modal with a chat interface. AI suggests topics. Show top 3 initially with “Load More.”
Once user finalizes an idea, a button “Convert to Draft.”
4.5 Scheduling Modal:

A modal with a datetime picker (e.g., react-datetime-picker)
Dropdown for publish method (auto/manual)
Confirm button updates posts table.
5. Voice-Based Content Creation Flow
5.1 Scheduling AI Voice Calls:

User sets a weekly recurring call in their profile settings or chooses ad-hoc scheduling.
At the scheduled time, user joins a voice call (external integration or we handle?). After call finishes, transcript is processed asynchronously.
5.2 Transcription & Assembly Line:

After call ends, a job sends audio to a speech-to-text service.
Transcript is fed into AI pipeline. On completion, a new post record created with status = 'draft'.
5.3 Voice Memos to Drafts:

User selects voice memo thread from Content Bank.
Click “Generate Post.” Sets status = 'in_progress' on a new post row.
Once AI done: status = 'draft', show in UI.
5.4 Revisions:

If user wants changes, they can open the draft, click “Refine with AI” → sends the existing draft to AI with revision instructions.
Update post record after revision is done.
6. AI Suggestions and Brainstorming
6.1 Topic Suggestions:

A “Brainstorm Topics” button triggers a modal.
AI returns top 3 suggestions. Show them in cards.
“View More” calls AI again for additional suggestions.
User chooses one, then can refine via chat or directly convert.
6.2 Chat-based Brainstorming:

On user’s commands (“Shorten it”, “Change tone”), send a new prompt to the AI and update the UI.
When satisfied, “Convert to Draft” → Creates posts entry with status='draft'.
6.3 Error Handling in AI:

If AI times out or fails, show a friendly error: “We’re having trouble generating suggestions. Try again later.”
Offer a default template?
7. Calendar and Scheduling
7.1 Calendar Implementation:

Use a React calendar library or custom implementation.
By default, show monthly view with posts indicated as small dots or cards on respective dates.
Weekly and yearly filters available. Weekly might show time slots.
7.2 Editing Scheduled Time:

Click on a scheduled post → modal with date/time picker.
Update scheduled_time in DB on confirm.
Show toast on success: “Post rescheduled.”
7.3 No Drag-and-Drop Initially:

To keep complexity low, rely on modals for editing.
7.4 Reminders:

If publish_method='manual', send user a reminder email 30 min before scheduled_time.
8. Publishing Options
8.1 Auto Publish:

If user authorized LinkedIn and chosen auto:
A serverless function checks every minute (cron) for posts whose scheduled_time is now or past.
Attempts to publish via LinkedIn API. On success, sets status='published'.
On failure, sets status='failed' and notifies user.
8.2 Manual Posting:

If user chooses manual, at scheduled_time we send them a reminder (in-app + email).
User can mark post as “Published” after posting on LinkedIn themselves.
9. Media Management
9.1 Uploading Images/Videos:

In the draft editor, “Attach Media” button opens file picker.
Validate file type and size.
Upload to Supabase storage or external CDN.
Show thumbnail preview.
9.2 AI-Generated Media:

If user wants AI-generated images, integrate with a provider like Replicate.
A modal to select “Generate Image” from prompt → fetch from API → On success, attach to post.
10. Content Bank and Voice Memo Threads
10.1 Accessing Content Bank:

A sidebar shows a list of voice memo threads sorted by date or tags.
Search bar to find threads by keywords in transcript.
10.2 Generating a Post from a Thread:

Click a thread → “Generate Post.” This creates a new in-progress post, triggers AI pipeline.
Show loading indicator until done.
11. Notifications and Reminders
11.1 In-App Notifications:

When draft ready: “Your AI-generated draft is now ready for review.”
11.2 Email Notifications:

Before scheduled post (manual): “Your scheduled post is ready to publish now.”
After auto-publish: “Your post was successfully published.”
11.3 Failure Notifications:

If auto-publish fails: “We couldn’t publish your post. Please reconnect LinkedIn or try again.”
12. Basic Performance Metrics
12.1 Minimal Metrics:

After publishing, occasionally fetch LinkedIn engagement stats (likes, comments).
Show small metrics under the published post.
Link “See More Insights” → leads to Success Insights page.
13. Data Handling and API Routes
13.1 API Endpoints:

POST /api/posts to create a draft (e.g., from AI suggestion)
PATCH /api/posts/:id to update scheduled_time, title, body
POST /api/posts/:id/publish to manually trigger publishing
GET /api/posts with query params for filters
13.2 AI Endpoints:

POST /api/ai/generateDraft for voice-based or memo-based generation
POST /api/ai/brainstormTopics
POST /api/ai/refineDraft
13.3 LinkedIn Endpoint:

POST /api/social/linkedin/publish invoked by serverless cron.
14. Error Handling and Edge Cases
14.1 AI Down:

Show a fallback message and suggest user try manual drafting.
14.2 Invalid Date/Time:

If user picks a past date, show an error and prevent saving.
14.3 Media Upload Failures:

Show toast: “Upload failed, please try a smaller file or different format.”
15. Testing and QA
15.1 Unit Tests:

Test the PostEditor component: ensures text edits, media attach, and AI suggestions load.
15.2 Integration Tests:

Test voice memo to draft flow: record a memo, generate post, verify final draft appears.
15.3 E2E Tests with Cypress:

Create a post from brainstorming, schedule it, simulate time passage (mocks), and check notifications.
15.4 Accessibility Tests:

Ensure all modals have aria-label, keyboard traps are correct.
16. Deployment and Monitoring
16.1 CI/CD:

On PR: run lint, tests, build.
On main merge: deploy to Vercel.
Check logs for AI errors or LinkedIn publishing issues.
16.2 Observability:

Sentry to log errors from AI endpoints.
Performance metrics with Vercel Analytics or Web Vitals.
17. Scalability and Future Enhancements
17.1 Multi-Platform:

Eventually add tabs for LinkedIn, Twitter, etc.
Already have platform field in DB schema for easy expansion.
17.2 Approval Workflows:

For enterprise, add a “Needs Approval” status before scheduling.
17.3 Advanced Calendar Features:

Future: drag-and-drop to reschedule, multi-select posts.
17.4 Richer Analytics:

Integrate advanced analytics on the Success Insights page and link back here.
18. Documentation and Maintenance
18.1 Developer Onboarding Docs:

Document the AI prompt structures, expected response formats.
Document the LinkedIn integration steps and tokens refresh logic.
18.2 User-Facing Guides:

Inline tooltips: “Need help? Hover to learn how to record voice memos.”
18.3 Changelogs:

Maintain a CHANGELOG.md to track new features, bug fixes, and improvements.
Additional Detailed Notes and Advice
Ensuring a Smooth AI Experience:
The AI calls are asynchronous. Consider using optimistic UI or at least providing continuous feedback (“We’re generating your post...”). If it takes long, reassure the user it may take a few minutes.

Caching Calendar Data:
If the user has many posts, fetching them each time might be slow. Use @tanstack/query with caching to quickly load data. Paginate or limit results in List View.

Voice Memo Audio Handling:
Ensure audio files are transcoded to a standard format (e.g., MP3) before sending to speech-to-text. Validate audio length (maybe limit to 5 minutes per memo) for performance.

Security Considerations: Only allow user_id to access their own posts and voice memos.
Apply RLS policies on Supabase.

Zod Validation for Input: Validate post creation payloads with zod to ensure scheduled_time is a valid future date.

Styling and Theming: Keep consistent with brand. Use Tailwind’s new container queries to adapt layout on different screen sizes (e.g., simpler list view on mobile).

Testing Failure States: Simulate AI failure by mocking API responses. Ensure the UI gracefully handles it and doesn’t break.

Performance and Load Testing: Consider load testing if you expect many concurrent users generating drafts.

Conclusion
We have now provided an even more comprehensive and detailed instruction set than for the landing and home pages. This guide covers:

The complete workflow for voice-based content generation.
Integration with AI brainstorming and suggestions.
Calendar and scheduling logic, including manual vs. auto-publishing.
Media handling and AI-generated media integration.
Detailed data models, statuses, and how to manage each stage of post creation.
Notifications, reminders, and integration with external platforms like LinkedIn.
Error handling, testing strategies, deployment considerations, and future scalability.
