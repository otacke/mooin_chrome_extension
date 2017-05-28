/**
 * Get URL of current tab.
 *
 * @return {Promise} URL of current tab.
 */
function getTabUrl() {
  return new Promise(function(resolve, reject) {
    return getTabUrl2(resolve);
  });
}

/**
 * Get URL from current tab.
 *
 * @param {Object} callback - Callback function.
 */
function getTabUrl2(callback) {
  chrome.tabs.query({'active': true}, callback);
  //chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, callback);
}

/**
 * Change icon and set accessibility of browser action.
 *
 * @param {Object} results - Results from tabs.query.
 */
function updateBrowserAction(results) {
  var url = results[0].url;
  var active;

  // Is intended for mooin only.
  if (!url || !url.startsWith('https://mooin.oncampus.de')) {
    chrome.browserAction.setIcon({path: 'icons/inactive128.png'});
    chrome.browserAction.disable();
    active = false;
  } else {
    chrome.browserAction.setIcon({path: 'icons/active128.png'});
    chrome.browserAction.enable();
    active = true;
  }

  // Inform content scripts about current state.
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {active: active});
  });
}

// Listener for tab change.
chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
  getTabUrl().then(updateBrowserAction);
});

// Listener for tab update, e.g. for new tabs or reload.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  getTabUrl().then(updateBrowserAction);
});
