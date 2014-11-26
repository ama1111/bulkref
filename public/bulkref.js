var i = 0;
var titles;

$(function() {

    var template = jQuery.validator.format('<div class="list-group-item"><h4 class="list-group-item-heading">{0}</h4><div id="loading-{1}"><img src="spinny.gif"></img>Loading...</div><div id="citation-container-{1}" style="display: none;"><p class="list-group-item-text" id="citation-text-{1}"></p><div class="btn-group"><button type="button" class="btn btn-default" id="approve-{1}">Approve</button><button type="button" class="btn btn-default">Reject</button></div></div><div id="error-text-{1}" style="display: none; color: red;"></div><div id="doi-{1}" style="display: none;"></div></div>');

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
	if (i < titles.length) {
	    title = titles[i];
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

    $('#btn').click(function(e) {
	console.log('click');

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
    });

});
