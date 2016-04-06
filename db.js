var mongoose = require("mongoose");
var random = require("mongoose-simple-random");
var mongoosePaginate = require("mongoose-paginate");

var doomImageSchema = mongoose.Schema({
  author: String,
  permalink: String,
  date: Date,
  filename: String,
  filepath: String,
  _id: String,
  meta: {
    reportCount: Number
  }
});

doomImageSchema.plugin(random);
doomImageSchema.plugin(mongoosePaginate);

var DoomImage = mongoose.model("DoomImage", doomImageSchema);

module.exports = {

  createNew: function(imageData, callback) {
    DoomImage.create(imageData, callback);
  },

  getPage: function(options, callback) {
    // Need way to use regex in the query object
    // Or it would be useful, anyway
    DoomImage.paginate({ }, {
      page: options.page || 1,
      limit: options.limit || 10
    }, callback);
  },

  // TODO: function to update metadata

  getRandom: function(options, callback) {
    // TODO
  }

};
