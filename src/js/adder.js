const sendAjax = (url=`http://localhost:8080/ads?type=BANNER`) => {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
    function reqListener () {
        console.log(this.responseText);
    }
}


export default sendAjax;