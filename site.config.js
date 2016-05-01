require('dotenv').config();

var config = {
  meta: {
    version: '0.0.1',
    title: 'Eric Bailey',
    url: process.env.PRODUCTION === 'true' ? https://estrattonbailey.herokuapp.com : http://localhost:5000/',
    author: '@estrattonbailey',
    description: 'Designer, developer.',
    keywords: 'developer',
    og_img: '/'
  }
}

module.exports = config;
