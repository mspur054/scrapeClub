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

  const data = { clubName, members };
  console.log(data);
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

  console.log(name, followersCount, followingCount);
}

async function getProStats(html) {
  //Gets Following and Followers
  const $ = cheerio.load(html);
  const followStats = [];
  $("div .section.connections > ul > li > a").each(
    (i, elem) => (followStats[i] = $(elem).text())
  );

  const [followingCount, followersCount] = followStats;

  return { followingCount, followersCount };
}

export { getHTML, getClubStats, getAthleteStats, getProStats };
