

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const app = express();

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfyph.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = 8050;

app.listen(process.env.PORT ||port);


app.get('/', (req, res) => {
    res.send("Hello World!")
})


client.connect(err => {

    const bookings = client.db(`${process.env.DB_NAME}`).collection("bookings");

    const reviews = client.db(`${process.env.DB_NAME}`).collection("reviews");

    const services = client.db(`${process.env.DB_NAME}`).collection("services");
    const packages = client.db(`${process.env.DB_NAME}`).collection("packages");

    const user = client.db(`${process.env.DB_NAME}`).collection("user");

    const admin = client.db(`${process.env.DB_NAME}`).collection("admin");
   

    app.get("/services", (req, res) => {
        services.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.get("/orderList", (req, res) => {
        bookings.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.get("/bookingList/:email", (req, res) => {
        bookings.find({email: req.params.email})
            .toArray((err, items) => {
                res.send(items);
            })
    })



    app.post("/addBooking", (req, res) => {

        const newBooking = req.body;
        bookings.insertOne(newBooking)
        .then(result => {
            res.send(result.insertedCount > 0);
        })

        console.log(newBooking);
    })


    app.get("/packages", (req, res) => {
        packages.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })
    app.get("/reviews", (req, res) => {
        reviews.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })
    
    
    app.post('/addServices', (req, res) => {
        const newServices = req.body;

        services.insertOne(newServices)
            .then(result => {
                res.send(result.insertedCount > 0);
            })

        console.log(newServices);
    })

    app.post('/addPackages', (req, res) => {
        const newPackages = req.body;

        packages.insertOne(newPackages)
            .then(result => {
                res.send(result.insertedCount > 0);
            })

        console.log(newPackages);
    })

    app.post('/addReview', (req, res) => {
        const newReview = req.body;

        reviews.insertOne(newReview)
            .then(result => {
                res.send(result.insertedCount > 0);
            })

        console.log(newReview);
    })
    app.post('/addUser', (req, res) => {
        const newUser = req.body;

        user.insertOne(newUser)
            .then(result => {
                res.send(result.insertedCount > 0);
            })

        console.log(newUser);
    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;

        admin.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0);
            })

        console.log(newAdmin);
    })
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;

         admin.find({ email: email})
            .toArray((err, items) => {
                res.send(items.length> 0);
            }) 
            console.log(email);
    })

    app.patch('/updateStatus/:id', (req, res) => {

        const id = ObjectID(req.params.id);
        // const status = req.body.orderStatus;

         bookings.updateOne({ _id: id},
        {
            $set : req.body
        })
        .then((result) => {
            if(result.modifiedCount > 0)
            {
                res.send(result);
            }
        }) 

        console.log(id ,req.body);
    })



});
