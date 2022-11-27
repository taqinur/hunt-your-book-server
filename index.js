const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jvkrs5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const allUsersCollection = client.db('huntYourBook').collection('allUsers');

        app.get('/sellers', async (req, res) => {
            const query = { role : "seller" };
            const sellers = await allUsersCollection.find(query).toArray();
            res.send(sellers);
        });

        app.get('/buyers', async (req, res) => {
            const query = { role : "buyer" };
            const buyers = await allUsersCollection.find(query).toArray();
            res.send(buyers);
        });

        app.get('/users', async (req, res) => {
            const query = {};
            const result = await allUsersCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await allUsersCollection.insertOne(user);
            res.send(result);
        });

        app.put('/sellers/verified/:id', async (req, res) => {
            const query = {role: 'admin'};
            const user = await allUsersCollection.findOne(query);
            if(user?.role !== 'admin'){
                return res.status(403).send({message: 'forbidden access'})
            }
            
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    verified: true
                }
            }
            const result = await allUsersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
    }
    finally{

    }
}
run().catch(console.log);


app.get('/', async(req,res)=>{
    res.send('server is running');
})

app.listen(port, () => console.log('server is running on', port))