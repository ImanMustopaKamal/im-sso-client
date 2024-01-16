import Vue from 'vue';
import { saveAs } from 'file-saver';

Vue.prototype.$fileSaver = saveAs;