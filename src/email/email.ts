import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { create } from "express-handlebars";
import { Task } from "../types/task";
import dotenv from "dotenv";
dotenv.config();

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const viewEngine = create({
  extname: ".hbs",
  layoutsDir: path.resolve(__dirname, "./views/"),
  partialsDir: path.resolve(__dirname, "./views/"),
  defaultLayout: false,
});

const handlebarOptions = {
  viewEngine: viewEngine,
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
