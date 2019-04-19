import axios from "axios";
import cheerio from "cheerio";

async function getHTML(url) {
  const { data: html } = await axios.get(url);
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

export { getHTML, getClubStats };
