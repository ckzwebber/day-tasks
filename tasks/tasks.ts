import database from "../database/database";
import { Task } from "../types/task";

export const getTasks = async (dayOfWeek: number): Promise<Task[]> => {
  const query = `SELECT * FROM tasks WHERE day_of_week = $1`;
  const result = await database.query({ text: query, values: [dayOfWeek] });
  return result.rows;
};
