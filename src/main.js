import firebase from 'firebase'
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueClipboard from 'vue-clipboard2'
import('firebase/functions')
// import Meta from 'vue-meta';

// Vue.use(Meta)
VueClipboard.config.autoSetContainer = true // add this line

Vue.use(VueClipboard)
Vue.use(VueAxios, axios)
var VueCookie = require('vue-cookie')
// Tell Vue to use the plugin
// import moment from 'vue-moment'
// moment.locale('ja');
Vue.use(VueCookie)

// Vue.use(moment);

Vue.config.productionTip = false

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyATJJeB1l-eU14Mf-qN0ISz1xMYbgneTLk',
  authDomain: 'vue-chat-app-2f191.firebaseapp.com',
  databaseURL: 'https://vue-chat-app-2f191.firebaseio.com',
  projectId: 'vue-chat-app-2f191',
  storageBucket: '',
  messagingSenderId: '249080061823',
  appId: '1:249080061823:web:75c64b2fd7a1f079'
}
firebase.initializeApp(config)
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
