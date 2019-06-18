import path from 'path'
import express from 'express'
const random = (min, max) => Math.floor(Math.random() * (max - min) ) + min;
const genAdId = () => `${+new Date()}-${random(0, 1000)}`;
import data from '../../src/data/mock-data.json'
var cors = require('cors');
var corsOptions = {
    origin: '*',
    credentials: true };

app.use(cors(corsOptions));

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            JS_FILE = path.join(DIST_DIR, 'aotterPlayer.js');


app.use(express.static(DIST_DIR))
//get random ad from mock data
const getAd = (type = '') => {
    const ads = type
      ? data.filter(ad => ad.type === type)
      : data;
  
    const ad = ads[random(0, ads.length)];
    return {
      ...ad,
      id: genAdId()
    }
}

//api endpoint
app.get('/ads', (req, res) => {
    /**
     * type: requested ad type
     */
    const { type = '' } = req.query;
    res.json(getAd(type.toUpperCase()));
})

app.get('/aotterPlayer', (req, res) => {
    compiler.outputFileSystem.readFile(JS_FILE, (err, result) => {
    if (err) {
        return next(err)
    }
    res.send(result)
    res.end()
    })
})

app.get('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
  if (err) {
    return next(err)
  }
  res.set('content-type', 'text/html')
  res.send(result)
  res.end()
  })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})