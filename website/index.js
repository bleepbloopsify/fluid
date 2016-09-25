document.getElementById('popup').style.display = 'none';
var curr;
var pop = document.getElementById('popup');
var container = document.getElementById('container');
var body = document.getElementById('body');

var open = function(e) {
  console.log('hi');
  console.log(container, pop);
  curr = this;
  container.style.display = 'None';
  pop.style.display = 'Block';
  //add picture, add name; add code, maybe
  pop.querySelector('#title').innerHTML = curr.getAttribute('name');
  body.addEventListener('click', close);
  this.removeEventListener('click', open);
};

var settings;

var setup = function() {
  for (let url in settings) {
    console.log(url,settings)
    var n = document.createElement('div');
    n.className = 'boxy';
    n.setAttribute('name', url);
    n.innerHTML = url;
    container.appendChild(n);
    n.addEventListener('click', open);
  }
};

var close = function(e) {
  try {
    if (!e || !e.target || e.target != pop && e.target.parentNode != pop && e.target.parentNode.parentNode != pop && e.target.parentNode != container) {
      container.style.display = 'block';
      pop.style.display = 'none';
      console.log(pop.style.display);
      curr.addEventListener('click', open);
      this.removeEventListener('click', close);
    }
  } catch (err) {
    console.error(err);
  }
};


var remove = function(e) {
  // var find;
  // var children = curr.parentNode.childNodes;
  // children.forEach(function(item){
  //   console.log('children',children.innerHTML)
  //   if(children.innerHTML == curr.getAttribute('name')){
  //     find = children;
  //   }
  // });
  container.removeChild(curr);
  close();
  chrome.storage.sync.remove(curr.getAttribute('name'), remove);
};

document.getElementById('click').addEventListener('click', open);
document.getElementById('delete').addEventListener('click', remove);
chrome.storage.sync.get(null, function(items) {
  console.log('hi', items);
  settings = items;
  setup();
});

document.getElementById('click').addEventListener('click', open);
document.getElementById('delete').addEventListener('click', remove);
