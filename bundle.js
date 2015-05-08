(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = exports

utils.print = function(node, str) {
  node.appendChild(document.createTextNode(str))
}

utils.beep = function() {
  var overlay = document.createElement('div')
  overlay.className = 'visual-bell'
  document.body.appendChild(overlay)
  setTimeout(function() {
    document.body.removeChild(overlay)
  }, 1000)
}

utils.rimraf = function(node) {
  while (node.hasChildNodes())
    node.removeChild(node.lastChild)
}

utils.resetInput = function() {

  document.querySelector('#terminal .terminal-input').value = ''
}

},{}],2:[function(require,module,exports){
var utils = require('./utils')
  , closeButton = document.querySelector('li.red')
  , minBtn = document.querySelector('li.yellow')
  , full = document.querySelector('li.green')
  , ul = document.querySelector('ul.btns')

function closeTerminal() {
  var res = confirm('Are you sure you want to close this terminal?')
  res && window.close()
}

var currentIdx = 0

closeButton.addEventListener('click', closeTerminal)

ul.addEventListener('mouseenter', function() {
  minBtn.className = 'yellow active'
  full.className = 'green active'
})

ul.addEventListener('mouseleave', function() {
  minBtn.className = 'yellow'
  full.className = 'green'
})

var funcs = [
  'requestFullscreen'
, 'msRequestFullscreen'
, 'mozRequestFullscreen'
, 'webkitRequestFullscreen'
]

var len = funcs.length

full.addEventListener('click', function() {
  for (var i=0; i<len; i++) {
    var func = funcs[i]
    if (document.body[func]) {
      document.body[func]()
      break
    }
  }
})

var input = document.querySelector('.terminal-input')

function textFocus(e) {

}

function loseFocus(e) {

}

function inputHasValue(input) {
  return !!input.value
}

function handleInput(e) {
  var code = e.which
  switch (code) {
    case 13: // enter
      var cmd = input.value
      execute(cmd)
      break
    case 67: // c
      if (e.ctrlKey) {
        execute('^C')
        this.value = ''
      }
      break
    case 68: // d
      if (e.ctrlKey) {
        if (inputHasValue(this)) {
          // blink the entire screen
          utils.beep()
          return false
        }
        closeTerminal()
      }
      break
  }
}

var historyNode = document.querySelector('#terminal-history')

function execute(cmd) {
  var node = document.querySelector('#terminal')
  var clone = node.cloneNode(true)
  var br = document.createElement('br')
  clone.appendChild(br)
  var textField = clone.querySelector('.terminal-input')
  textField.setAttribute('disabled', 'disabled')
  var ret = handleCmd(cmd, clone)
  if (ret) {
    currentIdx++
    clone.id += currentIdx
    historyNode.appendChild(clone)
    window.scrollTo(0, document.body.scrollHeight + 20)
  }
}

function handleCmd(cmd, clone) {
  if (!cmd) {
    return true
  } else if (~cmd.indexOf('rm -rf')) {
    utils.print(clone, 'exit')
    closeTerminal()
  } else if (~cmd.indexOf('exit')) {
    utils.print(clone, 'exit')
    closeTerminal()
  } else if (cmd === '^C') {
    utils.print(clone, '^C')
  } else if (cmd === 'clear') {
    utils.rimraf(historyNode)
    utils.resetInput()
    return false
  } else {
    utils.print(clone, 'fish: Unknown command \'' + cmd + '\'')
    utils.resetInput()
  }

  return true
}

function addSubmittedCommand(cmd, results) {

}

input.addEventListener('focus', textFocus)
input.addEventListener('focusin', textFocus)
input.addEventListener('focusout', loseFocus)
input.addEventListener('keyup', handleInput)
input.focus()

},{"./utils":1}]},{},[2]);
