import adLib from '../lib/advLib'
import './css/style.css'
window.alert = () => {};


class AotterConfig {
    constructor(obj) {
        let {width, height, id, loadType} = obj;
        this.width = width;
        this.height = height;
        this.id = id;
        this.loadType = loadType;
        this.cbAdLoaded = this.cbAdLoaded.bind(this);
        this.cbAdFailed = this.cbAdFailed.bind(this);
        this.cbAdImpression = this.cbAdImpression.bind(this);
    }
    constructAotterObj(){
      const obj = {
            width: this.width,
            height: this.height,
            loadType: this.loadType,
            cbAdLoaded: this.cbAdLoaded,
            cbAdFailed: this.cbAdFailed,
            cbAdImpression: this.cbAdImpression,
      };
      return obj;
    }
    cbAdLoaded (data) {

    }
    cbAdFailed (data){

    }
    cbAdImpression(data){

    }
}

const initAdv = () => {
    let aotter1 = new AotterConfig( {
       width: 650,
       height: 390,
       id: 'player_aotter1',
       loadType: 'VIDEO',
    });

    const adObj = new adLib(aotter1.constructAotterObj());
}//initAdv

if (window.addEventListener) {
    window.addEventListener('load', initAdv);
} else if (window.attachEvent) {
    window.attachEvent('onload', initAdv);
}
if (module.hot)       // eslint-disable-line no-undef
  module.hot.accept() // eslint-disable-line no-undef




