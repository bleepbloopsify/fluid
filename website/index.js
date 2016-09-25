document.getElementById('popup').style.display = 'none';
var curr;
var pop = document.getElementById('popup');
var container = document.getElementById('container');
var body = document.getElementById('body');
// var settings = chrome.storage.sync
var settings = {
  'www.reddit.com/r/all': {
    'tree': {
      '[0,1,1]': { 'background-color': 'purple' }
    },
    'id': {},
    'class': {
      'title': { 'color': 'red' }
    },
    'tag': {
      'body': { 'background-color': 'green' }
    }
  }
};

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

for (let url in settings) {
  var n = document.createElement('div');
  n.className = 'boxy';
  n.setAttribute('name', url);
  n.innerHTML = url;
  container.appendChild(n);
  n.addEventListener('click', open);
}

var close = function(e) {
  try {
    if (!e || !e.target || e.target != pop && e.target.parentNode != pop && e.target.parentNode.parentNode != pop && e.target.parentNode != container) {
      container.style.display = 'block';
      pop.style.display = 'none';
      console.log(pop.style.display);
      curr.addEventListener('click', open)
      this.removeEventListener('click', close)
    }
  } catch (err) {
    console.error(err);
  }
};

var remove = function(e) {
  console.log(this);
  console.log(curr)
  let rem = document.getElementBy
  curr.parentNode.removeChild(curr);
  close();
  //delete from container
  delete settings[curr.getAttribute('name')];
};

document.getElementById('click').addEventListener('click', open);
document.getElementById('delete').addEventListener('click', remove);
