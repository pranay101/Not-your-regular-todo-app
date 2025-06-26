import Database from "better-sqlite3";
import path from "node:path";
import { app } from "electron";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const statuses = ["pending", "in-progress", "completed"];

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

function generateRandomDate(startDate: Date, endDate: Date): string {
  const timeDiff = endDate.getTime() - startDate.getTime();
  const randomTime = startDate.getTime() + Math.random() * timeDiff;
  const randomDate = new Date(randomTime);
  return randomDate.toISOString().split("T")[0]; // YYYY-MM-DD format
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDummyData() {
  // Initialize database
  const dbPath = path.join(__dirname, "..", "app.db");
  const db = new Database(dbPath);

  console.log("🗄️  Connected to database:", dbPath);

  // Calculate date range (5 months back from today)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);

  console.log(
    `📅 Generating data from ${startDate.toISOString().split("T")[0]} to ${
      endDate.toISOString().split("T")[0]
    }`
  );

  // Generate todos
  const todoCount = 150; // Generate 150 todos over 5 months
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
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as {
    count: number;
  };

  if (userCount.count === 0) {
    console.log("👤 Creating default user...");
    const stmt = db.prepare(
      "INSERT INTO users (name, email, avatar, timezone, theme, onboarding_completed) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run("Demo User", "demo@example.com", "👤", "UTC", "dark", true);
  }

  // Display summary
  const finalTodoCount = db
    .prepare("SELECT COUNT(*) as count FROM todos")
    .get() as { count: number };
  const finalNoteCount = db
    .prepare("SELECT COUNT(*) as count FROM notes")
    .get() as { count: number };
  const finalUserCount = db
    .prepare("SELECT COUNT(*) as count FROM users")
    .get() as { count: number };

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
  sampleTodos.forEach((todo: any, index: number) => {
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
  sampleNotes.forEach((note: any, index: number) => {
    const preview =
      note.content.substring(0, 100) + (note.content.length > 100 ? "..." : "");
    console.log(`   ${index + 1}. ${preview}`);
  });

  db.close();
  console.log("\n🔒 Database connection closed.");
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    generateDummyData();
  } catch (error) {
    console.error("❌ Error generating dummy data:", error);
    process.exit(1);
  }
}

generateDummyData();
