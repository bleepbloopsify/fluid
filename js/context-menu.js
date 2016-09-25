console.log('hi');
var url = window.location.hostname + window.location.pathname;
var settings = chrome.storage.sync[url];

var element = document;

var dialog = {};

var methods = {};

methods.open_dialog = function(req, el) {
  dialog.id = req.id;
  let html = req.html;
};

methods.save_classes = function(req) {

  console.log(req);
  if (req.classes) {
    settings.classes = req.classes;
  }
};

var save = function(id) {
  let dialog = document.getElementById(id);
  let dialog_settings = dialog.getElementById('settings');
  let classes = dialog_settings.getElementById('classes').map(retrieveValues);
  let ids = dialog_settings.getElementById('ids').map(retrieveValues);
  let attrs = retrieveValues(dialog.getElementById('attributes'));

  for (let index in classes) {
    let class_properties = classes[index];
    for (let class_name in class_properties) {
      settings.classes[class_name] = class_properties[class_name];
    }
  }
  for (let index in ids) {
    let id_properties = ids[index];
    for (let id_name in id_properties) {
      settings.ids[id_name] = id_properties[id_name];
    }
  }
  let path = JSON.stringify(getPath());
  settings.tree[path] = attrs;
};

var getPath = function() {
  let path = [];
  let curr = element;
  while (curr.parentNode) {
    let parent = curr.parentNode;
    path.append(parent.indexOf(curr));
    curr = parent;
  }
  return path;
};

var retrieveValues = function(el) {
  let children = el.children;
  let retrieve = {};
  for (let childindex in children) {
    let child = children[childindex];
    let name = child.getElementsByClassName('name')[0].value;
    let value = child.getElementsByClassName('value')[0].value;
    retrieve[name] = value;
  }
};

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  console.log('hi');
  console.log(req, sender);
  console.log(element);

  let method = req.method;
  delete req.method;
  if (!method) sendResponse('No method found');
  else methods[method](req, element);

  sendResponse('Received');
});

// console.log(document);
document.addEventListener('contextmenu', function(e) {
  console.log('rightclicked');
  element = e.target;
});
