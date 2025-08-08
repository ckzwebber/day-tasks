import { Task } from "./types/task";
import { email } from "./email/email";
import { getTasks } from "./tasks/tasks";
import { weekday } from "./types/weekday";
import { logger } from "./logger/logger";
import cron from "node-cron";

const main = async () => {
  const requiredEnvs = ["PGUSER", "PGPASSWORD", "PGHOST", "PGPORT", "PGDATABASE", "EMAIL_USER", "EMAIL_PASS", "EMAIL_FROM", "EMAIL_TO"];
  for (const key of requiredEnvs) {
    if (!process.env[key]) {
      logger.error({ action: "missing_env", variable: key }, "Missing environment variable");
      process.exit(1);
    }
  }

  const dayOfWeek = new Date().getDay();

  try {
    logger.info({ action: "fetch_tasks", dayOfWeek }, "Buscando tarefas do dia");

    const todayTasks: Task[] = await getTasks(dayOfWeek);

    logger.info({ action: "tasks_fetched", count: todayTasks.length }, "Tarefas obtidas");

    const stringDayOfWeek = weekday.get(dayOfWeek);
    if (!stringDayOfWeek) {
      logger.error({ action: "invalid_day_of_week", dayOfWeek }, "Invalid day of the week");
      throw new Error("Invalid day of the week");
    }

    await email.sendEmail("Webber", todayTasks, stringDayOfWeek);
    logger.info({ action: "email_sent", recipient: process.env.EMAIL_TO, count: todayTasks.length }, "Email enviado com sucesso");
  } catch (error) {
    logger.error({ action: "main_error", error: (error as Error).message }, "Erro na função principal");
    throw error;
  }
};

main();

cron.schedule("0 5 * * *", () => main(), {
  timezone: "America/Sao_Paulo",
});

logger.info({ action: "app_start" }, "Scheduler started. It will run every day at 5 AM.");
