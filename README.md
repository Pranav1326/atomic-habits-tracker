# Atomic Habits Tracker

A production-ready habit tracking application built with React 18, TypeScript, Vite, and TailwindCSS. Features a GitHub-style contribution graph, per-habit heatmaps, streak tracking, and a statistics dashboard.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — fast dev server and build
- **TailwindCSS** — utility-first dark-theme styling
- **React Router v6** — client-side routing
- **Zustand** — lightweight global state management
- **Axios** — HTTP client with interceptors
- **React Calendar Heatmap** — GitHub-style contribution graph
- **Recharts** — bar charts for statistics
- **Day.js** — lightweight date handling
- **React Hot Toast** — toast notifications

## Project Structure

```
src/
  api/
    axios.ts          # Axios instance + interceptors
    habits.ts         # Habits API calls
    entries.ts        # Entries API calls
  components/
    layout/
      Layout.tsx      # App shell with sidebar + mobile header
      Sidebar.tsx     # Desktop navigation sidebar
    heatmap/
      MainHeatmap.tsx # GitHub-style all-habits contribution graph
      HabitHeatmap.tsx# Per-habit colored heatmap
      DayModal.tsx    # Click-a-day modal to toggle habits
    habit/
      HabitCard.tsx   # Habit card with edit/delete/heatmap
      HabitForm.tsx   # Create/edit habit form
      ColorPicker.tsx # Preset + custom color picker
    ui/
      Modal.tsx       # Reusable modal dialog
      Button.tsx      # Variant button component
      Input.tsx       # Form input
      Textarea.tsx    # Form textarea
      Badge.tsx       # Colored badge/chip
      ProgressBar.tsx # Animated progress bar
      StatCard.tsx    # Metric display card
      LoadingSpinner.tsx
  pages/
    Dashboard.tsx     # Heatmap + today's habits + streak stats
    Habits.tsx        # Manage habits (CRUD)
    Statistics.tsx    # Streaks + bar chart + completion table
  store/
    habitStore.ts     # Zustand store for habits
    entryStore.ts     # Zustand store for entries + contributions
  utils/
    date.ts           # Day.js date helpers
    streak.ts         # Streak calculation logic
  types/
    habit.ts          # Habit + payload types
    entry.ts          # Entry + contribution types
  App.tsx             # Router setup + Toaster
  main.tsx            # React DOM entry
  index.css           # Tailwind directives + scrollbar styles
```

## Setup

### Prerequisites

- Node.js 18+
- A running backend API (see API section below)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd atomic-habits-tracker

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API URL
# VITE_API_BASE_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run preview
```

### Type Checking

```bash
npm run type-check
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

## API Endpoints (Backend)

The frontend expects the following REST API:

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/habits` | List all habits |
| POST | `/habits` | Create a habit |
| GET | `/habits/:id` | Get habit by ID |
| PUT | `/habits/:id` | Update habit |
| DELETE | `/habits/:id` | Delete habit |

### Entries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/entries/daily/:date` | Get all entries for a date (`YYYY-MM-DD`) |
| GET | `/entries/contributions` | Get clean-day contribution data for 1 year |
| GET | `/entries/contributions/:habitId` | Get per-habit contribution data |
| POST | `/entries/:habitId` | Log an entry for today |
| PUT | `/entries/day/:date` | Bulk update entries for a date |

## Features

### Dashboard
- GitHub-style contribution heatmap (green = all habits completed)
- Today's habit checklist
- Streak stats: current, longest, total clean days
- Click any heatmap square to open the day modal

### Day Modal
- Toggle each habit's completion status
- Visual indicator when all habits are done (clean day)
- Saves via bulk update endpoint

### Habits Page
- Create, edit, delete habits
- Each card shows: streak, frequency badge, completion percentage
- Expandable per-habit heatmap with habit's color

### Statistics Page
- Current & longest streak
- Total clean days
- Bar chart of completion rates per habit
- Detailed table with completed days count

## Design Decisions

- **Dark theme by default** via Tailwind's `darkMode: 'class'` with `dark` class on `<html>`
- **Optimistic store updates** — habits update in UI immediately on create/edit/delete
- **Axios response interceptors** — handle 401 (session expiry), 500 (server errors), and show toasts
- **Clean day logic** — a day is "clean" only when every existing habit has a `completed: true` entry; this logic lives in the backend contributions endpoint
- **No `any` types** — fully typed throughout
# atomic-habits-tracker
