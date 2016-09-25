var url = window.location.hostname + window.location.pathname;

var settings;
var dialog;

function styleElement(element, styles) {
  console.log(element);
  for (var attr in styles) {
    var style = attr + ': ' + styles[attr] + ';';
    console.log(style);
    element.style.cssText += style;
  }
}

function stylePage() {
  var id = settings['ids'];
  var class_name = settings['classes'];
  var tag = settings['tags'];
  var tree = settings['tree'];
  for (var name in id) {
    styleElement(document.getElementById(name.replace('#', '')), id[name]);
  }
  for (name in class_name) {
    var elements = document.getElementsByClassName(name.replace('.', ''));
    for (var x = 0; x < elements.length; x++) {
      styleElement(elements[x], class_name[name]);
    }
  }
  for (name in tag) {
    elements = document.getElementsByTagName(name);
    for (x = 0; x < elements.length; x++) {
      styleElement(elements[x], tag[name]);
    }
  }
  for (name in tree) {
    var curr = document;
    for (var path_index in tree[name]['path']) {
      curr = curr.children[tree[name]['path'][path_index]];
    }
    styleElement(curr, tree[name]['properties']);
  }
}
