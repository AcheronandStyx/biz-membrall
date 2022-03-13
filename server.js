const { urlencoded } = require('express');
const express = require('express')
const path = require('path');
const fs = require("fs");
const { json } = require('express/lib/response');
const notes = require('./data/notes');
// We assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();
var uniqid = require('uniqid');  // UUID generator
// LINES 123 to 126 of INDEX.JS TJE FUNCTION IS NOT DESTRUCTURING THE THE RAAY FROM THE BOJECT AND THE RENDER NOT LIST FUNCTION BREAKS DOWN
// Listen at the heroku port or 3001 if process.env.Port is not open
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static('public')); // make the public folder available everywhere


function createNewNote (body, notesArray) {
    
    const note = body; 
    notesArray.push(note);
    
    console.log(notesArray);
    // console.log('test\n')
    console.log(JSON.stringify({ notes: notesArray }, null, 2))

    fs.writeFileSync(
        path.join(__dirname, './data/notes.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return note;
}

app.get('/api/notes', (req, res) => {
    // read the JSON file 
    fs.readFile('./data/notes.json', 'utf8', (error, response) => {
        if (error) throw error;

        //Parse the data
        //console.log(response);
        console.log(uniqid())

        // console.log(JSON.parse(response));

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

app.post('/api/notes', (req, res) => {

    notesArray = notes;
    // LOOK INTO NPM MOUDLES TO ENSURE A UNIQUE ID IS USED, .LENGTH DOESN"T WORK BECAUSE TEH USER CAN DELETE FROM THE MIDDLE, then add on eproducing a dup id
    // console.log(notesArray);
    // console.log(req.body);
    const note = createNewNote(req.body, notesArray); // Send the user entered note and notes.json
    res.json(note);

});

// route to the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// * wildcard to return index if an unexpected route is entered by the user
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


// listen at the port
app.listen(PORT, () => {
    console.log("Listening at http://localhost:" + PORT);
})