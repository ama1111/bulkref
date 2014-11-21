var i = -1;
var titles;

$(function() {

    var template = jQuery.validator.format('<div class="list-group-item"><h4 class="list-group-item-heading">{0}</h4><div id="loading-{1}"><img src="spinny.gif"></img>Loading...</div><div id="citation-container-{1}" style="display: none;"><p class="list-group-item-text" id="citation-text-{1}"></p><div class="btn-group"><button type="button" class="btn btn-default">Approve</button><button type="button" class="btn btn-default">Reject</button></div></div></div>');
    
    $('#btn').click(function(e) {
	console.log('clicked');

	$("#citation").text("");
	$("#doi").text("");

	
	var titleData;
	if (i < 0) {
	    var multiline = $('#title-area').val();
	    titles = multiline.split('\n');

	    //var title = $('#title-text').val();
	    //var titleData = JSON.stringify([title]);
	    i = 0;
	}

	var nonemptyTitles = titles.filter(function (element) {
	    return !(!element);
	});

	nonemptyTitles.forEach(function(title, j) {
	    var listItem = template(title, j);
	    $('#result-list').append(listItem);
	});
	
	// Skip past empty lines
	while (!titles[i] && i < titles.length) {
	    i++;
	}

	if (i >= titles.length) {
	    alert('done');
	    return;
	}

	var title = titles[i];
	i++;

	if (!title) {
	    alert('empty title');
	    return;
	}
	
	titleData = JSON.stringify([title]);	      

	$('#btn').text('Thinking...');
	$('#btn').prop('disabled', true);
	
	$.ajax({
	    url:'/links',
	    type:"POST",
	    data:titleData,
	    contentType:"application/json; charset=utf-8",
	    dataType:"json",
	    success: function(data) {
		console.log("data from ajax:");
		console.log(data);

		$("#loading-"+(i-1)).hide();

		if (data.results[0].match) {

		    var citation = data.results[0].citation;
		    console.log(data.results[0].citation);
		    $("#citation").text(citation);

		    $("#citation-text-"+(i-1)).text(citation);
		    $("#citation-container-"+(i-1)).show();

		    var doi = data.results[0].doi;
		    console.log(doi);
		    $("#doi").text(doi);

		    var current = $("#doi-area").val();
		    if (current.length > 0)
		    {
			current += "\n";
		    }
		    $("#doi-area").val(current + doi);

		    $('#btn').text('Click me!');
		    $('#btn').prop('disabled', false);

		}
		else {
		    alert("Didn't find match for '" + title + "'");
		    $('#btn').text('Click me!');
		    $('#btn').prop('disabled', false);
		}
		
	    },
	    error: function(jqxhr, textStatus, errorThrown) {
		console.log("textStatus:");
		console.log(textStatus);
		console.log("errorThrown:");
		console.log(errorThrown);
		alert("Unable to find DOI for '" + title + "'");
		$('#btn').text('Click me!');
		$('#btn').prop('disabled', false);
	    }
	});
	
    });
});
