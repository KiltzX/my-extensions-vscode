"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationAborted = void 0;
class OperationAborted extends Error {
    constructor(message) {
        super(message);
    }
    toString() {
        return 'OperationAborted';
    }
}
exports.OperationAborted = OperationAborted;
//# sourceMappingURL=operation-aborted.js.map