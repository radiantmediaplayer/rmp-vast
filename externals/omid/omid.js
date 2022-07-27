window.addEventListener('DOMContentLoaded', (event) => {
  console.log(event);
  var div = document.createElement('div');
  div.id = 'verified-id';
  div.textContent = 'adverified';
  document.body.appendChild(div);
});

