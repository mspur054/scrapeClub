import axios from "axios";
import cheerio from "cheerio";
import db from "./db";
import { athleteFilter } from "./utils";

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

/**Gets the club count from the web page */
export async function getClubCount() {
  //1609 pod
  const html = await getHTML("/clubs/473964");
  const mileClubCount = await getClubStats(html);

  return mileClubCount;
}

/**This gets the most recent entry for the given athlete
 * @param {string} collectionName - the Name of the collection.
 * @param {string} name - The name of the Athlete
 */
async function getMostRecentAthleteEntry(collectionName, name) {
  const athleteEntry = await db
    .collection(collectionName)
    .orderBy("date", "desc")
    .where("name", "==", name)
    .limit(1)
    .get()
    .then(function(querySnapshot) {
      return querySnapshot.docs.map(doc => doc.data())[0];
    })
    .catch(function(err) {
      console.log("Error getting cached collection", err);
    });

  return athleteEntry;
}

/**Determines if any property has changed since last scrape
 * @param {string} collectionName - The Name of the firebase collection.
 * @param {object} athleteData - The object that was created from the scrape. Contains athlete information.
 */
async function isAthleteEntryDifferent(collectionName, athleteData) {
  const lastEntry = await getMostRecentAthleteEntry(
    collectionName,
    athleteData.name
  );

  if (
    JSON.stringify(athleteFilter(lastEntry)) !=
    JSON.stringify(athleteFilter(athleteData))
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Main job, scrapes site and pushes data to database if there's changes
 */

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

  if (await isAthleteEntryDifferent("athletes", timFollowers)) {
    db.collection("athletes").add({
      ...timFollowers,
      date: Date.now()
    });
  }

  if (await isAthleteEntryDifferent("athletes", mattFollowers)) {
    db.collection("athletes").add({
      ...mattFollowers,
      date: Date.now()
    });
  }

  if (await isAthleteEntryDifferent("pros", jimFollowers)) {
    db.collection("pros").add({
      ...jimFollowers,
      date: Date.now()
    });
  }

  if (await isAthleteEntryDifferent("pros", sageFollowers)) {
    db.collection("pros").add({
      ...sageFollowers,
      date: Date.now()
    });
  }

  db.collection("mileclub").add({
    count: cClubCount,
    date: Date.now()
  });

  console.log("done!");
}

export { getHTML, getClubStats, getAthleteStats, getProStats };
