import express from "express";
import db from "./lib/db";
import {
  getHTML,
  getClubCount,
  getAthleteStats,
  getProStats,
  runCron
} from "./lib/scraper";
import "./lib/cron";

const app = express();

app.get("/scrape", async (req, res, next) => {
  console.log("scraping!!");
  const jimPromise = getHTML("/pros/1635688");
  const sagePromise = getHTML("/pros/1595767");
  const timPromise = getHTML("/athletes/11205099");
  const mattPromise = getHTML("/athletes/6037601");
  const cClubCount = await getClubCount();

  const [jimHTML, sageHTML, timHTML, mattHTML] = await Promise.all([
    jimPromise,
    sagePromise,
    timPromise,
    mattPromise
  ]);

  const [
    jimFollowers,
    sageFollowers,
    timFollowers,
    mattFollowers
  ] = await Promise.all([
    getProStats(jimHTML),
    getProStats(sageHTML),
    getAthleteStats(timHTML),
    getAthleteStats(mattHTML)
  ]);

  runCron();

  res.json({ jimFollowers, sageFollowers, mattFollowers, timFollowers });
});

app.listen(2066, () => console.log("running on port 2066"));
