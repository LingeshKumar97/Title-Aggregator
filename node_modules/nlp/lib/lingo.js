var util = require('util') 
  , Twit = require('twit')
  , cfg = require('../config')
  , geo = require('./geo')

var T = new Twit(cfg)

var stringA = 'hello'
var stringB = 'mello'

levenshtein(stringA, stringB)

/**
 * Determines the minimum Levenshtein distance between two strings
 * 
 * cost: 1 for deletions/insertions, 2 for subsitutions
 *
 * @param  {String} x   first string
 * @param  {String} y   second string
 * @return {Number}     levenshtein distance
 */
function levenshtein (x, y) {
  //our distance matrix
  var matrix = []

  //initialize our distance matrix

  //generate the first column of the distance matrix
  //matrix[i][0] = i ; the cost of deleting i characters
  for (var i = 0, j = x.length; i < j; i++) {
    matrix[i] = [i]
  }

  //generate the first row of the distance matrix
  //matrix[0][j] = j ; the cost of deleting j characters
  for (var j = 0, k = y.length; j < k; j++) {
    matrix[0][j] = j
  }

  //generate the contents of the distance matrix
  for (var i = 0, j = x.l)

}