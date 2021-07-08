const { model, Schema } = require('mongoose');

module.exports = model(
    'cooldown',
    new Schema({
        User: String,
        Cooldown: Map,
    })
);