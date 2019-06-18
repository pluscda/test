
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
         this.vidUrl = '';
         this.imgUrl = '';
         this.vidId = '';
         this.player = null;
         this.el = document.querySelector('#' + id);
         this.el.style.transform = "scale(0)"; // hide it before data ready
         this.el.style.display = loadType == 'VIDEO'? "block" : "inline-block";
         this.el.style.textDecoration = "none";
         getAjax(loadType, this._cbAjaxOk.bind(this), this._cbAjaxFail.bind(this));
     }

    

    _cbAjaxOk(data = {}) {
        let id = localStorage.getItem(data.id);
        if(id || !data.id) return;
        localStorage[data.id] = data.id;
        let el = document.querySelector('#' + this.domSelector);
        if(!data.success) {
            this.cbAdFailed ? this.cbAdFailed(el) : '';
            el.style.transform ="scale(0)"; // hide it
        }else {
            data.type === 'VIDEO' ? this._loadVid(data) : this._loadImg(data);
        }
     }

    _cbAjaxFail(data){
        let el = document.querySelector('#' + this.domSelector);
        el.style.transform ="scale(0)"; // hide it
    }

    _loadImg(data) {
        let id = '#' + this.domSelector;
        let el = document.querySelector('#' + this.domSelector);
        let color = el.dataset.bgColor;
        el.style.background = color;
        // below select just for demo ; the better select way should include id + attr 
        document.querySelector(`${id}[data-trek="URL"]`).setAttribute('href', data.impression_url);
        let img = document.querySelector('[data-trek="IMG_ICON"]');
        if(img) {
            img.setAttribute('src', data.image);
            img.setAttribute('width', 80);
            img.setAttribute('high', 80);
        }
        img = document.querySelector('[data-trek="IMG_ICON_HD"]');
        if(img) {
            img.setAttribute('src', data.image);
            img.setAttribute('width', 300);
            img.setAttribute('high', 300);
        }
        img = document.querySelector('[data-trek="IMG_ICON_MAIN"]');
        if(img) {
            img.setAttribute('src', data.image);
            img.setAttribute('width', 1280);
            img.setAttribute('high', 720);
        }
        // not find at HTML ; apply config width/height 
        if(!img.getAttribute('width')) {
            img.setAttribute('src', data.image);
            img.setAttribute('width', this.width);
            img.setAttribute('high', this.height);
        }

        document.querySelector('[data-trek="TITLE"]').innerHTML = data.title;
        document.querySelector('[data-trek="TEXT"]').innerHTML = data.description;
        el.style.transition = "0.5s transform ease-in-out";
        setTimeout(() => { el.style.transform ="scale3d(1,1,1)" }, img ? 2000 : 1000); 
        sendImpression(data.impression_url);
        this.cbAdImpression(el);
    }
    _loadVid(data) {
        if(this.vidUrl) return;
        this.vidUrl = data.video_url;
        //console.log(this.vidUrl);
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
       // console.log('youTubeIframeAPIReady');
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
       let el = document.querySelector('#' + this.domSelector);
       el.style.transition = "0.5s transform ease-in-out";
       el.style.transformOrigin = "left";
       el.style.transform ="scale3d(1,1,1)";
       //event.target.playVideo();
       
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