const { model, Schema } = require('mongoose');

module.exports = model(
    'computers',
    new Schema({
        User: String,
        IncomePerHour: Number,

        MaxBank: Number,
        Bank: Number,

        OverheatChance: Number,
        Overheated: Boolean,

        Cooler: Number,
        Graphics: Number,
        Hardware: Number,
    })
);