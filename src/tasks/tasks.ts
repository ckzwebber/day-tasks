import database from "../database/database";
import { Task } from "../types/task";

export const getTasks = async (dayOfWeekNum: number): Promise<Task[]> => {
  const dayStrings = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  const day = dayStrings[dayOfWeekNum];
  const query = `SELECT * FROM tasks WHERE day_of_week = $1`;
  const result = await database.query({ text: query, values: [day] });
  return result.rows;
};
