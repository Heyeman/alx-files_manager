import { MongoClient } from "mongodb";

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || "files_manager";
    this.client = MongoClient(`mongodb://${host}:${port}`, {
      useUnifiedTopology: true,
    });
    this.client.connect(() => {
      this.db = this.client.db(database);
      console.log("Database connected successfully");
    });
  }

  isAlive() {
    if (this.db) return true;
    return false;
  }

  async nbUsers() {
    const usersCollection = this.db.collection("users");
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    const files = this.db.collection("files");
    return files.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
