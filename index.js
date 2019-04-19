import { getHTML, getClubStats } from "./lib/scraper";

async function ScrapeData() {
  const html = await getHTML("https://www.strava.com/clubs/473964");
  const clubMembers = await getClubStats(html);

  console.log(`The club has ${clubMembers} members`);
}

ScrapeData();
