try {
  require('dotenv').config();
} catch(e){}

var domain = process.env.PRODUCTION === 'true' 
      ? 'http://localhost:5000'
      : 'https://estrattonbailey.herokuapp.com';

var config = {
  meta: {
    version: '0.0.1',
    title: 'Eric Bailey',
    url: domain,
    author: '@estrattonbailey',
    description: 'Designer, developer.',
    keywords: 'developer',
    og_img: '/'
  }
}

module.exports = config;
