import ajax from './ajax'
import Navigo from 'navigo'
import closest from 'closest'

const base = window.location.origin
const baseRegEx = new RegExp(base)

const router = new Navigo('localhost:5000')

function getTargets(){
  return Array.from(document.querySelectorAll('a')).filter(function(a){
    let href, rel, target

    href = a.getAttribute('href') || ''
    rel = a.getAttribute('rel') || false
    target = a.getAttribute('target') || false

    if (rel || target) return

    if (href.match(/^[\/|a-z.*$][^http\:\/\/][^w{3}]/) || href.match(baseRegEx)) return a
  })
}

function scrubPath(url){
  let path = url.replace(baseRegEx, '')
  return path.match(/^\//) ? path : '/'+path // add /
}

function bindLinks(){
  let targets = getTargets()

  for (var i = 0; i < targets.length; i++){
    targets[i].addEventListener('click', function(e){
      e.preventDefault();

      let prevURL = window.location.pathname

      let path = scrubPath(closest(e.target, 'a', true).getAttribute('href') || '')

      console.log(path)

      ajax('GET', base+path, function(res){
        try {
          router.navigate(base+path)    
        } catch(e){
          console.log(e)
        }
        bindLinks()
      })
    })
  }
}

export default function(){
  bindLinks()

  window.onpopstate = function(e){
    ajax('GET', e.target.location.href); // get page fragment, do not push state
  };
}
