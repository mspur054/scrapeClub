import cron from "node-cron";
import { runCron } from "./scraper";

cron.schedule("*/5 * * * *", () => {
  console.log("RUNNING CRON");
  runCron();
});