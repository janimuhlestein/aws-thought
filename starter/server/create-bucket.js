// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
//set the region
AWS.config.update({ region: 'us-west-1'});
const s3 = new AWS.S3({ apiVersion: '2006-03-01'});

//create bucketParams
var bucketParams = {
    Bucket : "user-images-" + uuidv4()
};

//call s3 to create the bucket
s3.createBucket(bucketParams, (err, data) => {
    if(err) {
        console.log('Error', err);
    }
    else {
        console.log('Success');
    }
});