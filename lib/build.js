var contentful = require('./contentful.js'),
    assemble = require('../assemblefile.js');

function Builder(){
  assemble.assemblify({
    headline: 'Eric Bailey',
    work: [
      {
        title: 'Startup Stock Photos',
        caption: 'Free tech stock photos.',
        link: 'http://startupstockphotos.com'
      },
      {
        title: 'Svbstrate',
        caption: 'Simple, scalable CSS base layer.',
        link: 'http://startupstockphotos.com'
      }
    ]
  });

  contentful(function(data){
  });
}

module.exports = Builder;
