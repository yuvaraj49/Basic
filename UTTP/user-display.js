$(document).ready(function() {

	var total,hlen;
	$(document).on('click','#fetcher', function() {

		var valid=true;
		for(var i=0;i<total;i++)
		{
			console.log($("#sub"+i+"").val());
			if($("#sub"+i+"").val().length==0 || $("#fac"+i+"").val().length==0)
			{
				valid=false;
				break;
			}
		}

		if(valid==false)
		{
			window.alert("Enter all fields properly");
		}

		if($("#ch1").is(':checked')==true)
		{
			hlen=45;
		}
		else if($("#ch2").is(':checked')==true)
		{
			hlen=50;
		}
		else if($("#ch3").is(':checked')==true)
		{
			hlen=60;
		}
		else
		{
			valid=false;
			window.alert("Set the hour length");
		}

		if(valid==true)
		{
			$("#result").empty();
			for(i=0;i<6;i++)
			{
				main(total,hlen);
				if(i==0)
				{
					$("#result").append("<tr>");
					$("#result").append("<td>Day|Time</td>");
					for(var all in timeslots)									// displaying top row [timings of each period]
					{
						$('#result').append("<td style='font-weight:bold;'>"+all+"</td>");
					}
					$("#result").append("</tr>")
				}
				$("#result").append("<tr>");
				
				switch(i)
				{
					case 0 : $("#result").append("<td style='font-weight:bold;'>Monday</td>"); break;
					case 1 : $("#result").append("<td style='font-weight:bold;'>Tuesday</td>"); break;
					case 2 : $("#result").append("<td style='font-weight:bold;'>Wednesday</td>"); break;
					case 3 : $("#result").append("<td style='font-weight:bold;'>Thursday</td>"); break;
					case 4 : $("#result").append("<td style='font-weight:bold;'>Friday</td>"); break;
					case 5 : $("#result").append("<td style='font-weight:bold;'>Saturday</td>"); break;
				}

				for(var subs in timeslots)
				{
					$("#result").append("<td>"+timeslots[subs]+"</td>");
				}
				$("#result").append("</tr>");
			}

			$("#metaresult").html("");
			$("#metaresult").append("<li>Timings : 09:00am - 03.00pm. (Fixed). </li>");
			$("#metaresult").append("<li>No. of hours in one day as per given hour length: "+hrsperday+"</li>");
			$("#metaresult").append("<li>A subject can maximum occur "+eachsubcount+" in a day.</li>");
			$("#metaresult").append("<li>A day mostly contains all the subject</li>");

			$("#faclist").empty();
			for(var mapping in mapper)
			{
				$('#faclist').append("<li>"+mapping+" : "+mapper[mapping]+"</li>");
			}
		}
	});
	
	$("#enter").click(function() {
		total=$("#numclasses").val();
	//	document.getElementById('databox').innerHTML="";
		$("#databox").html("");
		if(total<2 || total>7)
		{
			alert("subjects should be minimum 2 and max 7");
			return;
		}
		else
		{
			$("#databox").append("<h3> Enter data below : </h3>");
			for(var i=0;i<total;i++)
			{
				$("#databox").append("<input type='text' placeholder='Subject name "+(i+1)+"' id=sub"+i+"> &nbsp; &equiv; &nbsp;");
				$("#databox").append("<input type='text' placeholder='Faculty name "+(i+1)+"' id=fac"+i+"> <br>");
			}
			$("#databox").append("<br><label>One hour length = </label>");
			$("#databox").append("<input type='radio' name='r1' id='ch1'> <label> 45 mins</label>");
			$("#databox").append("<input type='radio' name='r1' id='ch2'> <label> 50 mins</label>");
			$("#databox").append("<input type='radio' name='r1' id='ch3'> <label> 60 mins</label> <hr>");

			$("#databox").append("<center> <button id='fetcher'> Generate </button> </center>");
		}
	});

});