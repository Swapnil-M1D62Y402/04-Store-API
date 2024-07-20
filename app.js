require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');
//async errors
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

//middleware
app.use(express.json());

//routes
app.use('/api/v1/products', productsRouter);

//Async Errors
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

(async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is Listening to port ${port}`));
    }
    catch(err){
        console.log(err);
    }
})();

