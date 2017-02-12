import Vue from 'vue'
import App from './App'
import Datepicker from 'main'

Vue.use(Datepicker)

new Vue({
  el: '#app',
  render: h => h(App)
})
