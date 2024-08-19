const mongoose = require('mongoose')
const { type } = require('os')
mongoose.connect('mongodb://127.0.0.1/azmi',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
})

// membuat scheama




// menambah satu data

// const contact1 = new Contact({
//     nama : "DoddyFerdiansyah",
//     noHp : '09910234040',
//     email : "DoddyFerdiansyah90018@gmail.com"
// })


// contact1.save().then((contact) => console.log(contact))
