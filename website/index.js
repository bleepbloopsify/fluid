document.getElementById('popup').style.display = 'none';
var curr;
var pop = document.getElementById('popup');
var container = document.getElementById('container');
var body = document.getElementById('body');

var open = function(e){
  console.log('hi');
  console.log(container, pop);
  curr = this;
  container.style.display = 'None';
  pop.style.display = 'Block';
  body.addEventListener('click', close);
  this.removeEventListener('click',open);
}

var close = function(e){
  if (e.target != pop && e.target.parentNode != pop && e.target.parentNode.parentNode != pop && e.target.parentNode != document.getElementById("container")){
    container.style.display = 'block';
    pop.style.display = 'none';
    console.log(pop.style.display);
    curr.addEventListener('click',open)
    this.removeEventListener('click',close)
  }
};

document.getElementById('click').addEventListener('click',open);
