import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Starting dummy data generation script...");

// Sample data arrays
const todoTitles = [
  "Complete project presentation",
  "Review quarterly reports",
  "Schedule team meeting",
  "Update documentation",
  "Fix critical bug",
  "Prepare for client call",
  "Code review for feature branch",
  "Update dependencies",
  "Write unit tests",
  "Deploy to staging",
  "Backup database",
  "Update user manual",
  "Plan next sprint",
  "Review pull requests",
  "Update website content",
  "Test new feature",
  "Optimize performance",
  "Security audit",
  "Update API documentation",
  "Monitor system logs",
  "Create backup strategy",
  "Update privacy policy",
  "Review analytics data",
  "Plan team building event",
  "Update onboarding process",
  "Review budget allocation",
  "Prepare status report",
  "Update disaster recovery plan",
  "Review vendor contracts",
  "Plan infrastructure upgrade",
];

const todoDescriptions = [
  "Prepare slides and rehearse presentation for stakeholders",
  "Analyze Q3 performance metrics and identify trends",
  "Coordinate with team members for weekly sync",
  "Update technical documentation for new features",
  "Investigate and resolve production issue",
  "Review agenda and prepare talking points",
  "Review code changes and provide feedback",
  "Check for security vulnerabilities and compatibility",
  "Ensure adequate test coverage for new functionality",
  "Verify deployment process and monitor logs",
  "Create automated backup verification process",
  "Include new features and user feedback",
  "Define goals and allocate resources",
  "Ensure code quality and best practices",
  "Refresh content and improve SEO",
  "Validate functionality across different scenarios",
  "Identify bottlenecks and implement improvements",
  "Review access controls and security measures",
  "Document new endpoints and usage examples",
  "Check for errors and performance issues",
  "Define backup frequency and retention policy",
  "Ensure compliance with latest regulations",
  "Generate insights and recommendations",
  "Organize team activities and logistics",
  "Streamline new hire integration process",
  "Review spending and identify cost savings",
  "Summarize progress and next steps",
  "Test recovery procedures and update documentation",
  "Evaluate current agreements and negotiate terms",
  "Plan hardware and software upgrades",
];

const priorities = ["high", "medium", "low"];
const statuses = ["pending", "done"];

const noteContents = [
  "Meeting Notes - Team Sync\n• Discussed Q4 goals and priorities\n• Need to finalize budget allocation\n• Planning team building event for next month\n• New hire onboarding process needs updates",

  "Project Ideas\n• Mobile app for task management\n• AI-powered productivity assistant\n• Integration with calendar systems\n• Dark mode for better UX\n• Offline functionality",

  "Daily Reflection\n• Completed 3 major tasks today\n• Need to improve time management\n• Should delegate more effectively\n• Feeling productive and motivated\n• Tomorrow: focus on code reviews",

  "Learning Goals\n• Master React hooks and context\n• Learn TypeScript advanced features\n• Study system design patterns\n• Practice algorithm problems\n• Read latest tech articles",

  "Work-Life Balance\n• Set boundaries for work hours\n• Take regular breaks during the day\n• Exercise at least 30 minutes daily\n• Spend quality time with family\n• Pursue hobbies and interests",

  "Technical Debt\n• Refactor authentication system\n• Update deprecated libraries\n• Improve error handling\n• Optimize database queries\n• Add comprehensive logging",

  "Career Development\n• Attend industry conferences\n• Network with professionals\n• Contribute to open source\n• Build personal brand\n• Seek mentorship opportunities",

  "Health & Wellness\n• Drink 8 glasses of water daily\n• Get 7-8 hours of sleep\n• Practice mindfulness meditation\n• Eat healthy meals regularly\n• Take walking breaks",

  "Financial Planning\n• Review monthly expenses\n• Set aside emergency fund\n• Invest in retirement accounts\n• Track spending habits\n• Plan for major purchases",

  "Personal Goals\n• Read 2 books per month\n• Learn to play guitar\n• Travel to 3 new countries\n• Start a side project\n• Improve public speaking skills",
];

