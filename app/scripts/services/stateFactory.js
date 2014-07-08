'use strict';

/**
 * A state factory to share state between controllers
 */
app.factory('stateFactory', function() {
  var share = {};

  share.initMain = function () {
    share.main = {};

    share.main.title = 'Team player rating system';
    share.main.author = {};
    share.main.author.name = 'Marco Solari';
    share.main.author.email = 'marcosolari@gmail.com';
    share.main.description = '... TrueSkill<sup>&reg;</sup> ...';

    //share.main.teamsInitialized = true;
    share.main.dateFormat = 'yyyy-MM-dd';
    share.main.dateOptions = {};
    share.main.dateOptions['startingDay'] = 1;
    share.main.dateOptions['showWeeks'] = 0;

    share.main.teamSelected = null;
    share.main.teamsCompleted = false;
    share.main.teamsClosed = false;

    share.main.match = {};
    share.main.match.date = new Date();
    share.main.match.confirmed = false;
    share.main.match.teams = {};
    share.main.match.teams['A'] = {
      name: 'Oranges',
      score: null,
      players: {}
    };
    share.main.match.teams['B'] = {
      name: 'Blues',
      score: null,
      players: {}
    };
  };

  share.initMatchs = function () {
    share.matchsEditMode = false;
    share.matchsCollapsed = true;
    share.matchsOrderByPredicate = 'date';
  };

  share.initMain();
  share.initMatchs();

  return share;
});