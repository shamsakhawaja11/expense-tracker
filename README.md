# Expense Tracker

A simple offline expense tracker built with React Native CLI, TypeScript, and SQLite. All data is stored on the device, so it works with no internet connection.

I built this project to learn SQLite properly, so it uses raw SQL queries with no ORM and no UI component libraries.

## Features

- Add, edit, and delete expenses
- View expenses sorted newest first
- Filter by category
- Monthly totals using SQL `SUM` and `GROUP BY`
- Fully offline, data stays on the device

## Tech Stack

- React Native CLI (bare workflow)
- TypeScript
- SQLite via `react-native-sqlite-storage`
- Plain React Native components only

## Architecture

```
src/
  types/          Shared TypeScript types
  database/       Connection and migrations
  repositories/   All SQL queries live here
  screens/        App screens
  components/     Small reusable components
```

Screens never write SQL directly. They call the repository, and the repository talks to the database.

## Key Design Decisions

- **Money is stored as integers** (paisa, not decimals) to avoid floating point errors.
- **Dates are stored as ISO strings**, which sort correctly and make monthly grouping easy.
- **Row mapping:** database rows (`snake_case`) are mapped to app types (`camelCase`) in the repository layer.
- **Migrations** track the schema version so the database can evolve safely.

## Getting Started

```bash
git clone <your-repo-url>
cd ExpenseTracker
npm install
npx react-native run-android
```

## Roadmap

- [ ] Database setup and migrations
- [ ] Expense repository (CRUD)
- [ ] Expense list screen
- [ ] Add/edit screen
- [ ] Category filter
- [ ] Monthly summary

## Author

Your Name