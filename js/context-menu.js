var open = function(info, tab) {
  console.log(info, tab);
};

var onErr = function() {
  if (chrome.extension.lastError) {
    console.log('Got expected error: ' + chrome.extension.lastError.message);
  }
};

chrome.contextMenus.create({
  'type': 'normal',
  'title': 'Fluid',
  'onclick': open
}, onErr);
