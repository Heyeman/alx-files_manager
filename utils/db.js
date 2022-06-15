import {
  MongoClient,
} from 'mongodb';
import {
  env,
} from 'process';

class DBClient {
  constructor() {
    this.host = env.DB_HOST || 'localhost';
    this.port = env.DB_PORT || 27017;
    this.dbName = env.DB_DATABASE || 'files_manager';
    MongoClient(`mongodb://${this.host}:${this.port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
<<<<<<< HEAD
    }).connect().then((client) => {
      this.client = client;
      this.db = this.client.db(this.dbName);
    }).catch((err) => {
      console.error(err.message);
=======
    });
    this.client.connect(() => {
      this.db = this.client.db(database);
>>>>>>> fe17f2462239af5958ed78064f601c5a47559503
    });
  }

  isAlive() {
    if (this.db) return true;
    return false;
  }

  async nbUsers() {
    const collection = this.db.collection('users');
    return collection.countDocuments();
  }

  async nbFiles() {
    const collection = this.db.collection('files');
    return collection.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
