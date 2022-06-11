import sha1 from 'sha1';
import dbClient from '../utils/db';

const postNew = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).send({ error: 'Missing email' });
  }
  if (!password) {
    res.status(400).send({ error: 'Missing password' });
  }
  const users = dbClient.db.collection('users');
  const existing = await users.findOne({ email });
  if (existing) {
    console.log('existing', existing);
    res.status(400).send({ error: 'Already exist' });
  } else {
    const hashedPass = await sha1(password);
    try {
      const user = await users.insertOne({ email, password: hashedPass });
      console.log('+++++++++++++++++', user);
      const userData = user.ops[0];
      res.status(201).json({
        id: userData._id,
        email: userData.email,
      });
    } catch (err) {
      console.log('error while saving the data');
    }
  }
};
const another = () => {};
export default { postNew, another };
