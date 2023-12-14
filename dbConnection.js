// dbConnection.js

const mongoDBUri = process.env.MONGODB_URI || "mongodb+srv://TaeSukKim:46107985@toonie.uefooxv.mongodb.net/?retryWrites=true&w=majority" ||
    process.env.MONGO_HOST ||
    'mongodb://' + (process.env.IP || 'localhost') + ':' +
    (process.env.MONGO_PORT || '27017') +
    '/SurveyApp';

export default mongoDBUri;