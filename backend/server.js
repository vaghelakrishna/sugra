require('dotenv').config();
const app = require('./src/app');
const connectDatabase = require('./src/config/database');

const port = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET must be set before starting the API.');
  process.exit(1);
}

connectDatabase()
  .then(() => app.listen(port, () => console.log(`API listening on http://localhost:${port}`)))
  .catch((error) => {
    console.error('Unable to connect to MongoDB:', error.message);
    process.exit(1);
  });
