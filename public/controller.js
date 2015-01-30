var bulkrefApp = angular.module('bulkrefApp', []);

bulkrefApp.controller('BulkrefCtrl', function ($scope, $http) {

  var StateEnum = {
    Loading: "Loading",
    Completed: "Completed",
    Failed: "Failed"
  };
  Object.freeze(StateEnum);

  $scope.processing = false;

  $scope.onApproveClicked = function(result) {
    console.log("onApproveClicked");
    console.log(result);

    result.approved = true;

    // We don't simply push onto the dois array because of an AngularJS bug
    // in which the view won't be updated for ng-list on array.push because
    // it's checking for strict identity (which won't be different if there's
    // only a new item on the end).
    // http://stackoverflow.com/a/15591377
    var approved = $scope.results.filter(function (item) { return item.approved; });
    var mapped = $.map(approved, function(item) { return item.doi; });
    $scope.dois = mapped;
  };

  function onSuccess(data) {
    console.log("data from ajax:");
    console.log(data);

    var hasResults = data.hasOwnProperty('results');
    if (hasResults && data.results[0].match) {

      var citation = data.results[0].citation;
      console.log(data.results[0].citation);

      var doi = data.results[0].doi;

      $scope.results[i].citation = citation;
      $scope.results[i].doi = doi;
      $scope.results[i].state = StateEnum.Completed;

    }
    else {
      $scope.results[i].state = StateEnum.Failed;
      var errorText = "Didn't find match.";
      if (hasResults && data.results[0].errorText)
        errorText = data.results[0].errorText;
      $scope.results[i].errorText = errorText;
    }

    doNextTitle();
  }

  function doNextTitle() {
    i++;
    if (i < $scope.results.length) {
      title = $scope.results[i].searchTerm;
      makeRequest(title);
    }
    else {
      $scope.processing = false;
    }
  }

  function onError(data, status) {
    console.log("data");
    console.log(data);
    console.log("status:");
    console.log(status);

    $scope.results[i].state = StateEnum.Failed;

    $scope.results[i].errorText = "Error making request. " + status;

    doNextTitle();
  }

  function makeRequest(title) {
    var titleData = JSON.stringify([title]);

    console.log('titleData: ');
    console.log(titleData);

    $http.post('/links', titleData)
    .success(onSuccess)
    .error(onError);
  }

  $scope.start = function() {
    console.log('start');

    $scope.processing = true;

    $scope.results = $.map($scope.names, function(item) {
      return {
        searchTerm: item,
        state: StateEnum.Loading,
        approved: false
      };
    });

    $scope.dois = [];

    i = 0;
    var title = $scope.results[i].searchTerm;
    makeRequest(title);
  };
});
