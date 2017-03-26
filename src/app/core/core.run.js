(function() {
  'use strict';

  angular
    .module('rizeApp.core')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, Angularytics) {

    $log.debug('runBlock end');

    Angularytics.init();

  }

})();
