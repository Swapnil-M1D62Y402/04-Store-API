const { query } = require('express');
const Product = require('../models/product');  //the model containing schema of our data
const product = require('../models/product');

const getAllProductsStatic = async (req,res) => {

    // 1. $regex operator - Finding patterns
    // const search = 'l';
    //throw new Error('Testing Async Errors');
    
    // const products = await Product.find({
    //     name: {$regex: search, $options: 'i'},
    // });

    //2. Sorting 
    //const products = await Product.find({}).sort('-name price');

    //3. Select Field and chaining all the functions
    const products = await Product.find({price : { $gt : 30}})
        .sort('name')
        .select('name price')
        //.limit(5)
    res.status(200).json({products, nbHits: products.length });
}

const getAllProducts = async (req,res) => {
    const {featured, company, name, sort, fields, numberFilter} = req.query;
    const queryObject = {}

    //Form the query object first
    if(featured){
        queryObject.featured = featured === 'true' ? true: false
    }
    if(company){
        queryObject.company = company 
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }
    console.log(queryObject);

    //Various Operations to filter the products 

    if(numberFilter){
        const operatorMap = {
            '>': '$gt',
            '<': '$lt',
            '=': '$eq',
            '>=': '$gte',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|=|<=|>=)\b/g  //regular express
        let filters = numberFilter.replace(
            regEx, 
            (match) => `-${operatorMap[match]}-`
        )
        console.log(filters);            //---------> price-$gt-40, rating-$gt-4
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        });
        //console.log(`New Filter ${filters}`); ----> undefined
    }
    
    
    let result = Product.find(queryObject);
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
        console.log(sort);
    }
    else{
        result = result.sort('createdAt name');
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;

    res.status(200).json({products, nbHits: products.length});
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}