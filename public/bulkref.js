var i = -1;
var titles;

$(function() {

    var template1 = '<div class="list-group-item"><h4 class="list-group-item-heading">';
    var template2 = '</h4><img src="spinny.gif"></img>Loading...</div>';
  
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

	nonemptyTitles.forEach(function(title) {
	    var listItem = template1 + title + template2;
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

		if (data.results[0].match) {

		    var citation = data.results[0].citation;
		    console.log(data.results[0].citation);
		    $("#citation").text(citation);

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
