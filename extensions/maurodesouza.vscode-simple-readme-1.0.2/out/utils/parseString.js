"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseString = void 0;
class ParseString {
    constructor(text) {
        this.toContinuosLowerCase = () => {
            return this.words.map(word => word.toLowerCase()).join('');
        };
        this.toKebabLowerCase = () => {
            return this.words.map(word => word.toLowerCase()).join('-');
        };
        this.toTitleCase = () => {
            const words = this.text.split(/[\. ~*-]/g);
            return words.map(word => {
                if (word.length === 1) {
                    return word;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ').trim();
        };
        this.text = text;
        this.words = text.split(/[ ]/g);
    }
}
exports.ParseString = ParseString;
//# sourceMappingURL=parseString.js.map