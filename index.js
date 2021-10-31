const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vipdf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database');
        const database = client.db("weTravel");
        const servicesCollection = database.collection('services');
        const bookingsCollection = database.collection('bookings');

        //GET API (Services)
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.limit(12).toArray();
            res.send(services);

        });

        // GET API (Bookings)
        app.get('/myBookings', async (req, res) => {
            const cursor = servicesCollection.find({});
            const bookings = await cursor.toArray();
            res.send(services);

        });

        //GET Single Service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id');
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            // const service = {
            //     "destination": "Netherlands",
            //     "price": "$800",
            //     "description": "The Biggest Adventure You Can Ever Take Is To Live The Life Of Your Dreams!We have dedicated members for nursing elderly people. They don't need to worry about anything.",
            //     "image": "https://getaway.qodeinteractive.com/wp-content/uploads/2017/08/tour-3-img-4.jpg"
            // }
            const result = await servicesCollection.insertOne(service);
            res.json(result)
            console.log(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("running")
});

app.listen(port, () => {
    console.log("Running", port);
})