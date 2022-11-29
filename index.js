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
        const productCollection = client.db('huntYourBook').collection('products');
        const categoryCollection = client.db('huntYourBook').collection('categories');

        app.get('/products', async(req, res) =>{
            let query = {};
            if(req.query.category_id){
                query = {
                    category_id: req.query.category_id
                }
            }
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/sellers', async (req, res) => {
            const query = { role : "seller" };
            const sellers = await allUsersCollection.find(query).toArray();
            res.send(sellers);
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


        app.get('/users', async(req, res) =>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = allUsersCollection.find(query);
            const user = await cursor.toArray();
            res.send(user);
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

        
        app.get('/products', async(req, res) =>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        
        app.post('/products', async(req, res) =>{
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        app.get('/categories/:id', async(req, res) =>{
            const id = req.params.id;           
            const query = {category_id: id};
            const category = await categoryCollection.findOne(query);
            res.send(category);
        });


        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;           
            const query = {_id: ObjectId(id)};
            const user = await allUsersCollection.findOne(query);
            res.send(user);
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await allUsersCollection.deleteOne(filter);
            res.send(result);
        })

        app.delete('/products/:id', async(req,res)=>{
            const id= req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.log);


app.get('/', async(req,res)=>{
    res.send('server is running');
})

app.listen(port, () => console.log('server is running on', port))