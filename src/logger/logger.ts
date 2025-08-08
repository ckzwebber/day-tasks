import pino from "pino";

const transport = pino.transport({
  target: "pino-loki",
  options: {
    batching: true,
    interval: 5,
    host: process.env.LOKI_HOST || "http://localhost:3100",
    basicAuth: {
      username: "",
      password: "",
    },
    labels: { app: "day-tasks", env: process.env.NODE_ENV || "dev" },
    propsToLabels: ["level"],
  },
});

export const logger = pino(transport);
