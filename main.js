import {Window} from "./modules/window.js"
import * as util from "./modules/util.js"
import { TitleScreen } from './modules/titlescreen.js';
const canvas = document.querySelector('canvas');
canvas.width = 1024;
canvas.height = 576;
//util.combatBasique()
let window = new Window(document.querySelector('canvas'))
let title = new TitleScreen(window)
window.addInterface(title)