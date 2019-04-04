const { getCollections } = require('../../db/index');
const Collections = getCollections();

module.exports = async (req, res, next) => {
    const { token } = req.query;

    const exist = await Collections.tokens.findOne({ token }).catch(err => {
        console.error(err);
        return next(err);
    });

    if (!exist) {
        return res.status(401).send({
            message: 'Not authorized.'
        })
    }

    next();
};
