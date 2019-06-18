
import getAjax from './service'

class AotterPlayer {
     constructor(obj){
         let {  width = 600, 
                height = 390, 
                id= 'player_aotter1', 
                loadType = 'VIDEO' ,
                events = {},
            } 
            = obj ? obj : {};
         this.width = width;
         this.height = height;
         this.domSelector = id;
         this.loadType = loadType.toUpperCase() == 'VIDEO' ? true : false;
         this.cbAdLoaded = events.cbAdLoaded; 
         this.cbAdFailed = events.cbAdFailed;
         this.cbAdImpression = events.cbAdImpression;
         this.vidUrl = '';
         this.imgUrl = '';
         this.vidId = '';
         this.player = null;
         this.el = document.querySelector('#' + id);

         getAjax(loadType, this._cbAjaxOk.bind(this), this._cbAjaxFail.bind(this));
     }

    

    _cbAjaxOk(data = {}) {
         data.type === 'VIDEO' ? this._loadVid(data) : this.loadImg(data);
     }

    _cbAjaxFail(data){

    }
    
    _loadVid(data) {
        if(this.vidUrl) return;
        this.vidUrl = data.video_url;
        console.log(this.vidUrl);
        this.vidId = this.vidUrl.indexOf('youtube.com') ? this.vidUrl.split('www.youtube.com/embed/')[1] : '';
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        let checkYT = setInterval(() => {
            if(YT.loaded){
                this._loadYoutube(data);
                clearInterval(checkYT);
            }
        }, 100);
    }

     _loadYoutube() {
        console.log('youTubeIframeAPIReady');
        this.player = new YT.Player(this.domSelector, {
            height: this.height,
            width: this.width,
            videoId: this.vidId ,
            events: {
              'onReady': this._onPlayerReady.bind(this),
              'onStateChange': this._onPlayerStateChange.bind(this),
            }
        });
     }

     _onPlayerReady(event) {
       console.log('_onPlayerReady ' + this.domSelector);
       //event.target.playVideo();
        let el = document.querySelector('#' + this.domSelector);
        this.cbAdLoaded ? this.cbAdLoaded(el) : 'no cb found';
     }
     _onPlayerStateChange(event) {
        
     }
     _onStopVideo() {
        this.player.stopVideo();
     }
}

AotterPlayer.loaded = true;

export default AotterPlayer;