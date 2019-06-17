import adLib from '../lib/advLib'
import './css/style.css'
window.alert = () => {};
const initAdv = () => {
    const adObj = new adLib({});
}








if (window.addEventListener) {
    window.addEventListener('load', initAdv);
} else if (window.attachEvent) {
    window.attachEvent('onload', initAdv);
}
if (module.hot)       // eslint-disable-line no-undef
  module.hot.accept() // eslint-disable-line no-undef

