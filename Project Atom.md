# ATOM — Personal Workspace

> **Tagline:** Everything that makes your day work.  
> **Working name:** ATOM  
> **Project status:** Initial concept / MVP planning

## 1. Project Overview

ATOM is a personal workspace app designed to bring everyday work into one place. Its initial purpose is to combine:

- **Notes** — capture and organize ideas and information.
- **Tasks** — manage work items with a workflow inspired by GitHub Issues.
- **Time tracking** — record time-in and time-out, with a foundation for reviewing work hours.

The app should feel personal, focused, and adaptable—not like a large corporate project-management suite. It will start with these core features and expand as needs become clearer.

## 2. Name and Brand Concept

### Why “ATOM”?

An atom is a fundamental building block of matter. The name represents ATOM as a fundamental building block of the user's digital workflow.

The periodic-table inspiration can also guide the visual identity: compact element-style tiles, atomic numbers, chemical-symbol typography, and a clean technical interface.

**Brand qualities**

- Minimal and memorable
- Technical, but approachable
- Personal rather than corporate
- Flexible enough to support future features

**Brand idea:** _Your personal workspace, built from the elements of your day._

> Naming note: ATOM is a working name. Check domain, app-store, and trademark availability before public release.

## 3. Initial Goals

1. Keep notes, tasks, and time records accessible from one workspace.
2. Make everyday capture and updates quick and uncomplicated.
3. Provide a task workflow familiar to developers and people who use GitHub Issues.
4. Make time-in/time-out records easy to create and review.
5. Build a foundation that can grow without tying the product identity to only one feature.

## 4. MVP Scope

### 4.1 Notes

**Purpose:** Quickly capture and revisit information.

Potential MVP capabilities:

- Create, view, edit, and delete notes
- Note title and body
- Created and updated timestamps
- Search notes
- Optional tags or simple organization, depending on implementation effort

### 4.2 Task Tracker

**Purpose:** Track work from creation to completion, using GitHub Issues as a workflow reference.

Potential MVP capabilities:

- Create, view, edit, and archive/delete tasks
- Task title and description
- Status, such as **Todo**, **In Progress**, and **Done**
- Priority
- Due date, if useful
- Search and filter tasks
- Created and updated timestamps

Possible later capabilities:

- Labels, comments, checklists, attachments
- Projects or milestones
- Kanban board
- Links between tasks and notes
- Activity history

### 4.3 Time In / Time Out

**Purpose:** Record the start and end of a work session.

Potential MVP capabilities:

- Clock in
- Clock out
- Show the current session state
- Store date and time for each entry
- View past entries
- Calculate session duration
- Handle missing clock-outs and corrections deliberately

Decisions still to make:

- Whether to support multiple sessions in one day
- Whether entries can be edited manually
- Whether breaks are tracked
- Whether this is strictly personal time tracking or may later support team attendance

## 5. Product Principles

- **Personal first:** Optimize for one person's daily workflow before adding team complexity.
- **Fast capture:** Recording a thought, task, or work session should take minimal effort.
- **Clear by default:** Use straightforward navigation, readable layouts, and predictable interactions.
- **Useful over bloated:** Add features when they solve a real need.
- **Expandable:** Keep the initial design modular so new capabilities can be introduced later.
- **User-owned workflow:** Avoid forcing users into a rigid project-management methodology.

## 6. Initial Navigation Concept

A simple first version could use these main areas:

1. **Dashboard** — quick overview of today's tasks, recent notes, and current time-tracking status.
2. **Notes** — browse, search, and manage notes.
3. **Tasks** — manage tasks and their statuses.
4. **Time** — clock in/out and review time entries.
5. **Settings** — preferences and basic account or workspace settings, if needed.

Keep the MVP navigation small. More sections can be introduced as the product grows.

## 7. Possible Future Expansion

These are ideas, not MVP commitments:

- Projects and workspaces
- Calendar and planning views
- Task-to-note linking
- Focus sessions and time estimates
- Reports and productivity analytics
- Reminders and recurring tasks
- File and attachment support
- Integrations with GitHub, calendars, or automation platforms
- AI-assisted note summaries, task breakdowns, and search
- Customizable modules and workflows

## 8. High-Level Data Concepts

The initial domain may include:

- **Note** — title, content, timestamps, and optional tags
- **Task** — title, description, status, priority, optional due date, and timestamps
- **TimeEntry** — start time, end time, duration, date, and optional note
- **User / Workspace** — only if authentication or multi-workspace support is needed

These are conceptual entities, not a finalized database schema. The implementation should account for time zones, validation, and reliable timestamps.

## 9. Suggested Development Phases

### Phase 1 — Foundation

- Choose the application stack and deployment approach
- Establish the project structure and coding conventions
- Define the core data model
- Implement navigation and the basic dashboard shell

### Phase 2 — Core Features

- Implement notes CRUD and search
- Implement task CRUD, statuses, and filters
- Implement clock-in/clock-out and time-entry history

### Phase 3 — Polish

- Add validation and useful empty states
- Handle errors and edge cases
- Improve responsive layouts and keyboard usability
- Add tests for core workflows
- Review privacy and data backup needs

### Phase 4 — Expansion

- Prioritize additions based on actual usage
- Add integrations or automation only when they provide clear value

## 10. Open Questions

- Is ATOM intended to be local-first, web-based, or both?
- Will it be single-user initially, or require authentication from day one?
- Which technology stack will be used?
- Should the task tracker be a list, a Kanban board, or both?
- What rules should apply to time corrections, breaks, and missed clock-outs?
- Is synchronization across devices required for the first release?
- Should notes and tasks be linkable in the MVP?

## 11. Initial Definition of Done

The MVP is ready for personal use when a user can:

- Create and find a note
- Create a task and move it through its statuses
- Clock in and clock out
- Review previous time entries and their durations
- Navigate between all three features without confusion
- Reliably retain data after refreshing or reopening the app

## 12. Product Summary

**ATOM is a minimal, expandable personal workspace built around three essential elements: notes, tasks, and time.** It starts as a practical daily tool and can grow into a broader personal operating system as new needs emerge.
