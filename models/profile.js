const { model, Schema } = require('mongoose');

module.exports = model(
    'profile',
    new Schema({
        User: String,
        Rank: String,
        DogeCoins: Number,
        Multipliers: Number,
        Level: Number,
        Exp: Number,
        DailyStreak: Number,
        Tutorial: String,
    })
);