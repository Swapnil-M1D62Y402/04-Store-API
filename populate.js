//Automate the insertion of data to database

require('dotenv').config();
const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./products.json');

(async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany(); //empty the database
        await Product.create(jsonProducts); //add the list to database
        console.log('Success!!!');
        process.exit(0);  //Exits the connection after insertion of data
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
})();