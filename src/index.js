import AotterPlayer from '../lib/advLib'
import './css/style.css'
//window.alert = () => {};

let cbAdLoaded = (el) => {
    console.log('data is loaded ok');
    // /el.style.transform="scale(0)";
}
let cbAdFailed = (data) => {

}
let cbAdImpression = (data) => {

}

const initAdv = () => {
    // config vid
    let config =  {
       width: 650,
       height: 390,
       id: 'player_aotter1',
       loadType: 'VIDEO',
       events: {
        cbAdLoaded: cbAdLoaded,
        cbAdFailed: cbAdFailed,
        cbAdImpression: cbAdImpression,
       }
    };
    new AotterPlayer(config);
    //config img
    config =  {
        id: "player_aotter2",
        loadType: 'BANNER',
        events: {
         cbAdLoaded: cbAdLoaded,
         cbAdFailed: cbAdFailed,
         cbAdImpression: cbAdImpression,
        }
     };
     new AotterPlayer(config);
}//initAdv

if (window.addEventListener) {
    window.addEventListener('load', initAdv);
} else if (window.attachEvent) {
    window.attachEvent('onload', initAdv);
}
if (module.hot)       // eslint-disable-line no-undef
  module.hot.accept() // eslint-disable-line no-undef




