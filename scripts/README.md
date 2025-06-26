# Scripts Directory

This directory contains utility scripts for the Not Your Regular Todo App.

## Generate Dummy Data

The `generate-dummy-data.js` script creates 5 months of realistic dummy data for testing and development purposes.

### What it generates:

- **150 todos** with realistic titles, descriptions, priorities, and statuses
- **50 notes** with various content types (meeting notes, project ideas, personal reflections, etc.)
- **1 default user** (if no user exists)
- Data spread across the last 5 months with random dates

### How to use:

1. **First, run the app once** to create the database:

   ```bash
   npm run dev
   ```

   (You can close it after it starts)

2. **Generate the dummy data**:

   ```bash
   npm run generate-data
   ```

   Or run directly:

   ```bash
   node scripts/generate-dummy-data.js
   ```

### Sample output:

```
🗄️  Looking for database at: C:\Users\username\AppData\Roaming\not-your-regular-todo-app\app.db
✅ Connected to database: C:\Users\username\AppData\Roaming\not-your-regular-todo-app\app.db
📅 Generating data from 2024-01-15 to 2024-06-15
📋 Found tables: todos, notes, users
📝 Generating 150 todos...
📔 Generating 50 notes...
👤 Creating default user...

✅ Dummy data generation completed!
📊 Summary:
   • Todos: 150
   • Notes: 50
   • Users: 1

📋 Sample todos:
   1. Complete project presentation (high priority, completed) - 2024-03-22
   2. Review quarterly reports (medium priority, in-progress) - 2024-05-10
   3. Schedule team meeting (low priority, pending) - 2024-04-15
   4. Fix critical bug (high priority, completed) - 2024-02-28
   5. Update documentation (medium priority, pending) - 2024-06-01

📝 Sample notes:
   1. Meeting Notes - Team Sync
• Discussed Q4 goals and priorities
• Need to finalize budget allocation...
   2. Project Ideas
• Mobile app for task management
• AI-powered productivity assistant...
   3. Daily Reflection
• Completed 3 major tasks today
• Need to improve time management...

🔒 Database connection closed.
```

### Database locations:

The script automatically detects the database location:

- **Development**: `./app.db` (in project root)
- **Production**: User data directory based on OS:
  - Windows: `%APPDATA%/not-your-regular-todo-app/app.db`
  - macOS: `~/Library/Application Support/not-your-regular-todo-app/app.db`
  - Linux: `~/.config/not-your-regular-todo-app/app.db`

### Troubleshooting:

- **"Database file not found"**: Run the app first with `npm run dev` to create the database
- **"No tables found"**: The app needs to be started at least once to create the database schema
- **Permission errors**: Make sure you have write access to the database directory

### Data characteristics:

- **Todos**: Mix of work-related tasks with varied priorities and completion statuses
- **Notes**: Diverse content including meeting notes, personal reflections, project ideas, and goal tracking
- **Dates**: Randomly distributed across the last 5 months
- **Realistic content**: Based on common productivity app usage patterns
