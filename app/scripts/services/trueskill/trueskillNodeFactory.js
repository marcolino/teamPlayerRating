/**
 * Trueskill wrapper factory
 */
'use strict';

app.factory('trueskillFactory', function () {

  var trueskill = require("./trueskill");

  return {
    matchUpdateSkill: function (match) {
      //console.info('match:', match);
      var players = [];
      for (var team in match.teams) {
        //console.log('team:', team);
        var squad = match.teams[team].players;
        for (var id in squad) {
          var player = {};
          player.id = id;
          player.name = squad[id].name;
          /* trueskill.AdjustPlayers wants an array with skill.mu and skill.sigma */
          player.skill = [];
          console.info('squad[id].skill', squad[id].skill);
          player.skill.push(squad[id].skill.mu);
          player.skill.push(squad[id].skill.sigma);
          /* trueskill.AdjustPlayers wants rank, not score (so we negate score) */
          player.rank = - match.teams[team].score;
          players.push(player);
        }
      }
      console.info('players:', players);
      //trueskill.AdjustPlayers(players);
      console.info('players:', players);
      
var  alice = {};  alice.skill = [25.0, 25.0/3.0]
var    bob = {};    bob.skill = [25.0, 25.0/3.0]
var  chris = {};  chris.skill = [25.0, 25.0/3.0]
var darren = {}; darren.skill = [25.0, 25.0/3.0]
alice.rank = 1;
bob.rank = 1;
chris.rank = 2;
darren.rank = 2;
trueskill.AdjustPlayers([alice, bob, chris, darren]);
console.log("alice:", alice.skill);
console.log("bob:", bob.skill);
console.log("chris:", chris.skill);
console.log("darren:", darren.skill);
/*
var    bob = {};    bob.skill = [25.0, 25.0/3.0]
var  chris = {};  chris.skill = [25.0, 25.0/3.0]
bob.rank = 1;
chris.rank = 1;
trueskill.AdjustPlayers([bob, chris]);
console.log("bob:", bob.skill);
console.log("chris:", chris.skill);
*/
      return players;
    }
  };
});