const { v4: uuidv4 } = require('uuid');

const params = fileName => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];

    const imageParams =  {
        Bucket: '<My_Bucket_Name>',
        Key: `${uuidv4()}.${fileType}`,
        Body: fileName.buffer
    }

    return imageParams;
};

module.exports = params;
