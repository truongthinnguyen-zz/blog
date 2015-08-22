$('script[src^="http://www.tienganh123.com/static/js/libs_audio.js"]').remove();
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://shrouded-inlet-5864.herokuapp.com/demos/tienganh123/libs_audio.js';

document.getElementsByTagName('head')[0].appendChild(script);