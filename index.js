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

        // POST API (Add a new Service)
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);

            const result = await servicesCollection.insertOne(service);
            res.json(result)
            console.log(result);
        })

        //GET API (Bookings)
        app.get('/manageBookings', async (req, res) => {
            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);

        });
        // POST API (manageBookings)
        app.post('/manageBookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);

            const result = await bookingsCollection.insertOne(booking);
            res.json(result)
            // console.log(result);

        });
        //GET Single Service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id');
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //Delete API 
        app.delete('./manageBookings:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);

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