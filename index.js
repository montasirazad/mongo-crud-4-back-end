const express = require('express');
const app = express();

// MIDDLEWAREs
const cors = require('cors');
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;
const port = 5000;

/// MONGO SETUP
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "ADDED-LATER";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const database = client.db("allStudent");
        const studentDb = database.collection("student");

        // POST API
        app.post('/add-student', async (req, res) => {
            const newStudent = req.body;
            const result = await studentDb.insertOne(newStudent);
            console.log(result);
            res.json(result)

        });

        // LOAD ALL DATA or GET API
        app.get('/all-student', async (req, res) => {

            const cursor = studentDb.find({});
            const allData = await cursor.toArray();
            res.send(allData)
        })

        // DELETE API
        app.delete('/remove-student/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentDb.deleteOne(query);
            console.log(result);
            res.json(result);
        })

        /// FIND API
        app.get('/find/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const student = await studentDb.findOne(query);
            res.json(student)
        })

        /// UPDATE API

        app.put('/update-info/:id', async (req, res) => {
            const id = req.params.id;
            const query = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: query.name,
                    roll: query.roll,
                    section: query.section
                },
            };
            const result = await studentDb.updateOne(filter, updateDoc, options);
            res.json(result);

        })

    }

    finally {
        //await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('server ready')
});


app.listen(port, () => {
    console.log(`listening to port ${port}`);
})
