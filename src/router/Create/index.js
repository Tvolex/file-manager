const _ = require('lodash');

const { S3 } = require('../../models');
const { getCollections } = require('../../db/index');

const Collections = getCollections();

module.exports = async (req, res, next) => {
    const { token } = req.query;

    const { type, status, message, valid, file} = uploadValidation(req);

    if (!valid) {
        return res.status(status).send({
            type,
            message,
        })
    }

    const fileID = await Collections.files.insertOne({
        owner: token,
        size: file.size,
        type: file.type,
        status: 'pending',
    }).then(data => data.insertedId);


    S3.upload(file, fileID.toString())
        .then((fileData) => {
            console.log(`File was uploaded: ${fileID}`);
            Collections.files.updateOne({ _id: fileID }, { $set: {...fileData, status: 'done' } });
        })
        .catch(err => {
            console.error(err);
            Collections.files.updateOne({ _id: fileID }, { $set: { status: 'failed'} });
        });

    setTimeout(async () => {
        await Collections.files.findOne({ _id: fileID })
            .then(foundFile => {
                return res
                    .status(status)
                    .send({
                        type,
                        status,
                        message: `Upload in processing. File will be available by id: ${fileID}.`,
                        file: foundFile
                    });
            })
            .catch(err => {
                console.error(err);
                return res
                    .status(500)
                    .send({
                        type: 'error',
                        message: err.message
                    })
            })
    }, 1500);

};

const uploadValidation = (req) => {
    if (_.isEmpty(req.files)) {
        return { type: 'error', status: 400, message: 'Bad request!', valid: false };
    }

    const  file = req.files.file || req.files.file;

    if (!file) {
        return {
            type: 'error',
            status: 400,
            message: "File wasn't upload.",
            valid: false
        };
    }

    const { type } = file;

    if (!["image/jpeg", "image/pipeg", "image/svg+xml", "image/tiff", "image/bmp", "image/x-icon", "image/png", "image/pjpeg", "image/webp", "image/gif"].includes(type)) {
        return {
            type: 'error',
            status: 415,
            message: `Unsupported Media Type: ${type}.`,
            valid: false
        };
    }

    return {
        type: 'success',
        status: 201,
        valid: true,
        file,
    }
};

