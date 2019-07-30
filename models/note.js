const mongoose = require("mongoose"); // Use this mongoDB library for db interactions
// Prevents the use of a deprecated method by mongoose's API. For details
// check https://stackoverflow.com/questions/52572852/deprecationwarning-collection-findandmodify-is-deprecated-use-findoneandupdate
mongoose.set('useFindAndModify', false);
// These should be env vars saved in a config file
const url =  process.env.MONGODB_URI
console.log(`Connecting to ${url}`)
mongoose.connect(url, { useNewUrlParser: true })
.then(res => console.log('connected to mongoDB'))
.catch(err => console.log('error connecting to mongoDB:', err.message));

// Define the MongoDB schema for note objects
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
});

// We replace part of the callback that serializes each Note obj to JSON format to remove unwanted properties and
// convert the _id obj to a string.
noteSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

// Build a model using the schema and call it "Note". The collection will be automatically pluralized and named "notes"
// Notice the use of node style exports instead of ES6 exports
module.exports = mongoose.model("Note", noteSchema);
