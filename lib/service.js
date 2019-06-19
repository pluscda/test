
const URL_PREFIX = 'http://localhost:8080/ads?type=';

const sendAjax = ( type="VIDEO", successCb, failCb ) => {
    try{
        let oReq = new XMLHttpRequest();
        let n = '&_random=' + +new Date();
        oReq.addEventListener("load", reqListener);
        oReq.addEventListener("error", transferFailed);
        oReq.open("GET", URL_PREFIX + type + n , true);
        oReq.withCredentials = true;
        oReq.send();
    }catch(err){
        failCb("An error occurred while ajax.");
    }
    function reqListener (evt) {
        console.log(this.responseText);
        successCb(JSON.parse(this.responseText));
    }

    function transferFailed (evt) {
        console.log("An error occurred while ajax.");
        failCb("An error occurred while ajax.");
    }
}

// to fix CORS issue.
const sendImpression = ( url ) => {
    let form = document.createElement("form");
    form.method = "POST";
    form.action = url;   
    form.target = "dummyframe";
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
export {sendImpression};
export default sendAjax;