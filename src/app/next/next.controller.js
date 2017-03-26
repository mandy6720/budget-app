(function() {
  'use strict';

  angular
    .module('rizeApp')
    .controller('ResultsController', ResultsController);

  /** @ngInject */
  function ResultsController(moment, $state, financeService, $log) {
    var vm = this;
    vm.goBack = goBack;
    vm.setDisplayedAmt = setDisplayedAmt;
    vm.paymentOption = 'Monthly';
    vm.editMode = false;
    vm.setOption = setOption;
    vm.editAmt = editAmt;

    activate();

    function activate() {
      var dates = financeService.getDates();
      if (!dates) {
        vm.today = new Date().toISOString().split('').splice(0,10).join('');
      }
      vm.goal = financeService.getGoal();
      // if no goal set, go to first screen
      if (!vm.goal) {
        $state.go('home');
      } else {
        vm.goal.name = capitalize(vm.goal.name);
        vm.goal.amount = vm.goal.amount.toFixed(2);
      }
      // in case user didn't set date on first screen
      if (!vm.goal.date) {
        vm.goal.date = new Date.toISOString().split('').splice(0,10).join('');
      }
      vm.goal.dateFormatted = vm.goal.date.format('MMM Do, YYYY');
      getAmounts();
    }

    function goBack() {
      $state.go('home');
    }

    function getAmounts() {
      var numDays = moment(vm.goal.date).diff(vm.today, 'days') + 1;
      var numWeeks = moment(vm.goal.date).diff(vm.today, 'weeks') + 1;
      var numMonths = moment(vm.goal.date).diff(vm.today, 'months') + 1;

      var savePerDay = (vm.goal.amount / numDays).toFixed(2);
      var savePerWeek = (vm.goal.amount / numWeeks).toFixed(2);

      if (numWeeks >= 2) {
        var savePer2Weeks = (vm.goal.amount / Math.floor(numWeeks / 2)).toFixed(2);
      } else {
        var savePer2Weeks = savePerWeek;
      }
      var savePerMonth = (vm.goal.amount / numMonths).toFixed(2);

      vm.amounts = {
        daily: savePerDay || undefined,
        weekly: savePerWeek || undefined,
        biweekly: savePer2Weeks || undefined,
        monthly: savePerMonth || undefined
      }
      console.log(vm.amounts)
      setDisplayedAmt();
    }

    function capitalize(str) {
      var newStr = [];
      var words = str.split(" ");
      words.forEach(function(word) {
        var letters = word.split("");
        letters[0] = letters[0].toUpperCase();
        word = letters.join("");
        newStr.push(word);
      });
      str = newStr.join(" ");
      return str;
    }

    function setDisplayedAmt() {
      angular.element(document.querySelectorAll('.active-option')[0]).removeClass('active-option');
      switch(vm.paymentOption) {
        case 'Weekly':
          vm.formattedAmt = vm.amounts.weekly;
          angular.element(document.querySelectorAll('.payment-option-button')[0]).addClass('active-option');
          break;
        case 'BiWeekly':
          vm.formattedAmt = vm.amounts.biweekly;
          angular.element(document.querySelectorAll('.payment-option-button')[1]).addClass('active-option');
          break;
        case 'Monthly':
          vm.formattedAmt = vm.amounts.monthly;
          angular.element(document.querySelectorAll('.payment-option-button')[2]).addClass('active-option');
          break;
        default:
          vm.formattedAmt = 'Amanda did something wrong';
      }
    }

    function setOption(arg) {
      angular.element(document.querySelectorAll('.active-option')[0]).removeClass('active-option');
      vm.paymentOption = arg;
      setDisplayedAmt(vm.paymentOption);
    }

    function editAmt(arg) {
      if (arg == 'off') {
       angular.element(document.querySelectorAll('.edit-icon-amount')[0]).removeClass('hidden'); 
       setNewAmt();
      } else {
        angular.element(document.querySelectorAll('.edit-icon-amount')[0]).addClass('hidden');
      }
      vm.editAmount = !vm.editAmount;
    }

    function setNewAmt() {
      financeService.setGoal(vm.today, vm.goal);
      getAmounts();
      setDisplayedAmt(vm.paymentOption);
    }

    vm.changeDate = function(arg) {
      if (arg == 'off') {
       angular.element(document.querySelectorAll('.edit-icon-date')[0]).removeClass('hidden'); 
       setNewDate();
      } else {
        angular.element(document.querySelectorAll('.edit-icon-date')[0]).addClass('hidden');
      }
      vm.editDate = !vm.editDate;
    }

    function setNewDate() {
      console.log(vm.newGoalDate);
      vm.goal.date = vm.newGoalDate;
      vm.goal.dateFormatted = vm.goal.date.format('MMM Do, YYYY');
      financeService.setGoal(vm.today, vm.goal);
      getAmounts();
      setDisplayedAmt(vm.paymentOption);
    }

  }
})();
