const ObjectId = require('mongodb').ObjectId;

const { getCollections } = require('../../db/index');
const Collections = getCollections();

module.exports = {
    one: async (req, res, next) => {
        const { id = null } = req.params;
        const { token } = req.query;

        const file = await Collections.files.findOne({ _id: ObjectId(id) }).catch(err => {
            console.error(err);
            return res.status(500).send({
                token: null,
                message: 'Finding was failed.'
            })
        });

        if (!file) {
            return res.status(404).send({
                file: null,
                message: 'Not found.'
            })
        }

        if (file.owner !== token) {
            return res.status(403).send({
                message: 'Forbidden.'
            })
        }

        return res.status(200).send({
            file,
            message: 'Found.'
        })
    },

    list: async (req, res, next) => {
        const { token } = req.query;

        const files = await Collections.files.find({ owner: token }).toArray()
            .catch(err => {
                console.error(err);
                return res.status(500).send({
                    token: null,
                    message: 'Finding was failed.'
                })
            });

        const count = await Collections.files.countDocuments({ owner: token })
            .catch(err => {
                console.error(err);
            });

        if (files) {
            return res.status(200).send({
                files,
                count,
                message: 'Found.'
            })
        }

        return res.status(404).send({
            files: null,
            message: 'Not found.'
        })
    }
};
