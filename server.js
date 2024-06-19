import mongoose from 'mongoose';
import ms from 'ms';
import app from './app.js';
import clearExpiredSessions from './helpers/clearExpiredSessions.js';

import 'dotenv/config';

const uri = process.env.DB_HOST;
const port = process.env.PORT || 8000;

// run server
(async () => {
  try {
    await mongoose.connect(uri);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Database connection successful');

    app.listen(port, () => {
      console.log(`Server is running. Use our API on port: ${port}`);
    });

    setInterval(clearExpiredSessions, ms(process.env.CLEAR_SESSION_INTERVAL));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
