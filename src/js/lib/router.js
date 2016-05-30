import ajax from './ajax'
import Navigo from 'navigo'

const basepath = window.location.origin
const router = new Navigo()

function getTargets(){
  return Array.from(document.querySelectorAll('a')).filter(function(a){
    let href, rel, target, basepathRegEx = new RegExp(basepath)

    href = a.getAttribute('href') || ''
    rel = a.getAttribute('rel') || false
    target = a.getAttribute('target') || false

    if (rel || target) return

    if (href.match(/^[\/|a-z.*$][^http\:\/\/][^w{3}]/) || href.match(basepathRegEx)) return a
  })
}

const targets = getTargets()

export default function(){
  for (var i = 0; i < targets.length; i++){
    targets[i].addEventListener('click', function(e){
      e.preventDefault();

      let prevURL = window.location.href

      var path = e.target.getAttribute('href')
      ajax('GET', path, function(res){
        console.log(prevURL)
        router.navigate(path)    
      })
    })
  }

  console.log(targets)

  window.onpopstate = function(e){
    ajax('GET', e.target.location.href); // get page fragment, do not push state
  };
}
