const { MongoClient}= require('mongodb');

const Collections = {};
let isConnected = false;
let Client;

const init = async () => {
    try {
        Client = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
        isConnected = !!Client;
    } catch (err) {
        console.log(err);
        throw err;
    }

    console.log(`DB connected successfully`);

    return Client;
}

const checkIsConnected = () => {
    return isConnected;
};

const initCollections = async () => {
    if (isConnected) {
        Collections.tokens = Client.db('dev').collection('tokens');
        Collections.files = Client.db('dev').collection('files');
        return Collections;
    }
    return null;
};

const getCollections = () => {
    return Collections;
};

module.exports = { init, checkIsConnected, initCollections, getCollections };
