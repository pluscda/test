
const URL_PREFIX = 'http://localhost:8080/ads?type=';

const sendAjax = ( type="VIDEO", successCb, failCb ) => {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.addEventListener("error", transferFailed);
    oReq.open("GET", URL_PREFIX + type);
    oReq.send();
    function reqListener (evt) {
        console.log(this.responseText);
        successCb(JSON.parse(this.responseText));
    }

    function transferFailed (evt) {
        console.log("An error occurred while ajax.");
        failCb("An error occurred while ajax.");
    }
}


export default sendAjax;