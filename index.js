const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json())


// shorif
// VOEQlpmSddk2GVQw




const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.shfwl8n.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();
        const serviceCollection = client.db("serviceDB").collection("service")
        const orderCollection = client.db("serviceDB").collection("order")


       // service

        app.get('/service', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.send(result)
        })
        app.get('/addedService', async (req, res)=>{
            const email =req.query.email
            const query = {email: email}
            const result = await serviceCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/service', async (req, res) => {
            const newService = req.body;
            console.log(newService);
            const result = await serviceCollection.insertOne(newService)
            res.send(result);
        })
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
      
            const result = await serviceCollection.deleteOne(query)
            res.send(result);
          })
        
        // order
        
        app.post('/order', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder)
            res.send(result);
        })
        app.get('/order/:email', async (req, res) => {
            const email = req.params.email
            console.log(email);
            const query = { userEmail: {$in: [email]} }
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })

        // app.get('/order', async (req, res) => {
        //     const cursor = orderCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result)
        // })



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
    res.send('Simple service sharing website CRUD is running ')
})

app.listen(port, () => {
    console.log(`Simple service sharing website CRUD is running, ${port}`);
})