import { getHTML, getClubStats, getAthleteStats } from "./lib/scraper";
import { get } from "https";

async function ScrapeData() {
  //const html = await getHTML("https://www.strava.com/clubs/473964");
  //const clubMembers = await getClubStats(html);
  const html = await getHTML("https://www.strava.com/athletes/11205099");

  const ath = await getAthleteStats(html);

  //console.log(`The club has ${clubMembers} members`);
}

ScrapeData();
