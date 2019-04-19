import axios from "axios";
import cheerio from "cheerio";

async function getHTML(url) {
  const { data: html } = await axios.get(`https://www.strava.com${url}`);
  return html;
}

async function getClubStats(html) {
  const $ = cheerio.load(html);
  const clubStr = $("h3, .club-members section").text();

  const members = parseInt(clubStr.split(" ")[0]);
  const clubName = $("div .avatar.avatar-club.avatar-xl.image-only").attr(
    "title"
  );

  return members;
}

async function getAthleteStats(html) {
  //Gets Following and Followers
  const $ = cheerio.load(html);

  const {
    reactProps: {
      athlete: { name, followersCount, followingCount }
    }
  } = $('div[data-react-class="AthleteProfileApp"]').data();

  return { name, followersCount, followingCount };
}

async function getProStats(html) {
  //Gets Following and Followers
  const $ = cheerio.load(html);
  const followStats = [];
  $("div .section.connections > ul > li > a").each(
    (i, elem) => (followStats[i] = $(elem).text())
  );
  const name = $("div .spans5")
    .first()
    .find("h1")
    .text();

  const [followingCount, followersCount] = followStats;

  return { name, followingCount, followersCount };
}

export async function getClubCount() {
  //1609 pod
  const html = await getHTML("/clubs/473964");
  const mileClubCount = await getClubStats(html);

  return mileClubCount;
}

export { getHTML, getClubStats, getAthleteStats, getProStats };
