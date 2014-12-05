var bulkrefApp = angular.module('bulkrefApp', []);

bulkrefApp.controller('BulkrefCtrl', function ($scope) {

  $scope.dois = [];

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

    $scope.$apply(function (){
      $scope.results[i].loading = false;
    });

    if (data.results[0].match) {

      var citation = data.results[0].citation;
      console.log(data.results[0].citation);

      $("#citation-text-"+i).text(citation);
      $("#citation-container-"+i).show();

      var doi = data.results[0].doi;
      console.log(doi);
      $("#doi-"+i).text(doi);

      // TODO: Already calling $scope.$apply in onSuccess so try to combine these.
      $scope.$apply(function (){
        $scope.results[i].doi = doi;
      });

    }
    else {
      $("#error-text-"+i).text("Didn't find match.");
      $("#error-text-"+i).show();
    }

    i++;
    if (i < $scope.results.length) {
      title = $scope.results[i].searchTerm;
      makeRequest(title);
    }
    else {
      $('#btn').text('Click me!');
      $('#btn').prop('disabled', false);
    }
  }

  function onError(jqxhr, textStatus, errorThrown) {
    console.log("textStatus:");
    console.log(textStatus);
    console.log("errorThrown:");
    console.log(errorThrown);

    $scope.$apply(function (){
      $scope.results[i].loading = false;
    });

    $("#error-text-"+i).text("Error making request. " + errorThrown);
    $("#error-text-"+i).show();

    $('#btn').text('Click me!');
    $('#btn').prop('disabled', false);

  }

  function makeRequest(title) {
    var titleData = JSON.stringify([title]);

    console.log('titleData: ');
    console.log(titleData);

    $.ajax({
      url:'/links',
      type:"POST",
      data:titleData,
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      success: onSuccess,
      error: onError
    });
  }

  $scope.start = function() {
    console.log('start');

    $('#btn').text('Thinking...');
    $('#btn').prop('disabled', true);

    $scope.results = $.map($scope.names, function(item) {
      return {
        searchTerm: item,
        loading: true,
        approved: false
      };
    });

    $scope.dois = [];

    i = 0;
    var title = $scope.results[i].searchTerm;
    makeRequest(title);
  };
});
