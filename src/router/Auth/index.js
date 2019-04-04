const uniqueToken = require('unique-token');

const { getCollections } = require('../../db/index');
const Collections = getCollections();

module.exports = async (req, res, next) => {
    const token = uniqueToken.random({ length: 30 });

    await Collections.tokens.insertOne({ token }).catch(err => {
        console.error(err);
        return res.status(500).send({
            token: null,
            message: 'Creation of new token was failed.'
        })
    });

    return res.status(200).send({
        token,
        message: 'New token successfully created.'
    })
};