function generateRandomDate(startDate, endDate) {
  const timeDiff = endDate.getTime() - startDate.getTime();
  const randomTime = startDate.getTime() + Math.random() * timeDiff;
  const randomDate = new Date(randomTime);
  return randomDate.toISOString().split("T")[0]; // YYYY-MM-DD format
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDummyData() {
  console.log("🔍 Looking for database file...");

  // Try to find the database file
  let dbPath;
  let foundInProjectRoot = false;

  // Check if we're in development mode (look for app.db in current directory)
  const projectRootPath = path.join(process.cwd(), "app.db");
  if (fs.existsSync(projectRootPath)) {
    dbPath = projectRootPath;
    foundInProjectRoot = true;
    console.log("✅ Found database in project root:", dbPath);
  } else {
    console.log("❌ Database not found in project root:", projectRootPath);

    // Look for the database in the user data directory (typical Electron location)
    const platform = process.platform;
    let userDataPath;

    if (platform === "win32") {
      userDataPath = path.join(
        os.homedir(),
        "AppData",
        "Roaming",
        "not-your-regular-todo-app"
      );
    } else if (platform === "darwin") {
      userDataPath = path.join(
        os.homedir(),
        "Library",
        "Application Support",
        "not-your-regular-todo-app"
      );
    } else {
      userDataPath = path.join(
        os.homedir(),
        ".config",
        "not-your-regular-todo-app"
      );
    }

    dbPath = path.join(userDataPath, "app.db");
    console.log("🔍 Checking Electron user data directory:", dbPath);

    if (fs.existsSync(dbPath)) {
      console.log("✅ Found database in Electron user data directory:", dbPath);
    } else {
      console.log(
        "❌ Database not found in Electron user data directory:",
        dbPath
      );
      console.log("\n💡 The database file doesn't exist yet!");
      console.log("📋 To create the database, you need to:");
      console.log("   1. Run the app first: yarn dev");
      console.log("   2. Let it start up (this creates the database)");
      console.log("   3. Then run this script again: yarn generate-data");
      console.log("\n🔍 Checked locations:");
      console.log("   • Project root:", projectRootPath);
      console.log("   • Electron user data:", dbPath);
      return;
    }
  }

  console.log("🗄️  Connecting to database:", dbPath);

  try {
    const db = new Database(dbPath);
    console.log("✅ Successfully connected to database");

    // Calculate date range (5 months back from today)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);

    console.log(
      `📅 Generating data from ${startDate.toISOString().split("T")[0]} to ${
        endDate.toISOString().split("T")[0]
      }`
    );

    // Check if tables exist
    const tableCheck = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('todos', 'notes', 'users')"
      )
      .all();
    const existingTables = tableCheck.map((row) => row.name);

    console.log("📋 Found tables:", existingTables.join(", "));

    if (existingTables.length === 0) {
      console.log(
        "❌ No required tables found. Please run the app first to create the database schema."
      );
      console.log(
        "💡 Start the app with 'yarn dev' to initialize the database tables."
      );
      db.close();
      return;
    }

    // Generate todos
    const todoCount = 10000; // Generate 150 todos over 5 months
    console.log(`📝 Generating ${todoCount} todos...`);

    for (let i = 0; i < todoCount; i++) {
      const title = getRandomElement(todoTitles);
      const description = getRandomElement(todoDescriptions);
      const priority = getRandomElement(priorities);
      const status = getRandomElement(statuses);
      const date = generateRandomDate(startDate, endDate);

      const stmt = db.prepare(
        "INSERT INTO todos (title, description, status, priority, date) VALUES (?, ?, ?, ?, ?)"
      );
      stmt.run(title, description, status, priority, date);
    }

    // Generate notes
    const noteCount = 50; // Generate 50 notes over 5 months
    console.log(`📔 Generating ${noteCount} notes...`);

    for (let i = 0; i < noteCount; i++) {
      const content = getRandomElement(noteContents);
      const createdAt = generateRandomDate(startDate, endDate);
      const updatedAt = createdAt; // Initially same as created

      const stmt = db.prepare(
        "INSERT INTO notes (content, created_at, updated_at) VALUES (?, ?, ?)"
      );
      stmt.run(content, createdAt, updatedAt);
    }

    // Create a default user if none exists
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();

    if (userCount.count === 0) {
      console.log("👤 Creating default user...");
      const stmt = db.prepare(
        "INSERT INTO users (name, email, avatar, timezone, theme, onboarding_completed) VALUES (?, ?, ?, ?, ?, ?)"
      );
      stmt.run("Demo User", "demo@example.com", "👤", "UTC", "dark", true);
    } else {
      console.log("👤 User already exists, skipping user creation");
    }

    // Display summary
    const finalTodoCount = db
      .prepare("SELECT COUNT(*) as count FROM todos")
      .get();
    const finalNoteCount = db
      .prepare("SELECT COUNT(*) as count FROM notes")
      .get();
    const finalUserCount = db
      .prepare("SELECT COUNT(*) as count FROM users")
      .get();

    console.log("\n✅ Dummy data generation completed!");
    console.log(`📊 Summary:`);
    console.log(`   • Todos: ${finalTodoCount.count}`);
    console.log(`   • Notes: ${finalNoteCount.count}`);
    console.log(`   • Users: ${finalUserCount.count}`);

    // Show some sample data
    console.log("\n📋 Sample todos:");
    const sampleTodos = db
      .prepare(
        "SELECT title, priority, status, date FROM todos ORDER BY RANDOM() LIMIT 5"
      )
      .all();
    sampleTodos.forEach((todo, index) => {
      console.log(
        `   ${index + 1}. ${todo.title} (${todo.priority} priority, ${
          todo.status
        }) - ${todo.date}`
      );
    });

    console.log("\n📝 Sample notes:");
    const sampleNotes = db
      .prepare("SELECT content FROM notes ORDER BY RANDOM() LIMIT 3")
      .all();
    sampleNotes.forEach((note, index) => {
      const preview =
        note.content.substring(0, 100) +
        (note.content.length > 100 ? "..." : "");
      console.log(`   ${index + 1}. ${preview}`);
    });

    db.close();
    console.log("\n🔒 Database connection closed.");
  } catch (error) {
    console.error("❌ Error during database operations:", error.message);
    console.error("Full error:", error);
  }
}

generateDummyData();
