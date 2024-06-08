// import mongoose from 'mongoose';
// import app from './app.js';
// import 'dotenv/config';

// const uri = process.env.DB_HOST;
// const port = process.env.PORT || 8000;

// // run server
// (async () => {
//   try {
//     await mongoose.connect(uri);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log('Database connection successful');

//     app.listen(port, () => {
//       console.log(`Server is running. Use our API on port: ${port}`);
//     });
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// })();

import mongoose from 'mongoose';
import app from './app.js';
import 'dotenv/config';

const DB_URI = process.env.DB_URI;

// run server
(async () => {
  try {
    await mongoose.connect(DB_URI);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Database connection successful');

    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
