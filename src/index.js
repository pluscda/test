import AotterPlayer from '../lib/advLib'
import './css/style.css'


let cbAdLoaded = (id) => {  // id === player_aotter1 or player_aotter2
    console.log('loaded ok aotter id : ' + id);
    //document.querySelector("#" + id).style.transform="scale(1)";
}
let cbAdFailed = (id) => {
    console.log('loaded fail aotter id : ' + id);
    // document.querySelector("#" + id).style.display = "none";
}
let cbAdImpression = (id) => {
    console.log('Impression aotter id : ' + id);
}

const initAdv = () => {
    // config vid; it will use youtube iframe API
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
    //config BANNER
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




