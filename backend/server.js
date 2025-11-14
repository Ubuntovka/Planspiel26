require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error.middleware.js');
const exampleRoutes = require('./api/routes/exampleRoutes.js');

// init
const app = express();
const mongoDBURL = process.env.MONGODB_URL;
const port = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(errorHandler)


// routes
app.use("/api/example", exampleRoutes)


// start db
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connection Successful"))
.catch((err) => console.error("Connection Error:", err));


// start backend
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}
module.exports = app;