import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ mile1609: [], athletes: [], pros: [] });

db.get("mile1609")
  .push({ Date: Date.now(), followers: 0 })
  .write();
