"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash = require("lodash");
const vscode_languageserver_1 = require("vscode-languageserver");
function createLineReferenceFromSourceMap(refractSourceMap, document, documentLines) {
    const firstSourceMap = lodash.first(refractSourceMap);
    if (typeof (firstSourceMap) === 'undefined') {
        return {
            endIndex: documentLines[documentLines.length - 1].length,
            endRow: documentLines.length - 1,
            startIndex: 0,
            startRow: 0,
        };
    }
    const sourceMapArray = lodash.map(firstSourceMap.content, (sm) => {
        return {
            charCount: lodash.last(sm),
            charIndex: lodash.head(sm),
        };
    });
    // I didn't find any useful example of multiple sourcemap elements.
    const sourceMap = lodash.head(sourceMapArray);
    const sourceSubstring = document.substring(sourceMap.charIndex, sourceMap.charIndex + sourceMap.charCount);
    const sourceLines = sourceSubstring.split(/\r?\n/g);
    if (sourceSubstring === '\n' || sourceSubstring === '\r') {
        // It's on a newline which I cannot show in the document.
        return {
            endIndex: lodash.last(documentLines).length,
            endRow: documentLines.length,
            startIndex: 0,
            startRow: 0,
        };
    }
    const startRow = document.substring(0, sourceMap.charIndex).split(/\r?\n/g).length - 1;
    const endRow = startRow + sourceLines.length - 1;
    const startIndex = documentLines[startRow].indexOf(lodash.head(sourceLines));
    const endIndex = documentLines[endRow].length;
    return {
        startRow,
        endRow,
        startIndex,
        endIndex,
    };
}
exports.createLineReferenceFromSourceMap = createLineReferenceFromSourceMap;
function query(element, elementQueries, container = '') {
    /*
      NOTE: This function is a copy paste of https://github.com/apiaryio/refract-query
      The reason for that was to change some of its behavior and update it to use
      lodash 4. When the PR I opened in the original repo will be merged, this can
      be safely removed.
    */
    if (!element.content) {
        return [];
    }
    if (!lodash.isArray(element.content)) {
        return [];
    }
    const arrayOfArrayOfResults = lodash.map(elementQueries, (elementQuery) => {
        const filterResult = lodash.filter(element.content, elementQuery.query);
        lodash.forEach(filterResult, (res) => {
            res.symbolKind = elementQuery.symbolKind;
            res.container = container;
        });
        return filterResult;
    });
    const results = lodash.flatten(arrayOfArrayOfResults);
    return lodash
        .chain(element.content)
        .map((nestedElement) => {
        return query(nestedElement, elementQueries, decodeURI(lodash.get(nestedElement, 'meta.title.content', lodash.get(nestedElement, 'attributes.href.content', lodash.get(nestedElement, 'meta.title')))));
    })
        .flatten()
        .concat(results)
        .value();
}
exports.query = query;
function extractSymbols(element, document, documentLines, symbolsType) {
    const queryResults = query(element, symbolsType);
    return lodash.transform(queryResults, (result, queryResult) => {
        /*
          WARNING: This might be your reaction when you'll look into this code: ????
          Thing is there is no really source map here and I do not want to solve this
          thing in this release. The long term idea would be to wait till the underlying
          parser will be updated to generate sourcemaps on generated content as well
          and everybody will be happy; till that moment, please bear with me.
        */
        let sourceMap;
        ['meta.title.attributes.sourceMap',
            'attributes.href.attributes.sourceMap',
            (qs) => query(qs, [{ query: { attributes: { method: {} } }, symbolKind: 0 }]),
        ].some((path) => {
            if (typeof (path) === 'function') {
                sourceMap = lodash.get(path(queryResult)[0], 'attributes.method.attributes.sourceMap');
                return true;
            }
            else {
                if (lodash.has(queryResult, path)) {
                    sourceMap = lodash.get(queryResult, path);
                    return true;
                }
            }
        });
        const lineReference = createLineReferenceFromSourceMap(sourceMap, document, documentLines);
        let description = '';
        ['meta.title.content',
            'attributes.href.content',
            (qs) => query(qs, [{ query: { attributes: { method: {} } }, symbolKind: 0 }]),
        ].some((path) => {
            if (typeof (path) === 'function') {
                description = decodeURI(lodash.get(path(queryResult)[0], 'attributes.method.content'));
                return true;
            }
            else {
                if (lodash.has(queryResult, path)) {
                    description = decodeURI(lodash.get(queryResult, path));
                    return true;
                }
            }
        });
        if (!lodash.isEmpty(lineReference)) {
            result.push(vscode_languageserver_1.SymbolInformation.create(description, queryResult.symbolKind, vscode_languageserver_1.Range.create(lineReference.startRow, lineReference.startIndex, lineReference.endRow, lineReference.endIndex), null, queryResult.container));
        }
    });
}
exports.extractSymbols = extractSymbols;
//# sourceMappingURL=refractUtils.js.map