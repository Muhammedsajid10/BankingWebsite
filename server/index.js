const express = require('express');
const cors = require('cors');
const connection = require('./MongoDb/Mongoose');
const router = require('./Router/Router');
const userRouter = require('./Router/userRoutes');
const tranRouter = require('./Router/transactionRoutes');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
connection();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use('/', router);
app.use('/userRoute', userRouter);
app.use('/transaction', tranRouter);

// Error handling middleware for parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send('Bad request: malformed JSON');
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
