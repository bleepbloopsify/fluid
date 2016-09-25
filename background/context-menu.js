var open = function(info, tab) {
  let id = Math.random().toString(36).substring(7);
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      method: 'open_dialog',
      html: '<div id="' + id + '" />',
      id: id
    }, function(res) {
      console.log(res);
    });
  });
};

var onErr = function() {
  if (chrome.extension.lastError) {
    console.log('Got expected error: ' + chrome.extension.lastError.message);
  }
};
//
// chrome.runtime.onMessage.addListener(
//   function(req, sender, sendResponse) {
//     console.log(req);
//   }
// );


chrome.contextMenus.create({
  'type': 'normal',
  'id': 'main',
  'title': 'Fluid',
  'contexts': ['all'],
  'onclick': open
}, onErr);
