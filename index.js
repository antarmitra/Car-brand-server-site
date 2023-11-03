const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orneeg0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// const uri = "mongodb+srv://carShop:eRYYdqUlztPKYg6F@cluster0.orneeg0.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const carCollection = client.db('carDB').collection('car')
        const productCollection = client.db('carDB').collection('product')


        app.get('/car', async (req, res) => {
            const cursor = carCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await carCollection.findOne(query);
            res.send(result)
        })

        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = req.body;
            const product = {
                $set: {
                    photo: updateProduct.photo,
                    modelName: updateProduct.modelName,
                    brandName: updateProduct.brandName,
                    types: updateProduct.types,
                    price: updateProduct.price,
                    rating: updateProduct.rating,
                    details: updateProduct.details
                }
            }
            const result = await carCollection.updateOne(filter, product, options);
            res.send(result)

        })

        app.post('/car', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await carCollection.insertOne(newProduct);
            res.send(result);
        })

        app.post('/product', async (req, res) => {
            const addProduct = req.body;
            console.log(addProduct);
            const result = await productCollection.insertOne(addProduct);
            res.send(result)
        })

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.deleteOne(query)
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
}) 