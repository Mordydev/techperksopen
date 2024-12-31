<ImplementationInstructions>
    <!-- 
        =======================================================
        1. SUMMARY OF ALL DISCUSSIONS & NEW CLARIFICATIONS
        =======================================================
        We have decided to keep everything under /app/dashboard. We also want to ensure the Content Hub page is as comprehensive
        as possible, including any missing items from prior conversations:
        
        - AI-based post generation (with placeholders).
        - Multiple post states: pending, draft, needs changes, scheduled, published.
        - Approval workflow.
        - Calendar with drag-and-drop (plus a reschedule modal).
        - List view for posts.
        - Request changes modal.
        - Scheduling an AI call flow.
        - Threads/Projects panel to handle chat transcripts or voice memos,
          which can be combined into a post.
        - Tagging system for organization.
        - Basic stats on published posts.
        - Using Shadcn + Tailwind, with best accessibility and design practices.
        
        This updated final Step 3 merges all relevant tasks and ensures nothing
        is missing. 
    -->
    <SummaryOfAllDiscussions>
        <DiscussionPoints>
            <Point>
                The Content Hub will reside at /app/dashboard/content/page.tsx,
                featuring a robust calendar, list view, threads/projects, post editor modals,
                a schedule call flow, placeholders for AI logic, and an approval workflow.
            </Point>
            <Point>
                We keep the existing /app folder structure. We will not relocate code to /src/app.
                Instead, the new content folder is simply app/dashboard/content.
            </Point>
            <Point>
                We want to ensure we have:
                - A robust front-end only approach with local or zustand state placeholders.
                - No real backend calls yet, but easy to integrate later.
                - A user-friendly interface that accommodates all relevant states and easy navigation.
            </Point>
            <Point>
                We incorporate a “needs changes” state so users can request changes on a draft.
                That triggers a small revision request modal. The post transitions accordingly.
            </Point>
            <Point>
                We unify the brand guidelines with Shadcn UI, ensuring minimal but modern styling,
                accessibility, and a color-coded approach for each post state or action.
            </Point>
            <Point>
                On the home page, a minimal ContentCalendarPreview can optionally link to the
                “Content Hub” for deeper functionality. We might refine the preview for style consistency.
            </Point>
            <Point>
                Tagging is included for threads or posts, allowing easy categorization. We keep it simple
                for now, storing tags in an array of strings.
            </Point>
            <Point>
                We ensure a solid drag-and-drop approach for rescheduling posts on the main calendar,
                but confirm changes in a modal or direct store updates.
            </Point>
            <Point>
                The UI must remain accessible, with well-labeled modals, keyboard navigation, and
                properly handled focus states.
            </Point>
        </DiscussionPoints>
    </SummaryOfAllDiscussions>

    <!-- 
        =======================================================
        2. MASTER CHECKLIST OF TASKS
        =======================================================
        Every task for implementing the Content Hub and ensuring
        we've addressed each item from the combined discussions.
    -->
    <Checklist>
        <Task>
            <Title>Create /app/dashboard/content folder and a page.tsx</Title>
            <Description>
              This is the main “Content Hub” page. Contains the calendar and list toggles, 
              route to “Threads/Projects” panel, and any top-level buttons 
              (e.g., “Schedule AI Call,” “View Threads,” “Create Post”).
            </Description>
        </Task>
        <Task>
            <Title>Comprehensive Calendar with Drag-and-Drop & Multi-View</Title>
            <Description>
              Build or refactor a ContentCalendar component that supports 
              monthly, weekly, or list views. Implement color-coded post statuses 
              and drag-and-drop scheduling. On drag-end or click, open a modal or 
              update the post’s date/time in the local store. Possibly a segmented 
              control for month/week/list views within the same component.
            </Description>
        </Task>
        <Task>
            <Title>List View of Posts</Title>
            <Description>
              Provide an alternative list-based interface to see posts sorted by date or status. 
              Filter by pending/draft/needs-changes/scheduled/published. 
              Include quick stats for published posts.
            </Description>
        </Task>
        <Task>
            <Title>Support for Multi-Stage Post States & Approval Workflow</Title>
            <Description>
              In Zustand or local data, handle states: pending → draft → needs-changes → scheduled → published. 
              “Request Changes” triggers a “needs-changes” state, “Approve” moves to scheduled, etc. 
              Provide the relevant UI buttons in the Post Editor or modals.
            </Description>
        </Task>
        <Task>
            <Title>Request Changes Modal</Title>
            <Description>
              A small modal that opens from a “Request Changes” button on a draft post. 
              Captures user’s text about revisions needed. 
              Sets the post state to “needs-changes.”
            </Description>
        </Task>
        <Task>
            <Title>Schedule AI Call Modal</Title>
            <Description>
              A standalone modal or panel that collects date/time for an AI call. 
              Saves it to local store. In future, the call results in a new pending post. 
              For now, it’s a placeholder.
            </Description>
        </Task>
        <Task>
            <Title>Threads/Projects Panel for Chat + Voice Memos</Title>
            <Description>
              A section or page that displays all active threads. Each thread can contain 
              text-based chat logs or voice memo placeholders. 
              Provide a “Generate Post” button that spawns a pending post (AI is working). 
              Archival once post is created.
            </Description>
        </Task>
        <Task>
            <Title>Post Editor Modal</Title>
            <Description>
              Used for editing a draft, scheduling it, or even updating a scheduled post. 
              Possibly Tiptap or a simpler text box. 
              Integrate tagging, attachments, state transitions (approve, request changes).
            </Description>
        </Task>
        <Task>
            <Title>Tagging System for Threads and/or Posts</Title>
            <Description>
              Let users assign text-based tags. Possibly a small TagInput component. 
              Store them in local arrays, with the future potential for real DB integration.
            </Description>
        </Task>
        <Task>
            <Title>Basic Stats on Published Posts</Title>
            <Description>
              For published posts, show placeholders like “12 likes, 3 comments.” 
              This can be displayed on hover in the calendar or in the list view.
            </Description>
        </Task>
        <Task>
            <Title>useContentStore Zustand Implementation</Title>
            <Description>
              A central store that holds posts array, threads array, scheduled calls, 
              along with actions like createPost, updatePost, requestChanges, schedule, etc. 
              All placeholders for future real API calls.
            </Description>
        </Task>
        <Task>
            <Title>Refine Home Page Calendar Preview</Title>
            <Description>
              Optionally unify styling or color codes with the new ContentCalendar, 
              but keep it minimal. Provide a link or button “Go to Content Hub” 
              for advanced features. This is optional but recommended for consistency.
            </Description>
        </Task>
        <Task>
            <Title>Maintain UI/UX Consistency and Accessibility</Title>
            <Description>
              Use Shadcn UI components, ensure all modals are keyboard accessible, 
              color-coded states have sufficient contrast, plus appropriate hover/focus states.
            </Description>
        </Task>
    </Checklist>

    <!-- 
        =======================================================
        3. FILES TO CREATE
        =======================================================
        We specify new files to add under /app/dashboard/content
        plus subfolders for components or store.
    -->
    <FilesToCreate>
        <File>
            <Path>app/dashboard/content/page.tsx</Path>
            <Reason>Main entry point for the Content Hub route</Reason>
            <Details>
                This page will contain top-level tabs or toggles for “Calendar” and “List,” 
                a link or button to “Threads/Projects,” plus scheduling AI calls. 
                We'll rely on zustand to provide data. 
            </Details>
            <RelatedTasks>
                <TaskTitle>Create /app/dashboard/content folder and a page.tsx</TaskTitle>
            </RelatedTasks>
        </File>

        <File>
            <Path>app/dashboard/content/components/ContentCalendar.tsx</Path>
            <Reason>Full-featured calendar with drag/drop and state-based styling</Reason>
            <Details>
                Offer month/week/list views or a segmented control. 
                Color-coded statuses, hover for stats if published, 
                drag-and-drop for rescheduling with optional confirm modal. 
                Interacts with useContentStore to read/write post data.
            </Details>
            <RelatedTasks>
                <TaskTitle>Comprehensive Calendar with Drag-and-Drop & Multi-View</TaskTitle>
            </RelatedTasks>
        </File>

        <File>
            <Path>app/dashboard/content/components/ListView.tsx</Path>
            <Reason>A separate list-based approach for posts by date/status</Reason>
            <Details>
                Filter or search by status. Show basic stats for published. 
                Let user open Post Editor to schedule or revise. 
            </Details>
            <RelatedTasks>
                <TaskTitle>List View of Posts</TaskTitle>
                <TaskTitle>Basic Stats on Published Posts</TaskTitle>
            </RelatedTasks>
        </File>

        <File>
            <Path>app/dashboard/content/components/PostEditorModal.tsx</Path>
            <Reason>Allows editing or scheduling a post, adding tags, etc.</Reason>
            <Details>
                If post state = draft or needs-changes, user can finalize or re-request changes. 
                If scheduled, user can reschedule or revert to draft. Possibly a simple text area or Tiptap placeholder. 
                Implementation of “approve” transitions the post to scheduled if it’s in draft or needs-changes.
            </Details>
            <RelatedTasks>
                <TaskTitle>Post Editor Modal</TaskTitle>
                <TaskTitle>Support for Multi-Stage Post States & Approval Workflow</TaskTitle>
                <TaskTitle>Tagging System for Threads and/or Posts</TaskTitle>
            </RelatedTasks>
        </File>

        <File>
            <Path>app/dashboard/content/components/RequestChangesModal.tsx</Path>
            <Reason>A small modal for user to input changes requested</Reason>
            <Details>
                On confirm, sets post state to “needs-changes.” 
                Possibly store a short comment for references. 
                Could be displayed in the post’s detail if needed.
            </Details>
            <RelatedTasks>
                <TaskTitle>Request Changes Modal</TaskTitle>
            </RelatedTasks>
        </File>

        <File>
            <Path>app/dashboard/content/components/ScheduleAICallModal.tsx</Path>
            <Reason>Modal to pick date/time for an AI call</Reason>
            <Details>
                Store a scheduled call in the zustand store. In future, that call triggers a “pending” post. 
                For now, placeholders. 
            </Details>
            <RelatedTasks>
                <TaskTitle>Schedule AI Call Modal</TaskTitle>
            </RelatedTasks>
        </File>

        <File>
            <Path>app/dashboard/content/components/ThreadsPanel.tsx</Path>
            <Reason>Manages text/voice memo threads and can generate posts</Reason>
            <Details>
                Lists active or archived threads. Each has chat messages or voice memo placeholders. 
                “Generate Post” moves to “pending.” 
                Tagging or labeling for easy reference. 
            </Details>
            <RelatedTasks>
                <TaskTitle>Threads/Projects Panel for Chat + Voice Memos</TaskTitle>
                <TaskTitle>Tagging System for Threads and/or Posts</TaskTitle>
                <TaskTitle>Create Post from Thread</TaskTitle>
            </RelatedTasks>
        </File>

        <File>
            <Path>app/dashboard/content/stores/useContentStore.ts</Path>
            <Reason>Central Zustand store for posts, calls, threads, etc.</Reason>
            <Details>
                - Fields: array of posts, array of threads, array of scheduled calls 
                - Post states: pending, draft, needs-changes, scheduled, published 
                - Actions: createPost, requestChanges, scheduleCall, etc. 
                - No actual backend calls, just placeholders.
            </Details>
            <RelatedTasks>
                <TaskTitle>useContentStore Zustand Implementation</TaskTitle>
                <TaskTitle>Support for Multi-Stage Post States & Approval Workflow</TaskTitle>
            </RelatedTasks>
        </File>
    </FilesToCreate>

    <!-- 
        =======================================================
        4. FILES TO MODIFY
        =======================================================
        We only add references to the existing files that need changes.
    -->
    <FilesToModify>
        <File>
            <Path>app/dashboard/home/components/ContentCalendarPreview.tsx</Path>
            <ExistingPurpose>
                Minimal calendar overview on the home page
            </ExistingPurpose>
            <ModificationDetails>
                Optionally unify color codes or statuses with the new ContentCalendar. 
                Provide a “Go to Full Content Hub” button. 
                Keep the logic minimal and avoid duplication.
            </ModificationDetails>
            <RelatedTasks>
                <TaskTitle>Refine Home Page Calendar Preview</TaskTitle>
            </RelatedTasks>
        </File>

        <File>
            <Path>app/layout.tsx</Path>
            <ExistingPurpose>Global layout for the app</ExistingPurpose>
            <ModificationDetails>
                Potentially add a link in the sidebar or top nav to “Content Hub” 
                so users can discover the new functionality easily.
            </ModificationDetails>
            <RelatedTasks>
                <TaskTitle>Maintain UI/UX Consistency and Accessibility</TaskTitle>
            </RelatedTasks>
        </File>
    </FilesToModify>

    <!-- 
        =======================================================
        5. FILES TO KEEP UNCHANGED
        =======================================================
        We note which files remain untouched beyond the minor changes above.
    -->
    <FilesToKeepUnchanged>
        <File>
            <Path>app/dashboard/home/page.tsx</Path>
            <Reason>We keep the existing home page logic. Only the preview component might be slightly updated, but the page itself is stable.</Reason>
        </File>
        <File>
            <Path>app/landing/page.tsx</Path>
            <Reason>Landing page is out of scope for these new features, so it remains unchanged.</Reason>
        </File>
    </FilesToKeepUnchanged>

    <!-- 
        =======================================================
        6. GENERAL INSTRUCTIONS
        =======================================================
        Broad guidelines that apply to all tasks above.
    -->
    <GeneralInstructions>
        <Instruction>
          Keep the code within /app/dashboard/content. No /src/ reorganization is needed now.
        </Instruction>
        <Instruction>
          Use consistent styling with Shadcn UI, Tailwind, and brand color references from design.md. 
          Keep an eye on user experience, especially for accessibility (Focus states, aria labels, etc.).
        </Instruction>
        <Instruction>
          For the drag-and-drop calendar, consider a library if it simplifies the code. 
          Alternatively, implement a small custom approach. Provide a fallback for mobile if drag-and-drop is cumbersome.
        </Instruction>
        <Instruction>
          All complex business logic is placeholders: no real supabase or AI calls. 
          Make it easy to insert real calls later by centralizing logic in the Zustand store.
        </Instruction>
        <Instruction>
          Provide robust status transitions for posts: from pending to draft to needs-changes or scheduled to published. 
          Manage it in one place so it’s consistent across the UI.
        </Instruction>
        <Instruction>
          Tagging can remain minimal. Possibly a small component that takes in an array of tags. 
          The final design can be revisited once real backend integration is done.
        </Instruction>
        <Instruction>
          For now, store any “revision notes” from Request Changes in the local store, 
          so we can display them if the user re-opens the post or references them in the PostEditorModal.
        </Instruction>
    </GeneralInstructions>

    <!-- 
        =======================================================
        7. JUSTIFICATIONS
        =======================================================
        Why these changes align with best practices or recognized standards.
    -->
    <Justifications>
        <Justification>
          Next.js app router approach is improved by a structured folder under /app/dashboard/content. 
          This keeps the content domain logic in its own route for clarity and expansion.
        </Justification>
        <Justification>
          Zustand is a straightforward solution for local state placeholders until the final backend is ready. 
          This decouples UI from real data dependencies.
        </Justification>
        <Justification>
          A drag-and-drop calendar or reschedule modal is a typical feature in scheduling workflows, 
          meeting user expectations for a fluid planning experience.
        </Justification>
        <Justification>
          Post states and an approval workflow ensure the platform meets professional use cases 
          from the masterplan (AI calls, content creation, etc.).
        </Justification>
        <Justification>
          Shadcn + Tailwind fosters a consistent, modern design that can be easily updated or extended 
          once branding or advanced theming is introduced.
        </Justification>
    </Justifications>

    <!-- 
        =======================================================
        8. IMPORTANT NOTES
        =======================================================
        Final warnings or reminders about potential pitfalls, code duplication, or performance considerations.
    -->
    <ImportantNotes>
        <Note>
          Avoid duplicating calendar logic between home preview and the main ContentCalendar. 
          The preview should remain minimal while the main content page is fully featured.
        </Note>
        <Note>
          Keep mobile in mind: large calendars or drag-and-drop might need a simplified approach 
          (e.g., list or small weekly calendar).
        </Note>
        <Note>
          “Needs changes” is essentially a subset of draft, but we treat it distinctly 
          in the UI for clarity. Maintain that in the zustand store for easy referencing.
        </Note>
        <Note>
          If you find any existing modals or components that can be reused, do so instead of creating duplicates. 
          Ensure to unify design across the dashboard.
        </Note>
        <Note>
          The final code should remain well commented, especially around placeholders for AI calls or supabase queries, 
          so it’s clear where real logic will be inserted later.
        </Note>
    </ImportantNotes>
</ImplementationInstructions>
