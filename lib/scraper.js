import axios from "axios";
import cheerio from "cheerio";
import db from "./db";

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

export async function runCron() {
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

  db.get("pros")
    .push(
      {
        date: Date.now(),
        name: jimFollowers.name,
        followingCount: jimFollowers.followingCount,
        followersCount: jimFollowers.followersCount
      },
      {
        date: Date.now(),
        name: sageFollowers.name,
        followingCount: sageFollowers.followingCount,
        followersCount: sageFollowers.followersCount
      }
    )
    .write();
  //club
  db.get("mileclub")
    .push({ date: Date.now(), count: cClubCount })
    .write();

  db.get("athletes")
    .push(
      {
        date: Date.now(),
        name: timFollowers.name,
        followersCount: timFollowers.followersCount,
        followingCount: timFollowers.followingCount
      },
      {
        date: Date.now(),
        name: mattFollowers.name,
        followersCount: mattFollowers.followersCount,
        followingCount: mattFollowers.followingCount
      }
    )
    .write();
  console.log("done!");
}

export { getHTML, getClubStats, getAthleteStats, getProStats };
