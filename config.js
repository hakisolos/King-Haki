const { Sequelize } = require("sequelize");
const fs = require("fs");
require("dotenv").config();
const toBool = (x) => x === "true";
const DATABASE_URL = process.env.DATABASE_URL || "./assets/database.db";
module.exports = {
  ANTILINK: toBool(process.env.ANTI_LINK) || false,
  LOGS: toBool(process.env.LOGS) || true,
  ANTILINK_ACTION: process.env.ANTI_LINK || "kick",
  SESSION_ID: process.env.SESSION_ID || "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUUxMbC9zTHBLeis1UndGaWdObVN1Wmk0YXdCcjYzcDRQZjhnOHZ4aDgwQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNGF0YWVGNTZXdngzOEVCaXNGWWZwMEp0WmV5SWpVajE2Wk0vcEk3am1BRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2RVRoN3dhZ1VBSVNERDh5WVdSeUdGbUFuZEJTYi96S1diSFZhSHFuNm13PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ5VkMwcDVvL01rV2FEVXo4T1JTTzJHRk9FZVpqZGxaYTN5RGdwdEx1SGo4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1FTDZqMWJxbFg3azQyTVY5THZydDB0d1k0cW1FQXVYRWFUUXJHbSt5MXM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNhQVp4OUpMOVpMWnc2NkZ0MGxxOFg3b1RsNmxGbVJMNGIyYnc3VklWaUE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicVB3L1pEQXR0Vmp3TnRHZ1dTem1WZCtPYkpyWk9yLzF5ZERRZ0JhUU4zYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV01VV09POXprK0tUM29PWE44bVlLelR1emw1dW80VHh3NXYwVElPN0xHOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFhM0RIK3J5VE9ZOE8wbGczOWNBRUdFSHlxaDVqYm9sYVdIb3p5ME0wYzVXK0RPbExWcG1WRTVGNE5zL0wrWUJrNFNNV3VYb1dNa05Ibm5SQisya0FnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjE0LCJhZHZTZWNyZXRLZXkiOiJ3Z3JoVnRzbkhDakJmL0t1TnYzOTVNbklBSTVNVzNFY2lKYmRHa3prWGEwPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6NjEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo2MSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiI5Vk95RUZmdFJHbWNSelVxMjYtTTVBIiwicGhvbmVJZCI6IjcxNGQ3OTk1LWRiMTEtNGU0Mi04MTM2LTNlM2QzYzdhYjFmZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJMbEdtZzYweURWZXFUMUxEM3YyK1pBK0FUUnc9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUUxhcWdqcHpEYmVYWmFVRXJOeWJBd1crL1FJPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ik1INVgxUlpNIiwibWUiOnsiaWQiOiIyMzQ5MTEyMTcxMDc4OjhAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiS0lORyBIQUtJ4a2EQ0VMRVNUSUFMIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNJVHQ3OXdGRUlXVThMY0dHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiI0dzcwdlE4NVp1Mi96WDZnUVVrRDdLR3VlOGxGMlJTb0pNOWJFUm9HckZjPSIsImFjY291bnRTaWduYXR1cmUiOiJHYVc2WGVUTldkdTlCaldad2tQci9TcnVHalpsemdPajFjd2xVVnhBQlVmdStocW1qQWV6eGRaK0h5VWZiZnNhMmU0WC9hSnVOUVpORjA3OE5JZUlDQT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiMnJqV2ZibUFJc2cxVW1iTE1lNU1HNWp4RmRkQUxFN1pFRnhJZkF6NzJEaTJpUDRNVmY3RWNlR3BlWFhSbUVxY1BoS3RiVnNxRWFYd1JwbmdtZ2pkQlE9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyMzQ5MTEyMTcxMDc4OjhAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZU1POUwwUE9XYnR2ODErb0VGSkEreWhybnZKUmRrVXFDVFBXeEVhQnF4WCJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyNzc5MzY4MywibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFKSzUifQ==",
  LANG: process.env.LANG || "EN",
  AUTH_TOKEN: "",
  HANDLERS:
    process.env.HANDLER === "false" || process.env.HANDLER === "null"
      ? "^"
      : "[.]",
  RMBG_KEY: process.env.RMBG_KEY || false,
  BRANCH: "main",
  WARN_COUNT: 3,
  PACKNAME: process.env.PACKNAME || "X-Asena",
  WELCOME_MSG: process.env.WELCOME_MSG || "yo @user Welcome to @gname\n =======  || powered by HAKI ||=======",
  GOODBYE_MSG: process.env.GOODBYE_MSG || "yo @user It was Nice Seeing you\n =======  || powered by HAKI ||=======",
  AUTHOR: process.env.AUTHOR || "HAKI",
  SUDO:
    process.env.SUDO || "2349112171078",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  OWNER_NAME: process.env.OWNER_NAME || "HAKI",
  HEROKU: toBool(process.env.HEROKU) || false,
  BOT_NAME: process.env.BOT_NAME || "KING-HAKI MD",
  AUTO_READ: toBool(process.env.AUTO_READ) || false,
  AUTO_STATUS_READ: toBool(process.env.AUTO_STATUS_READ) || false,
  PROCESSNAME: process.env.PROCESSNAME || "x-asena",
  WORK_TYPE: process.env.WORK_TYPE || "private",
  SESSION_URL: process.env.SESSION_URL || "",
  DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
  DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || false,
  REMOVEBG: process.env.REMOVEBG || false,
  DATABASE_URL: DATABASE_URL,
  STATUS_SAVER: toBool(process.env.STATUS_SAVER) || true,
  DATABASE:
    DATABASE_URL === "./assets/database.db"
      ? new Sequelize({
          dialect: "sqlite",
          storage: DATABASE_URL,
          logging: false,
        })
      : new Sequelize(DATABASE_URL, {
          dialect: "postgres",
          ssl: true,
          protocol: "postgres",
          dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
          },
          logging: false,
        }),
};
