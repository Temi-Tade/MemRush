const TILE = document.querySelector("#tiles-grid ul");
const INFO = [...document.querySelectorAll(".info p")];
const MODALBG = document.querySelector("#modalbg");
const MODAL = document.querySelector("#modal");
const GAME_MODE = document.querySelector("header p.mode");
const NOW_PLAYING = document.querySelector("#now-playing");

var assets = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20];
var newArray;
var gameMode;
var tiles;
var tile1;
var tile2;
var moves;
var time;
var collected;
var player1;
var player2;