var bulkrefApp = angular.module('bulkrefApp', []);

bulkrefApp.controller('BulkrefCtrl', function ($scope) {

  function onApproveClicked(event) {
    console.log("onApproveClicked");

    $("#" + event.currentTarget.id)
    .parents(".list-group-item")
    .addClass("list-group-item-success");

    var doi = event.data;
    console.log(doi);

    var current = $("#doi-area").val();

    var dois = current.split('\n');

    var alreadyExists = $.inArray(doi, dois) > -1;
    if (!alreadyExists) {
      if (current.length > 0)
        {
          current += "\n";
        }
        $("#doi-area").val(current + doi);
      }
      else {
        console.log("Not adding DOI because it already exists: " + doi);
      }
    }

    function onSuccess(data) {
      console.log("data from ajax:");
      console.log(data);

      $("#loading-"+i).hide();

      if (data.results[0].match) {

        var citation = data.results[0].citation;
        console.log(data.results[0].citation);

        $("#citation-text-"+i).text(citation);
        $("#citation-container-"+i).show();

        var doi = data.results[0].doi;
        console.log(doi);
        $("#doi-"+i).text(doi);

        $("#approve-"+i).click(doi, onApproveClicked);

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

      $("#loading-"+i).hide();

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
          searchTerm: item
        };
      });
      i = 0;
      var title = $scope.results[i].searchTerm;
      makeRequest(title);
    };
  });
