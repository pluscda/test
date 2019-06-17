import ajax from './js/adder'
import './css/style.css'

ajax();

if (module.hot)       // eslint-disable-line no-undef
  module.hot.accept() // eslint-disable-line no-undef

