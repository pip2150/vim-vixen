const onBeforeSendHeaders = (url) => {
  browser.webRequest.onBeforeSendHeaders.addListener(
    (request) => {
      let referer = null;
      for (let header of request.requestHeaders) {
        if (header.name.toLowerCase() === 'referer' && header.value) {
          referer = header;
          break;
        }
      }
      referer.value = url;

      return { requestHeaders: request.requestHeaders };
    },
    { urls: ['<all_urls>']},
    ['blocking', 'requestHeaders']
  );
};

const openNewTab = (url, tab) => {
  onBeforeSendHeaders(tab.url);
  return browser.tabs.create({ url: url });
};

const openToTab = (url, tab) => {
  onBeforeSendHeaders(tab.url);
  return browser.tabs.update(tab.id, { url: url });
};

export { openToTab, openNewTab };
