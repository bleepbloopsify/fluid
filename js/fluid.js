var url = window.location.hostname + window.location.pathname;

function styleElement(element, styles) {
  for (var attr in styles) {
    element.style.cssText = attr + ': ' + styles[attr];
  }
}

function stylePage(e) {
  if (url in settings) {
    var id = settings[url]['ids'];
    var class_name = settings[url]['classes'];
    var tag = settings[url]['tags'];
    var tree = settings[url]['tree'];
    for (var name in id) {
      styleElement(document.getElementById(name), id[name]);
    }
    for (name in class_name) {
      var elements = document.getElementsByClassName(name);
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
}
