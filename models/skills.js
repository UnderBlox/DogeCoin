const { model, Schema } = require('mongoose');

module.exports = model(
    'skills',
    new Schema({
        User: String,

        //Mining
        MiningLevel: Number,
        MiningExp: Number,
        MiningMultipliers: Number,

        //Fishing
        FishingLevel: Number,
        FishingExp: Number,
        FishingMultipliers: Number,

        //Fishing
        FarmingLevel: Number,
        FarmingExp: Number,
        FarmingMultipliers: Number,
    })
);