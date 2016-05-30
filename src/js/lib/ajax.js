import req from 'reqwest'

const parser = new DOMParser()

function parseBody(html){
  return parser.parseFromString(html, "text/html").getElementById('page');
}

function swapPage(markup){
  let main = document.getElementById('page')

  main.innerHTML = markup.innerHTML
}

function get(path, data, cb){
  if (typeof data === 'function'){
    cb = data
  }

  req({
    url: path,
    type: 'html',
    method: 'GET',
    error: function(err){
      console.log( '%cAJAX Error: '+err.status+' '+err.statusText+'. '+err.responseText,'color:#ff4567')
    },
    success: function(res){
      swapPage(parseBody(res))
      if (cb) cb(res)
    }
  })
}

export default function(method, path, data, cb){
  if (typeof data === 'function'){
    cb = data
  }

  let action = method.toLowerCase() === 'get' ? get : post

  action(path, data, parseBody)
}
