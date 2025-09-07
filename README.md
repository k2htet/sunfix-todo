Task Management Application
A modern, full-stack task management application built with the T3 stack. demonstrating proficiency in modern state management, full-stack API integration, clean component architecture, and advanced UI/UX best practices.

✨ Features
This application implements a comprehensive set of features for a robust task management experience.

Core Task Operations (CRUD)
Create Tasks: Add new tasks with detailed attributes through an intuitive drawer form.

Read/Display Tasks: View all tasks in a clean, sortable list.

Update Tasks:

Toggle task completion status.

Edit task text, priority, status, and due dates.

Delete Tasks:

Delete individual tasks.

A Bulk Delete option to remove multiple selected tasks at once.

Enhanced Task Attributes
Status Tracking: Assign a status to each task (Todo, In Progress, Done) using a dropdown selector.

Priority System: Set a priority level (Low, Medium, High) with clear visual indicators (badges).

Due Dates:

Integrate a date picker to set deadlines for tasks.

Visual indicators (e.g., red border) automatically appear for overdue tasks.

Advanced Functionality
Drag-and-Drop Reordering:

Intuitively reorder tasks by dragging and dropping them within the list.

The new order is persisted in the database, ensuring the user's layout is saved.

Undo/Redo Functionality:

A full action history stack tracks user actions like creating and deleting tasks.



Task Selection:

Select multiple tasks using checkboxes.

A "Select All" option for efficient bulk operations.

🛠️ Tech Stack
This project leverages a modern, type-safe, and efficient tech stack to deliver a high-quality user experience.

Framework: Next.js (React)

Styling: Tailwind CSS

UI Components: Shadcn/UI

API Layer: tRPC

Database: Neon (Serverless Postgres)

ORM: Drizzle ORM

Authentication: Better Auth

Client State Management: TanStack Query (React Query)

Client-side History Management: Zustand

Drag & Drop: dnd-kit

Form Management: React Hook Form with Zod for validation

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js (v18 or later)

bun (or your preferred package manager)

A Neon database instance

Installation
Clone the repository:

git clone https://github.com/k2htet/sunfix-todo.git
cd your-repo-name

Install dependencies:

bun install

Set up environment variables:
Create a .env file in the root of the project and add your database connection string and other required credentials.

# I will delete env var in next week.

# Neon Database URL

DATABASE_URL="postgresql://neondb_owner:npg_KjLXqg0HzaE9@ep-damp-block-a1ci4dwm-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Better Auth

BETTER_AUTH_SECRET="WyqwZwMUdv8UMWzkdQC1ME1uV4gsvEzu"
BETTER_AUTH_URL="http://localhost:3000"

# Google

GOOGLE_CLIENT_ID="1033287146872-g0m05tl6rm6k4eof5b2geafmbojtt04l.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"

Push the database schema:
Apply the Drizzle schema to your Neon database.

Run the development server:

bun run dev

The application should now be running on http://localhost:3000.
