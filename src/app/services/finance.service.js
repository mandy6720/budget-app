(function() {
  'use strict';

  angular
    .module('rizeApp')
    .service('financeService', financeService);

    function financeService() {

      this.dates = {};

      this.setGoal = function(today, goalObj) {
        this.goal = goalObj;
        this.dates.start = today;
        this.dates.end = goalObj.date;
      }

      this.getGoal = function() {
        return this.goal;
      }

      this.getDates = function() {
        return this.dates;
      }

      this.setDate = function(date) {
        this.goal.date = date;
      }

    }

})();
