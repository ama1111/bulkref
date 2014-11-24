var i = 0;
var titles;

$(function() {

    var template = jQuery.validator.format('<div class="list-group-item"><h4 class="list-group-item-heading">{0}</h4><div id="loading-{1}"><img src="spinny.gif"></img>Loading...</div><div id="citation-container-{1}" style="display: none;"><p class="list-group-item-text" id="citation-text-{1}"></p><div class="btn-group"><button type="button" class="btn btn-default">Approve</button><button type="button" class="btn btn-default">Reject</button></div></div></div>');

    function onSuccess(data) {
	console.log("data from ajax:");
	console.log(data);

	//i++;
	$("#loading-"+i).hide();

	if (data.results[0].match) {

	    var citation = data.results[0].citation;
	    console.log(data.results[0].citation);

	    $("#citation-text-"+i).text(citation);
	    $("#citation-container-"+i).show();

	    var doi = data.results[0].doi;
	    console.log(doi);

	    var current = $("#doi-area").val();
	    if (current.length > 0)
	    {
		current += "\n";
	    }
	    $("#doi-area").val(current + doi);

	    //$('#btn').text('Click me!');
	    //$('#btn').prop('disabled', false);

	}
	else {
	    alert("Didn't find match for '" + title + "'");
	    //$('#btn').text('Click me!');
	    //$('#btn').prop('disabled', false);
	}

	i++;
	if (i < titles.length) {
	    title = titles[i];
	    makeRequest(title);
	}
    }

    function onError(jqxhr, textStatus, errorThrown) {
	console.log("textStatus:");
	console.log(textStatus);
	console.log("errorThrown:");
	console.log(errorThrown);
	alert("Unable to find DOI for '" + title + "'");
	$('#btn').text('Click me!');
	$('#btn').prop('disabled', false);

    }
	
    function makeRequest(title) {
	var titleData = JSON.stringify([title]);	      

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
