import { Task } from "./types/task";
import { email } from "./email/email";
import { getTasks } from "./tasks/tasks";
import { weekday } from "./types/weekday";
import cron from "node-cron";

const main = async () => {
  const requiredEnvs = ["PGUSER", "PGPASSWORD", "PGHOST", "PGPORT", "PGDATABASE", "EMAIL_USER", "EMAIL_PASS", "EMAIL_FROM", "EMAIL_TO"];
  for (const key of requiredEnvs) {
    if (!process.env[key]) {
      console.error(`⚠️ Missing env var: ${key}`);
      process.exit(1);
    }
  }

  const dayOfWeek = new Date().getDay();

  try {
    const todayTasks: Task[] = await getTasks(dayOfWeek);
    const stringDayOfWeek = weekday.get(dayOfWeek);
    if (!stringDayOfWeek) {
      throw new Error("Invalid day of the week");
    }

    await email.sendEmail("Webber", todayTasks, stringDayOfWeek);
  } catch (error) {
    console.error("Error in main function:", error);
    throw error;
  }
};

cron.schedule("0 5 * * *", () => main(), {
  timezone: "America/Sao_Paulo",
});

console.log("Scheduler started. It will run every day at 5 AM.");
