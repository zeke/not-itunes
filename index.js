var itunes = require('itunes-library-stream')
var path = require('path')
var fs = require('fs')
var uniq = require('lodash').uniq
var pluck = require('lodash').pluck
var fmt = require('util').format

var app = {}

var tracks = []
var paths = {
  itunesLibraryXML: path.resolve("./iTunes Music Library.xml"),
  tracks: path.resolve("./tracks.json")
}

var loadTracks = function(cb) {
  if (fs.existsSync(paths.tracks)) {
    tracks = require(paths.tracks)
    cb()
  } else {
    fs.createReadStream(paths.itunesLibraryXML)
      .pipe(itunes.createTrackStream())
      .on('data', function(track) {

        // Infer file extension from filename
        var ext = track.Location.match(/\.(\w+)$/)
        if (ext) track.Extension = ext[1].toLowerCase();

        tracks.push(track)
      })
      .on('end', function() {
        fs.writeFileSync(paths.tracks, JSON.stringify(tracks, null, 2))
        cb()
      })
  }
}

loadTracks(function(){

  console.log("loaded tracks")
  // app.fives = tracks.filter(function(track) { return track.Rating === 100 })
  // console.log(pluck(uniq(tracks, 'Extension'), 'Extension'))
  // console.log(pluck(uniq(tracks, 'Kind'), 'Kind'))

  // tracks.slice(0,200).forEach(function(track) {
  //
  // })
})
