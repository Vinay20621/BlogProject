const mongoose=require('mongoose')
const {MONGODB_URL}=require('./config/index')


async function mongodb()
{
    try{
        await mongoose.connect(MONGODB_URL)
        console.log('MongoDb connected')
    }
    catch(e)
    {
        console.log(e)
    }
}
module.exports=mongodb