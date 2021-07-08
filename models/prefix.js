const { model, Schema } = require('mongoose');

module.exports = model(
    'prefix',
    new Schema({
        Guild: String,
        Prefix: String,
    })
);