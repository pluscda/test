
import getAjax , {sendImpression}from './service'

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
         this.cbAdLoaded = events.cbAdLoaded; 
         this.cbAdFailed = events.cbAdFailed;
         this.cbAdImpression = events.cbAdImpression;
         this.playTimer = '';
         this.vidUrl = '';
         this.imgUrl = '';
         this.vidId = '';
         this.el = document.querySelector('#' + id);
         this.el.style.transform = "scale(0)"; // hide it before data ready
         this.el.style.display = loadType == 'VIDEO'? "block" : "inline-block";
         this.el.style.textDecoration = "none";
         getAjax(loadType, this._cbAjaxOk.bind(this), this._cbAjaxFail.bind(this));
         this._constructHiddenIframe();
     }

    _constructHiddenIframe() {
        var ifrm = document.createElement("iframe");
        ifrm.setAttribute("name", 'dummyframe');
        ifrm.setAttribute("id", 'dummyframe');
        ifrm.style.transform = "scale(0)";
        document.body.appendChild(ifrm);
    }

    _cbAjaxOk(data = {}) {
        let id = localStorage.getItem(data.id);
        if(id || !data.id) return;
        localStorage[data.id] = data.id;
        let el = document.querySelector('#' + this.domSelector);
        if(!data.success) {
            this.cbAdFailed ? this.cbAdFailed(el) : '';
            el.style.transform ="scale(0)"; // hide it
            this.cbAdFailed(this.domSelector);
        }else {
            data.type === 'VIDEO' ? this._loadVid(data) : this._loadImg(data);
        }
     }

    _cbAjaxFail(data){
        let el = document.querySelector('#' + this.domSelector);
        el.style.transform ="scale(0)"; // hide it
        this.cbAdFailed(this.domSelector);
    }

    _loadImg(data) { // ref: https://github.com/aotter/trek-web-sdk-doc/blob/master/docs/customize.md
        if(data.image) {
            this.cbAdLoaded(this.domSelector);
        }else {
            this.cbAdFailed(this.domSelector);
            return;
        }
        let el = document.querySelector('#' + this.domSelector);
        let color = el.dataset.bgColor;
        el.style.background = color; 
        el.style.textIndent = "30px";
        el.setAttribute('href', data.impression_url);
        let img = el.querySelector('[data-trek="IMG_ICON"]');
        if(img) {
           this.width= this.height = 80;
        }
        img = el.querySelector('[data-trek="IMG_ICON_HD"]');
        if(img) {
           this.width= this.height = 300;
        }
        img = el.querySelector('[data-trek="IMG_ICON_MAIN"]');
        if(img) {
            this.width = 1280;
            this.height = 720;
        }
        // if not find at HTML , apply config width/height ; suggest use javascript to config ; no HTML config
        // otherwise, it is very long checking like above image; code is repeating.
        img = el.querySelector('img');
        if(img) {
            img.setAttribute('src', data.image);
            img.setAttribute('width', this.width);
            img.setAttribute('high', this.height);
        }

        el.querySelector('[data-trek="TITLE"]').innerHTML = data.title;
        el.querySelector('[data-trek="TEXT"]').innerHTML = data.description;
        el.style.transition = "0.5s transform ease-in-out";
        setTimeout(() => { el.style.transform ="scale3d(1,1,1)"; sendImpression(data.impression_url); }, img ? 2000 : 1000); 
        this.cbAdImpression(this.domSelector);
    }
    _loadVid(data) {
        if(this.vidUrl) return;
        this.vidUrl = data.video_url;
        this.vidId = this.vidUrl.indexOf('youtube.com') ? this.vidUrl.split('www.youtube.com/embed/')[1] : '';
        if(!this.vidId) return;
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
       // console.log('youTubeIframeAPIReady');
       new YT.Player(this.domSelector, {
            height: this.height,
            width: this.width,
            videoId: this.vidId ,
            events: {
              'onError': this._onPlayerError.bind(this),
              'onReady': this._onPlayerReady.bind(this),
              'onStateChange': this._onPlayerStateChange.bind(this),
            }
        });
     }

     _onPlayerError(event) {
        this.cbAdFailed(this.domSelector);
     }
     _onPlayerReady(event) {
       let el = document.querySelector('#' + this.domSelector);
       el.style.transition = "0.5s transform ease-in-out";
       el.style.transformOrigin = "left";
       el.style.transform ="scale3d(1,1,1)";
       this.cbAdLoaded ? this.cbAdLoaded(el) : 'no cb found';
     }
     _onPlayerStateChange(event) {
        if(this.playTimer === false) return;
        if (event.data == YT.PlayerState.PLAYING) {
            this.playTimer = setInterval( () =>  this._checkVidPlayDuration(event), 2000);
        }else {
            clearInterval(this.playTimer);
        }
     }

     _checkVidPlayDuration(event) {
        let current = event.target.getCurrentTime();
        let duration = event.target.getDuration();
        let currentPercent = (current && duration
                              ? current*100/duration
                              : 0);
        console.log('youtube currentPercent: ' + currentPercent);
        if(currentPercent > 50 ) {
            clearInterval(this.playTimer);
            this.playTimer = false;
            setTimeout( () => {
                sendImpression(data.impression_url);
                this.cbAdImpression(this.domSelector);
            }, 1000);
        }
        
     }
     _onStopVideo(event) {
        event.target.stopVideo();
     }
}

AotterPlayer.loaded = true;
export default AotterPlayer;

/*
{  
  "id": 2,
  "type": "VIDEO",
  "title": "Google Pixel 3a XL使用一週心得 拍照有輸Pixel 3嗎？",
  "description": "Google新出的Pixel 3a系列，定位在中階機款，卻擁有OLED螢幕，和可比旗艦機的強悍拍照功能，那整體使用體驗到底是如何呢？使用體驗跟Pixel 3有差很多嗎？",
  "image": "https://agirls.aotter.net/media/60dcde35-6798-4784-8985-78323c7ec75b.jpg",
  "video_url": "https://www.youtube.com/embed/lquZJyVj3-I",
  "impression_url": "https://agirls.aotter.net?imp=2",
  "success": true
}
*/