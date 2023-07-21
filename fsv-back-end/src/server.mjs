import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import { fileURLToPath } from 'url';
import { dirname, join ,resolve } from 'path';
import history from 'connect-history-api-fallback'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app=express();
app.use(bodyParser.json());

app.use('/images', express.static(join(__dirname, '../assets')));
app.use(express.static(resolve(__dirname, '../dist'),{maxAge:'1y',etag:false}));
app.use(history());

let database;
let client;

async function connectToDatabase() {
  client = await MongoClient.connect('mongodb://127.0.0.1:27017');
  database = client.db('vue-db');
}
connectToDatabase() ;
app.get('/api/products', async(req, res) => {
    const products=await database.collection('products').find({}).toArray();
    res.status(200).json(products);
});
app.get('/api/users/:userId/cart', async(req, res) => {
    const user= await database.collection('users').findOne({id:req.params.userId});
    if (!user) return res.status(404).json('Could not find user!');
    const products=await database.collection('products').find({}).toArray();
    const cartItemsIds=user.cartItems;
    console.log(cartItemsIds)
    const cartItems=cartItemsIds.map(id=>
      products.find(product=>product.id===id));
    res.status(200).json(cartItems);
});
app.get('/api/products/:productId', async(req, res) => {
    const { productId } = req.params;
    const product=await database.collection('products').findOne({id:productId})
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json('Could not find the product!');
    }
  //  await  client.close();
})
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});
app.post('/api/users/:userId/cart', async(req, res) => {
    const { productId } = req.body;
    const { userId }=req.params
    await database.collection('users').updateOne({ id: userId }, {
      $addToSet: { cartItems: productId },
    });
    const products=await database.collection('products').find({}).toArray();
    const user = await database.collection('users').findOne({ id: userId });
    const cartItemIds = user.cartItems;
    const cartItems = cartItemIds.map(id =>
      products.find(product => product.id === id));
    res.status(200).json(cartItems);
    
    
  });
  app.delete('/api/users/:userId/cart/:productId', async(req, res) => {
    const { userId, productId  } = req.params;
    await database.collection('users').updateOne({ id: userId }, {
      $pull: { cartItems: productId },
    });
    const user = await database.collection('users').findOne({ id: userId });
    const products = await database.collection('products').find({}).toArray();
    const cartItemIds = user.cartItems;
    const cartItems = cartItemIds.map(id =>
      products.find(product => product.id === id));
      res.status(200).json(cartItems);
  });
  
// Call connectToDatabase to establish the connection
connectToDatabase()
  .then(() => {
    // Start the server once the connection is established
    const server = app.listen(8000, () => {
      console.log('Server is listening on port 8000!');
    });

    // Handle server shutdown event
    process.on('SIGINT', async () => {
      console.log('Server shutting down...');
      // Close the MongoDB connection
      await client.close();
      console.log('MongoDB connection closed.');
      // Close the server
      server.close(() => {
        console.log('Server stopped.');
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });