const VNode = require('virtual-dom').VNode;
const VText = require('virtual-dom').VText;

const defaultTextFormattings = [
  {
    property: 'content',
    render: function content (child) {
      return new VText(child);
    },
    get: function getContent (elm) {
      return elm.nodeType === 3 && elm.nodeValue;
    }
  },
  {
    property: 'href',
    render: function href (child, obj) {
      return new VNode('A', { href: obj.href }, [ child ]);
    },
    get: function getHref (elm) {
      if (elm.nodeType !== 1) {
        return null;
      }
      return (elm.nodeName.toLowerCase() === 'a' && elm.href || null);
    }
  },
  {
    property: 'italic',
    render: function italic (child) {
      return new VNode('EM', {}, [ child ]);
    },
    get: function getItalic (elm) {
      if (elm.nodeType !== 1) {
        return false;
      }
      const nodeName = elm.nodeName.toLowerCase();
      return nodeName === 'i' ||
        nodeName === 'em' ||
        elm.style.fontStyle === 'italic';
    }
  },
  {
    property: 'bold',
    render: function bold (child) {
      return new VNode('STRONG', {}, [ child ]);
    },
    get: function getBold (elm) {
      if (elm.nodeType !== 1) {
        return false;
      }
      const fontWeight = elm.style.fontWeight;
      const nodeName = elm.nodeName.toLowerCase();
      return nodeName === 'b' ||
        nodeName === 'strong' ||
        fontWeight === 'bold' ||
        parseInt(fontWeight, 10) >= 700;
    }
  }
];

module.exports = function (opts) {
  return opts.customTextFormattings
    ? defaultTextFormattings.concat(opts.customTextFormattings) : defaultTextFormattings;
};
