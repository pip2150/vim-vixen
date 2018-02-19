let listener = null;

const setReferer = (src, dst) => {
  return new Promise((resolve) => {
    listener = (request) => {
      let referer = null;
      for (let header of request.requestHeaders) {
        if (header.name.toLowerCase() === 'reqerer' && header.value) {
          referer = header;
          break;
        }
      }
      if (referer === null) {
        referer = { name: 'Referer', value: src };
        request.requestHeaders.push(referer);
      } else {
        referer.value = src;
      }
      return { requestHeaders: request.requestHeaders };
    };

    browser.webRequest.onBeforeSendHeaders.addListener(
      listener,
      { urls: ['<all_urls>']},
      ['blocking', 'requestHeaders']
    );
    resolve({ url: dst });
  });
};

/*
const undoReferer = (a) => {
  return new Promise((resolve) => {
    if (listener !== null) {
      browser.webRequest.onBeforeSendHeaders.removeListener(listener);
      listener = null;
    }
    resolve(a);
  });
};
*/

const openNewTab = (url, tab) => {
  return setReferer(tab.url, url).then(browser.tabs.create);
};

const openToTab = (url, tab) => {
  return setReferer(tab.url, url).then(browser.tabs.update);
};

export { openToTab, openNewTab };
