import path from 'path'
import express from 'express'
const random = (min, max) => Math.floor(Math.random() * (max - min) ) + min;
const genAdId = () => `${+new Date()}-${random(0, 1000)}`;
import data from '../../src/data/mock-data.json'

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            JS_FILE = path.join(DIST_DIR, 'aotterPlayer.js');


app.use(express.static(DIST_DIR))

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials",true); 
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
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