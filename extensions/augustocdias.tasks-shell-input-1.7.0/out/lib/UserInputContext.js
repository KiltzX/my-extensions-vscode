"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserInputContext {
    constructor() {
        this.recordedInputs = {};
    }
    reset() {
        this.recordedInputs = {};
    }
    recordInput(inputId, taskValue) {
        this.recordedInputs[inputId] = taskValue;
    }
    lookupInputValue(inputId) {
        return this.recordedInputs[inputId];
    }
}
exports.UserInputContext = UserInputContext;
//# sourceMappingURL=UserInputContext.js.map