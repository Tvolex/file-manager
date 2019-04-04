const ObjectId = require('mongodb').ObjectId;

const { S3 } = require('../../models');
const { getCollections } = require('../../db/index');
const Collections = getCollections();

module.exports = async (req, res, next) => {
    const { token } = req.query;

    const { id = null } = req.params;

    if (!id) {
        return res.status(400).send({
            token: null,
            message: 'Bad request.'
        })
    }

    const file = await Collections.files.findOne({ _id: ObjectId(id) }).catch(err => {
        console.error(err);
        return res.status(500).send({
            token: null,
            message: 'Finding was failed.'
        })
    });

    if (file.owner !== token) {
        return res.status(403).send({
            message: 'Forbidden.'
        })
    }

    return S3.delete(file, () => {
        return Collections.files.deleteOne({ key: file.key })
            .then((data) => {
                return res.status(200).send({ message: `Deleted file by id: ${ file.key}` });
            })
            .catch(err => {
                console.error(err);
                return res.status(500).send({
                    token: null,
                    message: 'Finding was failed.'
                })
            });
    })
};
