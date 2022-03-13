const { urlencoded } = require('express');
const express = require('express')
const path = require('path');
const fs = require("fs");
const { json } = require('express/lib/response');
const notes = require('./data/notes');
const app = express();
const { v4: uuidv4 } = require('uuid'); // UUID NPM Module -> https://www.npmjs.com/package/uuid
const PORT = process.env.PORT || 3001; // Listen at the heroku port or 3001 if process.env.Port is not open
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static('public')); // make the public folder available everywhere


function createNewNote(body, notesArray) {
    const note = body;
    note.id = uuidv4(); // generata a UUID and append that to the note object before it is pushed into the array
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './data/notes.json'),
        JSON.stringify( notesArray, null, 2 ) // overwrite notes.json with the updated notes array
    );
    return note;
}

app.get('/api/notes', (req, res) => {

    // read the JSON file 
    fs.readFile('./data/notes.json', 'utf8', (error, response) => {
        if (error) throw error;
        res.json(JSON.parse(response)); // Parse the data & send it back to the html page
        /*
        array.filter to selcet an bject and delete it
        json.stringfy to write the file in
        fs.appendFIle
        fitler for the id value, then delete that value.
        */
    })
});

app.post('/api/notes', (req, res) => {
    const note = createNewNote(req.body, notes); // call createNewNote with the user entered note and the exsisting notes array in notes.json
    res.json(note); // send response of new note back to front end so it is rendered on save
});

// route to the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// * wildcard to return to index.html if an unexpected route is entered by the user
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


// listen at the port variable
app.listen(PORT, () => {
    console.log("Listening at http://localhost:" + PORT);
})