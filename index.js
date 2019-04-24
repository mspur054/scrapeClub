import express from "express";
import db from "./lib/db";
import { uniqueCount } from "./lib/utils";
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

app.get("/data", async (req, res, next) => {
  const mileClubRef = db.collection("mileclub");
  var mileClub = await mileClubRef
    .orderBy("date", "desc")
    .limit(100)
    .get()
    .then(function(querySnapshot) {
      return querySnapshot.docs.map(doc => doc.data());
    })
    .catch(function(err) {
      console.log("Error getting cached collection", error);
    });

  const uniqueMileClub = uniqueCount(mileClub);

  res.json({ uniqueMileClub });
});

app.listen(process.env.PORT, () => console.log("running on port 2066"));
