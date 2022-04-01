"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const getProjectName_1 = require("./getProjectName");
const parseString_1 = require("../utils/parseString");
exports.default = (uri) => __awaiter(void 0, void 0, void 0, function* () {
    const projectname = yield getProjectName_1.default(uri);
    const readmeConfig = vscode_1.workspace.getConfiguration('simple.readme.settings');
    const app_name = new parseString_1.ParseString(projectname).toTitleCase();
    const repository = new parseString_1.ParseString(app_name).toKebabLowerCase();
    const app_url = new parseString_1.ParseString(app_name).toContinuosLowerCase();
    const github = readmeConfig.get('github') || '{{YOUR_GITHUB_USERNAME}}';
    const author = readmeConfig.get('name') || '{{YOUR_NAME}}';
    return {
        datas: {
            app_name,
            repository,
            app_url,
            github,
            author,
        },
        lang: readmeConfig.get('lang') || 'en'
    };
});
//# sourceMappingURL=getDatas.js.map