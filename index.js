import {
  getHTML,
  getClubStats,
  getAthleteStats,
  getProStats
} from "./lib/scraper";
import { get } from "https";

async function ScrapeData() {
  const mileClubPromise = getHTML("/clubs/473964");
  const jimPromise = getHTML("/pros/1635688");
  const sagePromise = getHTML("/pros/1595767");
  const timPromise = getHTML("/athletes/11205099");
  const mattPromise = getHTML("/athletes/6037601");

  const [mileHTML, jimHTML, sageHTML, timHTML, mattHTML] = await Promise.all([
    mileClubPromise,
    jimPromise,
    sagePromise,
    timPromise,
    mattPromise
  ]);

  const [mileFollowers, jimFollowers, mattFollowers] = await Promise.all([
    getClubStats(mileHTML),
    getProStats(jimHTML),
    getAthleteStats(mattHTML)
  ]);

  //   console.log(
  //     `The club has ${mileFollowers} members and Jim has ${
  //       jimFollowers.followersCount
  //     }`
  //   );
}

ScrapeData();
