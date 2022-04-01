"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const confirm_start_1 = require("./confirm-start");
const request_glob_1 = require("./request-glob");
const select_workspace_folder_1 = require("./select-workspace-folder");
const use_default_excludes_1 = require("./use-default-excludes");
const prompts = { requestGlob: request_glob_1.requestGlob, useDefaultExcludes: use_default_excludes_1.useDefaultExcludes, confirmStart: confirm_start_1.confirmStart, selectWorkspaceFolder: select_workspace_folder_1.selectWorkspaceFolder };
exports.default = prompts;
//# sourceMappingURL=index.js.map