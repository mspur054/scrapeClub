import {
  getHTML,
  getClubStats,
  getAthleteStats,
  getProStats
} from "./lib/scraper";
import { get } from "https";

async function ScrapeData() {
  //const html = await getHTML("https://www.strava.com/clubs/473964");
  //const clubMembers = await getClubStats(html);
  const html = await getHTML("https://www.strava.com/pros/1635688");
  //Tim 11205099
  //Sage

  // const ath = await getAthleteStats(html);
  const prop = await getProStats(html);
  //console.log(`The club has ${clubMembers} members`);
}

ScrapeData();
