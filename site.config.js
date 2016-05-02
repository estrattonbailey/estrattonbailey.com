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
  },
  structure: {
    types: {
      post: {
        template: 'post',
        hasPage: true
      },
      project: {
        template: 'post'
      }
    },
    pages: {
      index: {
        template: 'home'
      },
      writing: {
        template: 'posts'
      }
    }
  },
  assemble: {
    layouts: {
      base: './src/markup/layouts/',
      patterns: '*.hbs',
      options: {},
    },
    pages: {
      base: './src/markup/templates/',
      patterns: '*.hbs',
      options: {},
    },
    partials: {
      base: './src/markup/',
      patterns: [
        'components/*.hbs',
        'modules/*.hbs'
      ],
      options: {},
    }
  } 
}

module.exports = config;
