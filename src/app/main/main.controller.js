(function() {
  'use strict';

  angular
    .module('rizeApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(moment, $state, financeService, $log) {
    var vm = this;

    activate();

    function activate() {
      vm.today = new Date();
      vm.today = vm.today.toISOString().split('').splice(0,10).join('');
      vm.goal = {
        date: moment(vm.today)
      };
    }

    //TODO: on date select lose focus from picker

    vm.getPayments = function() {
      if (!vm.goal.name) {
        if (!vm.goal.amount) {
          vm.errorMessage = 'a goal name and amount';
        } else {
          vm.errorMessage = 'a goal name';
        }
      } else if (!vm.goal.amount) {
        vm.errorMessage = 'a goal amount';
      } else {
        financeService.setGoal(moment(vm.today), vm.goal);
        $state.go('results');
      } 
      
    };

  }
})();
