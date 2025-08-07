import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { Task } from "../types/task";

const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    layoutsDir: path.resolve(__dirname, "./views/"),
    defaultLayout: false,
  } as any,
  viewPath: path.resolve(__dirname, "./views"),
  extName: ".hbs",
};

emailTransporter.use("compile", hbs(handlebarOptions));

const sendEmail = async (name: string, tasks: Task[], stringDayOfWeek: string) => {
  const emailConfig = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: process.env.EMAIL_SUBJECT || "Tarefas do Dia",
    template: "email",
    context: {
      name: name,
      tasks: tasks,
      dayOfWeek: stringDayOfWeek,
    },
  };

  try {
    await emailTransporter.sendMail(emailConfig);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const email = {
  sendEmail,
};
