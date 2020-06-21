const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/addProduct', (req, res) => {
    let products = [];

    fs.readFile('products.txt', (err, data) => {
        if (err) throw err;

        products = data.length ? JSON.parse(data) : [];

        let newProduct = {};
        let query = req.query;
        newProduct['id'] = products.length ? products.sort((a,b) => a.id < b.id ? 1 : -1)[0].id+1 : 1;
        newProduct['title'] = query.hasOwnProperty('title') ? query.title : '';
        newProduct['image'] = query.hasOwnProperty('image') ? query.image : '';
        newProduct['price'] = query.hasOwnProperty('price') ? Number(query.price) : 0;
        newProduct['freeShipping'] = query.hasOwnProperty('freeShipping') && query.freeShipping;
        newProduct['descr'] = query.hasOwnProperty('descr') ? query.descr : '';
        newProduct['size'] = query.hasOwnProperty('size') ? query.size : '';
        products.push(newProduct);

        fs.writeFile('products.txt', JSON.stringify(products), (err) => {
            if (err) res.json({statusCode: 0, statusMessage: 'Error occured'});

            console.log('Products saved!');
        });
    });

    res.json({statusCode: 1, statusMessage: 'Products Saved'});
});

app.get('/getProducts', (req, res) => {
    fs.readFile('products.txt', (err, data) => {
        if (err) throw err;
        const products = data.length ? data : [];

        res.send(products);
    });
});

app.delete('/deleteProduct', (req, res) => {
    let products = [];

    fs.readFile('products.txt', (err, data) => {
        if (err) throw err;

        products = data.length ? JSON.parse(data) : [];
        if (!products.length) return;
        let id = Number(req.query.id);
        let prToDelete = products.find(pr => pr.id === id);

        products.splice(products.indexOf(prToDelete, 1));

        fs.writeFile('products.txt', JSON.stringify(products), (err) => {
            if (err) res.json({statusCode: 0, statusMessage: 'Error occured'});

            console.log('Products updated!');
        });
    });

    res.json({statusCode: 1, statusMessage: 'Product Deleted'});
});

const port = 3100;

app.listen(port, () => {
    console.log(`App started om port: ${port}`);
});
