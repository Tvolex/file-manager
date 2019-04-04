const AWS = require('aws-sdk');
const fs = require('fs');

const {
    AWS_ACCESS_KEY_ID,
    AWS_S3_BUCKET_NAME,
    AWS_S3_BUCKET_REGION,
    AWS_SECRET_ACCESS_KEY,
} = process.env;

AWS.config.update({ AWS_S3_BUCKET_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY });
const S3 = new AWS.S3();

module.exports = {
    async upload(file, Key, callback) {
        if (!file) {
            const error = new Error('Bad request.');
            error.status = 400;
            throw error;
        }

        let stream = fs.createReadStream(file.path);

        const options = {
            Key,
            Body: stream,
            ACL: 'public-read',
            ContentType: file.type,
            Bucket: AWS_S3_BUCKET_NAME,
        } ;

        const result = await S3.upload(options).promise()
            .then(callback)
            .catch(err => {
                console.error(err);
                throw err;
            });

        fs.unlink(file.path, function (err) {
            if (err) {
                console.error(err);
            }
            console.log(`Temp file was deleted: ${file.path}`);
        });

        return result;
    },

    async delete({ Bucket, Key }, callback) {
        S3.deleteObject({ Bucket, Key }, callback);
    }
};
