
function setRootFontSize() {
  var width = window.innerWidth;
  var fontSize = Math.max(14, Math.min(20, width / 25)); 
  document.documentElement.style.fontSize = fontSize + 'px';
}
setRootFontSize();
window.addEventListener('resize', setRootFontSize);
