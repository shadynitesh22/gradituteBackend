"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevConsole = void 0;
const emoji = ['💩', '👯‍', '😸', '🏄', '🚀', '🔥', '🎉', '😄', '🦁'];
const style = [
    'background-image: url("https://media.giphy.com/media/3o85xoi6nNqJQJ95Qc/giphy.gif")',
    'background-size: cover',
    'color: #fff',
    'padding: 10px 20px',
    'line-height: 35px'
].join(';');
const style_gradient = [
    'background: linear-gradient(to right, #5433ff, #20bdff, #a5fecb);',
    'color: #fff',
    'padding: 10px 20px',
    'line-height: 35px'
].join(';');
const style_emojis = [
    'background: #000',
    'color: #fff',
    'padding: 10px 20px',
    'line-height: 35px'
].join(';');
class DevConsole {
    static logWithGradient(text) {
        console.log(`%c ${text}`, style_gradient);
    }
    static logWithEmojis(text) {
        console.log(`%c ${text}`, style_emojis);
    }
    static logWithStyle(text) {
        console.log(`%c ${text}`, style);
    }
}
exports.DevConsole = DevConsole;
console.log();
//# sourceMappingURL=emojis.js.map