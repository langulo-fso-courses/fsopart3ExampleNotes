const mongoose = require("mongoose"); // Use this mongoDB library for db interactions

// No password? Eject the process (End)
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

// password must be passed in as a CLI arg
const password = process.argv[2];
// name of the database. Changing the name in the mongodb atlas service will automatically create a new db
const dbName = "note-app";

const url = `mongodb+srv://fosapps:${password}@luisangulo-ucxal.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true });

// Define the MongoDB schema for note objects
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
});

// Build a model using the schema and call it "Note". The collection will be automatically pluralized and named "notes"
const Note = mongoose.model("Note", noteSchema);

// "Note" creates instances of note objects using a plain js obj for the data field.
// Unlike literals, these objects have all the methods (save, destroy) needed to persist the data to mongo
/* const note = new Note({
  content: "FullOpenStack is cool",
  date: new Date(),
  important: false
}); */

// Lookup all the important notes and print them to the console
// An empty object acts like a select * (gets all records)
Note.find({important: false}).then(result => {
  result.forEach(note => {
    console.log(note);
  });
  mongoose.connection.close();
});

// mongoose methods return then-able objs
// if the db connection isn't closed, the program will run indefinitely
/* note.save().then(res => {
  console.log("note saved!", res);
  mongoose.connection.close();
}); */
