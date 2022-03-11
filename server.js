const { urlencoded } = require('express');
const express = require('express')
const path = require('path');
const fs = require("fs");
const { json } = require('express/lib/response');
// We assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static('public'));

//Setting up routes 
app.get('/api/notes', (req, res) => {
    //read the JSON file 
    fs.readFile('./db/db.json', 'utf8', (error, response) => {
        if (error) throw error;

        //Parse the data
        console.log(response);

        console.log(JSON.parse(response));
        //send it back to the html page 

        res.json(JSON.parse(response));
        /*
        array.filter to selcet an bject and delete it
        json.stringfy to write the file in
        fs.appendFIle
        fitler for the id value, then delete that value.
        */
    })

});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.listen(PORT, () => {
    console.log("Listening at http://localhost:" + PORT);
})