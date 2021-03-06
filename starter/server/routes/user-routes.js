const express = require('express');
const router = express.Router();

//configure service interface
const AWS = require("aws-sdk");
const awsConfig = {
    region: "us-west-1"
};
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = 'Thoughts';

router.get('/users', (req,res) => {
    const params = {
        TableName: table
    };
    //scan return all items in the table
    dynamodb.scan(params, (err,data) => {
        if(err) {
            res.status(500).json(err); //an error occurred
        } else {
            res.json(data.Items)
        }
    });
});

router.get('/users/:username', (req,res) => {
    console.log(`Querying for thought(s) from ${req.params.username}.`);
    const params = {
        TableName: table,
        ProjectionExpression: "#un, #th, #ca, #img",
        KeyConditionExpression: "#un = :user",
        ExpressionAttributeNames: {
            "#un": "username",
            "#ca": "createdAt",
            "#th": "thought",
            "img": "image" //add the image alias
        },
        ExpressionAttributeValues: {
            ":user": req.params.username
        },
        ScanIndexForward: false
    };

    dynamodb.query(params, (err, data) => {
        if(err) {
             console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
             res.status(500).json(err); // an error happened
        } else {
            console.log("Query succeeded.");
            res.json(data.Items);
        }
    });
}); // closes the route for router.get(users/:username)

//create a new user at /api/users
router.post('/users', (req, res) => {
    const params = {
        TableName: table,
        Item: {
            "username": req.body.username,
            "createdAt": Date.now(),
            "thought": req.body.thought,
            "image": req.body.image //add new image attribute
        }
    };
    //database call
    dynamodb.put(params, (err, data) => {
        if(err) {
            console.error("Unable to add item. Error JSON: ", JSON.stringify(err, null, 2));
            res.status(500).json(err); //an error happened
        } else {
            console.log("Added item: ", JSON.stringify(data, null, 2));
            res.json({"Added": JSON.stringify(data, null, 2)});
        }
    });
}); // ends route for router.post('/users)

module.exports = router;