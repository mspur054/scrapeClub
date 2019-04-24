export function uniqueCount(scrapes) {
  return scrapes.reduce(function(acc, scrape) {
    if (!acc.find(el => el.count === scrape.count)) {
      return [...acc, scrape];
    }
    return acc;
  }, []);
}

export function uniqueAthleteFollowers(scrapes) {
  return scrapes.reduce(function(acc, scrape) {
    //filter to athlete/pro
    const athleteRecords = acc.filter(el => el.name === scrape.name);
    if (
      !athleteRecords.find(
        el =>
          el.followersCount === scrape.followersCount ||
          el.followingCount === scrape.followingCount
      )
    ) {
      return [...acc, scrape];
    }
    return acc;
  }, []);
}

export async function getFirebaseData(db, collectionName) {
  return await db
    .collection(collectionName)
    .orderBy("date", "desc")
    .limit(100)
    .get()
    .then(function(querySnapshot) {
      return querySnapshot.docs.map(doc => doc.data());
    })
    .catch(function(err) {
      console.log("Error getting cached collection", error);
    });
}
