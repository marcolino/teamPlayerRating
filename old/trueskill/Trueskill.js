// The output of this program should match the output of the TrueSkill
// calculator at:
//
//   http://atom.research.microsoft.com/trueskill/rankcalculator.aspx
//
// (Select game mode "custom", create 4 players each on their own team,
// check the second "Draw?" box to indicate a tie for second place,
// then click "Recalculate Skill Level Distribution".  The mu and sigma
// values in the "after game" section should match what this program
// prints.

// The objects we pass to AdjustPlayers can be anything with skill and
// rank attributes. 

// Create four players.  Assign each of them the default skill.  The
// player ranking (their "level") is mu-3*sigma, so the default skill
// value corresponds to a level of 0.

function Player (name, email) {
  this.name = name;
  this.email = email
  this.skill = [ 25.0, 25.0 / 3.0 ];
}

function Players () {
  this.players = [{}];

  this.getByName = function(name) {
    if (this.players.name == "name") {
    }
  }

  this.store = function() {
    //localStorage.players = JSON.stringify(this.players);
  }

  this.load = function() {
    //this.players = JSON.parse(localStorage.players);
    //console.info('there are ' + this.players.length + ' players in the system');
  }

  this.getLastError = function() {
    return this.lastError;
  }
}

function Team (name = '', color = '', size = 5) {
  this.name = name;
  this.color = color;
  this.size = size;
  this.players = [{}];
  this.lastError = "";
  
  this.addPlayer = function(player) {
    if (! player instanceof Player) {
      this.lastError = "can't add player, it's not a player";
      return false;
    }
    if (this.players.length >= this.size) {
      this.lastError = "can't add player, reached team size";
      return false;
    }
    this.players.push(player);
    return true;
  }

}

function Match (date = null) {
  this.date = date || new Date();
  this.teams = [{}];

  this.create = function(comboTeams, comboPlayers) {
    var teamsEl = document.getElementById(comboTeams);
    for (var i = 0; i < teamsEl.options.length; i++) {
      var teamName = teamsEl.options[i].value;
      var teamcolor = teamsEl.options[i].text;
      var team = new Team(teamName, teamColor);

      var playerEl = document.getElementById(comboPlayers+'-'+teamName);
      for (var i = 0; i < playerEl.options.length; i++) {
        var playerEmail = playerEl.options[i].value;
        var playerName = playerEl.options[i].text;
        var player = new Player(playerName, playerEmail);
        if (!team.addPlayer(player)) {
          this.lastError = team.getLastError();
          return false;
        }
        this.teams.push(team);
      }
    }
  };

  this.getLastError = function() {
    return this.lastError;
  }
}

var players = new Players();
players.load();

var match = new Match();

/*
alice = {}
alice.skill = [25.0, 25.0/3.0]

bob = {}
bob.skill = [25.0, 25.0/3.0]

chris = {}
chris.skill = [25.0, 25.0/3.0]

darren = {}
darren.skill = [25.0, 25.0/3.0]

console.log("alice:");
console.log(alice.skill);
console.log("bob:");
console.log(bob.skill);
console.log("chris:");
console.log(chris.skill);
console.log("darren:");
console.log(darren.skill);

// The four players play a game.  Alice wins, Bob and Chris tie for
// second, Darren comes in last.  The actual numerical values of the
// ranks don't matter, they could be (1, 2, 2, 4) or (1, 2, 2, 3) or
// (23, 45, 45, 67).  All that matters is that a smaller rank beats a
// larger one, and equal ranks indicate draws.

alice.rank = 1
bob.rank = 2
chris.rank = 2
darren.rank = 4

// do the computation to find each player's new skill estimate

trueskill = require("trueskill");
trueskill.AdjustPlayers([alice, bob, chris, darren]);

// print the results

console.log("alice:");
console.log(alice.skill);
console.log("bob:");
console.log(bob.skill);
console.log("chris:");
console.log(chris.skill);
console.log("darren:");
console.log(darren.skill);
*/