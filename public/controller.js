var bulkrefApp = angular.module('bulkrefApp', []);

bulkrefApp.controller('BulkrefCtrl', function ($scope) {
    $scope.name = "blah";
    $scope.items = ["abc", "def", "ghi"];
    //$scope.items = [{"name": "abc"}, {"name":"def"}, {"name": "ghi"}];

    var template = jQuery.validator.format('<div class="list-group-item"><h4 class="list-group-item-heading">{0}</h4><div id="loading-{1}"><img src="spinny.gif"></img>Loading...</div><div id="citation-container-{1}" style="display: none;"><p class="list-group-item-text" id="citation-text-{1}"></p><div class="btn-group"><button type="button" class="btn btn-default" id="approve-{1}">Approve</button><!--<button type="button" class="btn btn-default">Reject</button>--></div></div><div id="error-text-{1}" style="display: none; color: red;"></div><div id="doi-{1}" style="display: none;"></div></div>');

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

      i = 0;

      $('#result-list').children().remove();

      var multiline = $('#title-area').val();
      titles = multiline.split('\n').filter(function (element) {
        return !(!element);
      });

      titles.forEach(function(title, j) {
        var listItem = template(title, j);
        $('#result-list').append(listItem);
      });

      var title = titles[i];

      $('#btn').text('Thinking...');
      $('#btn').prop('disabled', true);

      makeRequest(title);
    };
});
