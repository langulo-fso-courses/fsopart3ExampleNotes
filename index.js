require("dotenv").config(); // Import environment vars from .env file using dotenv lib
const express = require("express");
const app = express(); //Express instance
const parser = require("body-parser");
const cors = require("cors"); // Cross-origin request middleware
const Note = require("./models/note"); // Obj is imported already instanced

app.use(express.static("build"));
app.use(cors());
app.use(parser.json());

// Notes, in JS plain obj format
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
];

const generateId = () => {
  // get the highest id currently on the list of notes
  // triple dots unpack the array returned to find the max
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
  return maxId + 1;
};

// Main entry point
app.get("/", (req, res) => {
  res.send("<h1>Landing page!</h1>");
});

app.get("/api/notes", (req, res) => {
  // Empty object works like an SQL SELECT *
  // We explicitly use the .toJSON() method from the note obj instead of delegating to middleware
  Note.find({}).then(notes => res.json(notes.map(note => note.toJSON())));
});

app.get("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  // We use res.json() additionally to toJSON() so the res headers are set correctly
  Note.findById(noteId).then(note => res.json(note.toJSON()));
});

app.post("/api/notes", (req, res) => {
  // body-parser turns the incoming JSON data into an object and puts it in req.body
  const body = req.body;
  // If there's no data, return an error
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  // Make a new note
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  });

  // Call the note's toJSON() to preserve the custom format
  note
    .save()
    .then(savedNote => res.json(savedNote.toJSON()))
    .catch(error => {
      console.log("Post note error: ", error);
    });
});

app.put("/api/notes/:id", (req, res) => {
  // body-parser turns the incoming JSON data into an object and puts it in req.body
  const body = req.body;
  // If there's no data, return an error
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  // Make the updated note
  const updatedNote = {
    content: body.content,
    important: body.important,
    date: new Date(),
    id: body.id
  };

  notes = notes.filter(note => note.id !== updatedNote.id).concat(updatedNote);
  res.json(updatedNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  // This doesn't actually delete the note, it removes it from the variable in memory
  notes = notes.filter(n => n.id !== id);
  res.status(204).end();
});

// use the default env PORT variable or port 3001 as default
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
