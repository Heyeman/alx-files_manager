import redisClient from '../utils/redis';
import dbClient from '../utils/db';

<<<<<<< HEAD
class AppController {
  static getStatus(_req, res) {
    const json = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).send(json);
  }
=======
const getStatus = (req, res) => {
  const redisStatus = redisClient.isAlive();
  const mongoStatus = dbClient.isAlive();
  res.status(200).json({
    redis: redisStatus,
    db: mongoStatus,
  });
};
const getStats = async (req, res) => {
  const nU = await dbClient.nbUsers();
>>>>>>> fe17f2462239af5958ed78064f601c5a47559503

  static async getStats(_req, res) {
    const json = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    res.status(200).send(json);
  }
}

export default AppController;
