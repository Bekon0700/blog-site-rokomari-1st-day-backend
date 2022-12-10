const mongoose = require('mongoose');
const app = require('./app');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

mongoose.set('strictQuery', true)
mongoose
  .connect('mongodb://localhost:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB Connection Successful');
  });


//starting the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});
