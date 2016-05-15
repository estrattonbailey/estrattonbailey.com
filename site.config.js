var config = {
  meta: {
    version: '0.0.1',
    title: 'Eric Bailey',
    url: 'https://estrattonbailey.herokuapp.com',
    // url: 'http://localhost:5000',
    author: '@estrattonbailey',
    description: 'Designer, developer.',
    keywords: 'developer',
    og_img: '/'
  },
  structure: {
    types: {
      post: {
        template: 'post',
        hasPage: true,
        rootPath: 'writing'
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
