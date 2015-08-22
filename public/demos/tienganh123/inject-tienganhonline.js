$('script[src^="http://www.tienganh123.com/static/js/libs_audio.js"]').remove();
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'demo';

document.getElementsByTagName('head')[0].appendChild(script);