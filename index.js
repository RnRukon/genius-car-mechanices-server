const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware-------------
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.af4at.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// ------------------------------------------------------

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET all services----------------------
        app.get('/services', async (req, res) => {
            const services = await servicesCollection.find({}).toArray();

            res.send(services);
        })

        //get Single Service--------------------
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.send(service)
        })
        //POST API--------------------
        app.post('/services', async (req, res) => {

            const service = req.body;

            // console.log('hit the post api', service)

            const result = await servicesCollection.insertOne(service)
            console.log(result)
            res.send(result)
        })

        // Delete service ----------
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);
// ------------------------------------------------------






app.get('/', (req, res) => {
    res.send('Running genius server');
})
app.get('/hello', (req, res) => {
    res.send("hello updated api testing")
})
app.listen(port, () => {
    console.log('Running Genius server on port', port)
})

/*
one time:
1. heroku account open
2.heroku software install


every project:

1.gitignore (node_module,.env)
2. git init
3. push everything to git
4. make sure you have this script: "start":"node index.js",
5.make suer: put process.env.PORT in front od your port number
6.heroku login
7.heroku create (only one time for a project)
8.git push heroku main/master


update:
1.save everything check locally
2.git add,git commit -m"first commit",git push;
3 git push heroku main/master
*/