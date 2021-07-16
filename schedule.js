const schedule = require('node-schedule');

const computerSchema = require("./models/computer");

module.exports = {
    run : async(client) => {
        schedule.scheduleJob('*/59 * * * *', function() {
            computerSchema.find({}, (err, datas) => {
                datas.forEach(async (data) => {
                    if(data.Bank < data.MaxBank){
                        if(!data.Overheated){
                            data.Bank = data.Bank + data.IncomePerHour
                            if(data.Bank < data.MaxBank){
                                await computerSchema.findOneAndUpdate({ User: data.User }, data)
    
                                const chance = Math.floor(Math.random() * (100 - data.OverheatChance + 1)) + 1;
    
                                if(chance < data.OverheatChance){
                                    data.Overheated = true
                                    await data.save();
                                }
                            } else {
                                data.Bank = data.MaxBank
                                await data.save();
                            }
                        } else {
                            const chance = Math.floor(Math.random() * (100 - data.OverheatChance + 1)) + 1;
    
                            data.Overheated = false
                            await data.save();
                        }
                    }
                })
            })
        });
    }
}