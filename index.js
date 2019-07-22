const http = require("http");
const express = require("express");
const app = express(); //Express instance
const parser = require("body-parser");
const cors = require("cors"); // Cross-origin request middleware

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

app.get("/notes", (req, res) => {
  console.log('notes', req)
  res.json(notes);
});

app.get("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(n => {
    return n.id === id;
  });
  note ? res.json(note) : res.status(404).end(); // End the response
});

app.post("/notes", (req, res) => {
  // body-parser turns the incoming JSON data into an object and puts it in req.body
  const body = req.body;
  // If there's no data, return an error
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  // Make a new note
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId()
  };

  // You can get the headers via the request obj
  // console.log(req.headers)
  notes = notes.concat(note);
  res.json(note);
});

app.put("/notes/:id", (req, res) => {});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  // This doesn't actually delete the note, it removes it from the variable in memory
  notes = notes.filter(n => n.id !== id);
  res.status(204).end();
});

const port = 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));