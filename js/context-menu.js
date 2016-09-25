console.log('hi');
var url = window.location.hostname + window.location.pathname;
var settings = chrome.storage.sync[url];

var element = document;

var dialog;

var methods = {};
var parse;

methods.open_dialog = function(req, el) {
  // dialog.id = req.id;
  let html = req.html;
  // let parsed = parse(element);

  let parsed = {
    'ids': {
      lol: {
        'color': 'red'
      }
    },
    'classes': {
      lmao: {
        'color': 'red'
      },
      lmaos: {
        'color': 'blue'
      },
      lmaoa: {
        'color': 'green'
      }
    },
    'attrs': {
      'color': 'red'
    }
  };

  var toggle = function(toggleme) {
    return function(e) {
      toggleme.toggle();
    };
  };
  dialog = $('<div id="fluid-dialog" />');
  let settings = $('<fluid id="fluid-settings" />');
  let source = $('<fluid id="fluid-source" />');
  let container = $('<fluid />');
  let classes = $('<fluid id="fluid-classes" />');
  let class_title = $('<label> Classes </label>');
  let classes_container = $('<fluid />');
  class_title.click(toggle(classes_container));
  classes.append(class_title);
  for (let class_name in parsed.classes) {
    let properties = parsed.classes[class_name];
    let class_container = $('<fluid name="' + class_name + '" />');
    let class_name_container = $('<label>' + class_name + '</label>');
    let properties_container = $('<fluid />');
    class_name_container.click(toggle(properties_container));
    class_container.append(class_name_container);
    for (let class_property in properties) {
      let property_container = $('<fluid />');
      let property_name = $('<input class="fluid-name" />');
      property_name.val(class_property);
      let property_val = $('<input class="fluid-value" />');
      property_val.val(properties[class_property]);
      property_container.append(property_name).append(':').append(property_val);
      properties_container.append(property_container);
    }
    properties_container.toggle();
    class_container.append(properties_container);
    classes_container.append(class_container);
  }
  classes_container.toggle();
  classes.append(classes_container);

  dialog.append(classes);

  let ids = $('<fluid id="fluid-ids" />');
  let id_title = $('<label> Ids </label>');
  let ids_container = $('<fluid />');
  id_title.click(toggle(ids_container));
  ids.append(id_title);
  for (let id_name in parsed.ids) {
    let properties = parsed.ids[id_name];
    let id_container = $('<fluid name="' + id_name + '" />');
    let id_name_container = $('<label>' + id_name + '</label>');
    let properties_container = $('<fluid />');
    id_name_container.click(toggle(properties_container));
    id_container.append(id_name_container);
    for (let id_property in properties) {
      let property_container = $('<fluid />');
      let property_name = $('<input class="fluid-name" />');
      property_name.val(id_property);
      let property_val = $('<input class="fluid-value" />');
      property_val.val(properties[id_property]);
      property_container.append(property_name).append(':').append(property_val);
      properties_container.append(property_container);
    }
    properties_container.toggle();
    id_container.append(properties_container);
    ids_container.append(id_container);
  }
  ids_container.toggle();
  ids.append(ids_container);
  dialog.append(ids);

  let attrs = $('<fluid id="fluid-attrs" />');
  let attrs_title = $('<label> Attributes </label>');
  attrs.append(attrs_title);
  let attrs_container = $('<fluid />');
  for (let property in parsed.attrs) {
    let property_container = $('<fluid />');
    let property_name = $('<input class="fluid-name" value="' + property + '"/>');
    let property_value = $('<input class="fluid-value" value="' + parsed.attrs[property] + '" />');
    property_container.append(property_name).append(':').append(property_value);
    attrs_container.append(property_container);
  }
  attrs.append(attrs_container);

  dialog.append(attrs);
  dialog.dialog({
    height: $(window).height(),
    position: {
      my: 'right center',
      at: 'right center',
      of: window
    }
  });
};

methods.save_classes = function(req) {

  console.log(req);
  if (req.classes) {
    settings.classes = req.classes;
  }
};

var save = function() {
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
