const express = require('express');
const bodyParser = require('body-parser')
const {JDSOM, JSDOM} = require('jsdom')
const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


const fetch = async (url)=>{
    try{
        const {data} = await axios.get(url);
        const {document} = new JSDOM(data,{
            runScripts:'outside-only'
        }).window;
        const title = document.querySelector('title').textContent;
        const description = document.querySelectorAll('meta[name=description]')[0].content;
        return {title:title, description:description};
    }
    catch(err){
        throw err;
    }
    
}

app.get("/",(req,res)=>{
    res.render("index");
})

app.post("/",(req,res)=>{
    let url = req.body.address;
    fetch(url).then((info)=>{
        res.render('data',{data:info});
    });
})
app.listen('3000',()=>{
    console.log("Listening at 3000");
})