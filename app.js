const express = require('express')
const app= express()

const contactRouter = require('./router/contactRouter');
app.use(express.json())

app.use('/contact', contactRouter);

app.listen(4000, ()=>{
    console.log("server is connecting");
})
