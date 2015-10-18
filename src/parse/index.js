'use strict';

var Set = require('es6-set');
var BLOCK_ELEMENTS = new Set(require('block-elements'));
var HEAD_NODE_NAMES = new Set([
  'TITLE', 'BASE', 'LINK', 'META', 'SCRIPT', 'NOSCRIPT', 'STYLE'
]);
var TEXT_ELEMENTS = {
  h1: 'header1',
  h2: 'header2',
  h3: 'header3',
  h4: 'header4',
  h5: 'header5',
  h6: 'header6',
  p: 'paragraph'
};

var setupRich = require('./rich');
var setupOptsFromElm = require('./opts-from-elm');

module.exports = function (opts) {
  var optsFromElm = setupOptsFromElm(opts);
  var rich = setupRich(opts);
  return function getResult (elm) {
    var result = [];

    parse([elm], {}, result);

    return result;
  };

  function parse (elms, textOpts, result) {
    for (var i = 0; i < elms.length; i++) {
      var elm = elms[i];

      // ELEMENT_NODE
      if (elm.nodeType === 1 && !HEAD_NODE_NAMES.has(elm.nodeName)) {
        elementNode(elm, textOpts, result);
      }

      // TEXT_NODE
      if (elm.nodeType === 3 && elm.nodeValue.length > 0) {
        result.push(optsFromElm(textOpts, elm));
      }
    }
  }

  function elementNode (elm, textOpts, result) {
    var nodeName = elm.nodeName.toLowerCase();
    var isBlockElement = BLOCK_ELEMENTS.has(nodeName);

    if (nodeName === 'br') {
      result.push({ type: 'linebreak' });
      return;
    }

    if (nodeName === 'span') {
      if (elm.className === 'selection-marker-start') {
        result.push({ type: 'selection-marker', start: true });
        return;
      }

      if (elm.className === 'selection-marker-end') {
        result.push({ type: 'selection-marker', end: true });
        return;
      }
    }

    var richResult = rich(elm);

    if (richResult) {
      result.push(richResult);
      return;
    }

    if (isBlockElement) {
      var blockElement = {
        type: TEXT_ELEMENTS[nodeName] || 'block',
        children: []
      };
      result.push(blockElement);
      if (elm.childNodes.length) {
        parse(elm.childNodes, optsFromElm(textOpts, elm), blockElement.children);
      }

      return;
    }

    if (elm.childNodes.length) {
      parse(elm.childNodes, optsFromElm(textOpts, elm), result);
    }
  }
};