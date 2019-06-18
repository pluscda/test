import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import data from '../../src/data/mock-data.json'

const random = (min, max) => Math.floor(Math.random() * (max - min) ) + min;
const genAdId = () => `${+new Date()}-${random(0, 1000)}`;
var cors = require('cors');
var corsOptions = {
    origin: '*',
    credentials: true };


const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config),
            JS_FILE = path.join(DIST_DIR, 'aotterPlayer.js');
app.use(cors());
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))


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
    console.log('Pres2s Ctrl+C to quit.')
})
