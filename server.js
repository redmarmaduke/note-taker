const Express = require('express');
const FS = require('fs');
const Path = require('path');

const PORT = 80;

const express = Express();
express.use(Express.json()); // application/json
express.use(Express.urlencoded({ extended: true })); // application/x-www-form-urlencoded
express.use(Express.static('public')); // specify root directory for serving static assets

express.get("/notes", function (request, response) {
    response.sendFile(Path.join(__dirname, '/public/notes.html'));
})

// return all saved notes in db.json as JSON
express.get("/api/notes", function (request, response) {
    let db = JSON.parse(FS.readFileSync("./db/db.json"));
    for (let i = 0; i < db.length; ++i) {
        db[i].id = i+1;
    }
    response.json(db);
});

// add note to the db.json file
// return the new note to the client.
express.post("/api/notes", function (request, response) {
    let db = JSON.parse(FS.readFileSync("./db/db.json"));
    db.push(request.body);
    FS.writeFileSync("./db/db.json", JSON.stringify(db));

    response.json({
        "title" : request.body.title,
        "text" : request.body.text,
        "id": db.length
    });
});

// delete id from db.json
express.delete("/api/notes/:id", function (request, response) {
    let id = parseInt(request.params.id);
    if (id === NaN) {
        response.sendStatus(400); // bad request ie ill formed
        return;
    }

    let db = JSON.parse(FS.readFileSync("./db/db.json"));

    if (id === 0 || id > db.length) {
        response.sendStatus(403); // forbidden ie. well formed but incorrect
        return;
    }

    db = [ ...db.slice(0,id-1), ...db.slice(id) ]; 

    FS.writeFileSync("./db/db.json", JSON.stringify(db));

    response.sendStatus(200); // ok
});

express.get("*", function (request, response) {
    response.sendFile(Path.join(__dirname, '/public/index.html'));
});

express.listen(PORT, function () {
    console.log("Server listening on PORT:", PORT);
});
