'use strict';

function extractQueryArguments(url) {
  const questionMarkIndex = url.indexOf('?');

  if (questionMarkIndex === -1) {
    return {};
  }

  const queryPart = url.substr(questionMarkIndex + 1);
  const queryArgs = queryPart.split('&');

  const result = {};

  for (const queryArg of queryArgs) {
    const equalsIndex = queryArg.indexOf('=');
    if (equalsIndex === -1) {
      console.warn('Non-assignment found in query arguments: %s', queryArg);
      continue;
    }

    result[decodeURIComponent(queryArg.substr(0, equalsIndex))] =
        decodeURIComponent(queryArg.substr(equalsIndex + 1));
  }

  return result;
}

function parseYoutubeLink(href) {
  if (/http(s)?:\/\/(www\.)?youtube\.com\/watch\?.*/.matches(href)) {

  }
}

function processYoutubeLinks(elem) {
  // Find all appropriate anchors in the subtree.
  const anchors = elem.querySelectorAll('a');
  if (anchors.length > 0) {
    console.log(anchors);
  }
}

const IteratorUtils = {
  *iterateDom(node) {
    yield node;

    let currChild = node.firstChild;
    while (currChild) {
      yield* IteratorUtils.iterateDom(currChild);
      currChild = currChild.nextSibling;
    }
  },

  *filterIter(f, iter) {
    for (const currValue of iter) {
      if (f(currValue)) {
        yield currValue;
      }
    }
  },

  hasClass(cls) {
    return function(elem) {
      if (elem.nodeType !== document.ELEMENT_NODE) {
        return false;
      }

      return elem.classList.contains(cls);
    }
  },

  or() {
    const funcs = arguments;
    return function (x) {
      for (const f of funcs) {
        if (f(x)) {
          return true;
        }
      }
      return false;
    }
  }
};

class AnchorObserver {
  _findAnchors(node) {
    
  }

  constructor(node) {

  }
}

class MessageAreaObserver {
  _addLinkObserver(node) {
    if (!this._seenAreas.has(node)) {
      this._seenAreas.add(node);
      console.log(node);
    }
  }

  _findMessageAreas(node) {
    return IteratorUtils.filterIter(
      IteratorUtils.or(
        IteratorUtils.hasClass('post_body'),
        IteratorUtils.hasClass('msgs_holder')),
      IteratorUtils.iterateDom(node));
  }

  _callback(records) {
    for (const record of records) {
      if (record.type === 'childList') {
        for (var i = 0; i < record.addedNodes.length; i++) {
          const addedNode = record.addedNodes[i];
          for (var messageArea of this._findMessageAreas(addedNode)) {
            this._addLinkObserver(messageArea);
          }
        }
      }
    }
  }

  constructor(node) {
    this._node = node;
    this._seenAreas = new WeakSet();
    this._observer = new MutationObserver(
      MessageAreaObserver.prototype._callback.bind(this));
  }

  open() {
    for (const messageArea of this._findMessageAreas(this._node)) {
      this._addLinkObserver(messageArea);
    }

    this._observer.observe(this._node, {
        childList: true,
        attributes: true,
        subtree: true,
    });
  }
}

function onLoad() {
  console.log('It Works!');

  const observer = new MessageAreaObserver(document.body);
  observer.open();
}

console.log('Loading...')

if (document.readyState == 'complete') {
  onLoad();
} else {
  document.addEventListener('readystatechange', onLoad);
}
