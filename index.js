require("dotenv").config(); // Import environment vars from .env file using dotenv lib
const express = require("express");
const app = express(); //Express instance
const parser = require("body-parser");
const cors = require("cors"); // Cross-origin request middleware
const Note = require("./models/note"); // Obj is imported already instanced
const idErrorMiddleware = require("./errorHandlers/badId");
const unknownEndpointMiddleware = require("./errorHandlers/unknownendpoint");

// The order of execution of middleware is the same as the order in which it is passed:
app.use(express.static("build")); // Runs 1st
app.use(cors()); // Runs 2nd...
app.use(parser.json());

// Main entry point
app.get("/", (req, res) => {
  res.send("<h1>Landing page!</h1>");
});

app.get("/api/notes", (req, res) => {
  // Empty object works like an SQL SELECT *
  // We explicitly use the .toJSON() method from the note obj instead of delegating to middleware
  Note.find({})
    .then(notes => res.json(notes.map(note => note.toJSON())))
    .catch(err => {
      console.log("get all notes error: ", err);
      res.status(400).send({ error: err.message });
    });
});

// We add the "next" express function to use our custom middleware
app.get("/api/notes/:id", (req, res, next) => {
  const noteId = req.params.id;
  // We use res.json() additionally to toJSON() so the res headers are set correctly
  Note.findById(noteId)
    .then(note => {
      if (note) {
        res.json(note.toJSON());
      } else {
        res.status(404).send();
      }
    })
    // Passing the error to an error handling middleware already registered
    .catch(error => next(error));
});

app.post("/api/notes", (req, res) => {
  // body-parser turns the incoming JSON data into an object and puts it in req.body
  const body = req.body;
  // If there's no data, return an error
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  } else {
    const newNote = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date()
    });
    newNote
      .save()
      .then(() => {
        res.status(201).json(note => note.toJSON());
      })
      .catch(err => {
        console.log("Error creating note: ", err);
        res.status(400).send({ error: err.message });
      });
  }
});

app.put("/api/notes/:id", (req, res) => {
  // body-parser turns the incoming JSON data into an object and puts it in req.body
  const body = req.body;

  // Make the updated note. We don't use a Note obj, we use the raw data
  // The id is no longer appended, since we're using atlas
  const note = {
    content: body.content,
    important: body.important
  };
  // new:true in the options arg allows using the new note instead of the original
  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => res.json(updatedNote.toJSON()))
    .catch(error => next(error));
});

// TODO: test at the end
app.delete("/api/notes/:id", (req, res) => {
  // TODO: What's the difference between "remove" and "delete"?
  Note.findByIdAndRemove(req.params.id)
    .then(res => res.status(204).end())
    .catch(error => next(error));
});

app.use(unknownEndpointMiddleware); // Runs second to last, it MUST be in this order
app.use(idErrorMiddleware); // Runs last. It MUST run last in order to work

// use the default env PORT variable or port 3001 as default
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
