$(document).ready(function() {

	// remove the data in search box
	$("#clearSearch").click(function () {
		$("#manloc").val("");
	});


	var sno=0;
	var locnames=[];		// array of location names
	var cordlist=[];		// cordlist to contain array of objects. An object contains latitude and longitude.


	// function checks if user is trying to add same location twice
	function checkDuplicate(ob) {
		// returns true if location already added
		// else false
		for(var i=0;i<cordlist.length;i++)
		{
			if(cordlist[i].lat==ob.lat && cordlist[i].lng==ob.lng)
			{
				return true;
			}
		}
		return false;
	}

	function showPosition(position)
	{
		var lat=position.coords.latitude;					// fetch the coordinates
		var lng=position.coords.longitude;

		var ob={"lat":lat,"lng":lng};						// lat1,lng1 in a single element of cordlist
		
		if(!checkDuplicate(ob))
		{

			cordlist.push(ob);
	
			$.ajax({
				// coordinate --> location_name
				url: "https://dev.virtualearth.net/REST/v1/Locations/"+lat+","+lng+"?&key=AkW_VcHhnQ2h7_vCU7CeSvNeOWG3Z6mDyEGAgazwHSRebxY1agfeOrWoIKk0a-V2",
		
				type: "GET",
			
				success:function(data) {
					var addr=data["resourceSets"][0].resources[0].address;

					var row_id='row'+sno;
					$("#dataout").append("<tr id="+row_id+"><td>"+sno+"</td><td>"+addr.formattedAddress+"</td><td>"+lat+"N, "+lng+"E</td><td><button class='btn btn-success btn-sm' id='src' data-record="+sno+"> Choose</button></td></tr>");
					locnames[sno]=addr.formattedAddress;
					sno=sno+1;
				}
			});
		}
		else
		{
			alert("Location with the coordinates "+ob.lat+" "+ob.lng+" already added.");
		}
	}
	// invoked when "Add location button" is clicked
	function getLocation()
	{
		if(navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(showPosition);
		}
		else
		{
			alert("Location with the coordinates "+ob.lat+" "+ob.lng+" already added.");
		}
	}
	$("#addloc").click(function() {
		getLocation();
	});

	/* ------------------------------------------------------------------------------------------------- */

	// function to show Position that has been selected from suggestions
	$('#addmanloc').click(function() {
		var selectedloc=$('#manloc').val();

		// location_name to coordinates
		if(selectedloc.length>0)
		{
			$.ajax({
				url: "https://dev.virtualearth.net/REST/v1/Locations?query="+selectedloc+"&maxResults=1&key=AkW_VcHhnQ2h7_vCU7CeSvNeOWG3Z6mDyEGAgazwHSRebxY1agfeOrWoIKk0a-V2",

				type: "GET",

				success: function(data)
				{
					// return latitude and longitude
					var latlng=data["resourceSets"][0].resources[0].point.coordinates;
					var ob={"lat":latlng[0],"lng":latlng[1]};

					if(!checkDuplicate(ob))
					{
						cordlist.push(ob);											// add the location to coordinate list
						
						var row_id='row'+sno;
						$("#dataout").append("<tr id="+row_id+"><td>"+sno+"</td><td>"+selectedloc+"</td><td>"+latlng[0]+"N,"+latlng[1]+"E</td><td><button class='btn btn-success btn-sm' id='src' data-record="+sno+"> Choose</button></td></tr>");
						locnames[sno]=selectedloc;
						sno=sno+1;
					}
					else
					{
						alert("Location with the coordinates "+ob.lat+" "+ob.lng+" already added.");
					}
				}
			});
			$("#manloc").val("");
		}
	});

	// function to get location when user types manually
	function getPosAndSuggest(position)
	{
		var lat=position.coords.latitude;
		var lng=position.coords.longitude;
		var searchexp=$('#manloc').val();

		if(searchexp.length>0 && searchexp.length<18)
		{
		
			$.ajax({
				url: "https://dev.virtualearth.net/REST/v1/Autosuggest?query="+searchexp+"&userLocation="+lat+","+lng+",50&includeEntityTypes=Place,Address,Business&key=AkW_VcHhnQ2h7_vCU7CeSvNeOWG3Z6mDyEGAgazwHSRebxY1agfeOrWoIKk0a-V2",
				type: "GET",

				success:function(data)
				{
					var content=data.resourceSets[0].resources[0].value;
					for(var i=0;i<content.length;i++)
					{
						// 3 types of places can be suggested as per JSON response. (Place, Address and LocalBusiness)
						switch(content[i].__type)
						{
							case "LocalBusiness" : $('#locsugs').append("<option>"+content[i].name+" "+content[i].address.formattedAddress+"</option>");
													break;

							case "Place" : $('#locsugs').append("<option>"+content[i].address.formattedAddress+"</option>");
											break;

							case "Address" : $('#locsugs').append("<option>"+content[i].address.formattedAddress+"</option>");
											break;
						}
					}
				}
			});
		}
	}
	$('#manloc').on("keyup",function() {
		// have to get user position and suggest the locations relating to search text
		var pos=navigator.geolocation.getCurrentPosition(getPosAndSuggest);
	})


	/* --------------------------------------------------------------------------------------------------- */
	
	// when the "Choose as source" button is clicked
	$(document).on("click","#src",function() {
		var srcindex=$(this).data('record');		// source element

		if(cordlist.length<3)
		{
			alert("Enter at least THREE locations to choose source");
			return;
		}
		
		// find the distance matrix

		var dmatrix=[];

		// initialize distance matrix
		for(var i=0;i<cordlist.length;i++)
		{
			var init=[];
			for(var j=0;j<cordlist.length;j++)
			{
				init.push(-1);
			}
			dmatrix.push(init);
		}

		var loclist=[];
		for(var i=0;i<cordlist.length;i++)
		{
			// forming source and dest strings in URL parameter
			loclist=loclist+cordlist[i]["lat"]+","+cordlist[i]["lng"]+";";
		}
		loclist=loclist.substr(0,loclist.length-1);			// remove the trailing semicolon

		var totalLength=0;
		$.ajax({
			// display the distance matrix
			url: "https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins="+loclist+"&destinations="+loclist+"&travelMode=driving&key=AkW_VcHhnQ2h7_vCU7CeSvNeOWG3Z6mDyEGAgazwHSRebxY1agfeOrWoIKk0a-V2",
			async: false,
			type: "GET",

			success: function(data)
			{
				totalLength=data["resourceSets"][0].resources[0].results.length;
				var results=data["resourceSets"][0].resources[0].results;
				
				for(var i=0;i<totalLength;i++)
				{
					var oi=results[i]["originIndex"];
					var di=results[i]["destinationIndex"];

					dmatrix[oi][di]=results[i]["travelDistance"];
				}

			}
		});
		// Apply TSP on dmatrix;
		//---------------------------------------------------------------

		var finalpath=[];					// contains ordering of places in the desired order (required path)
		var totalcost=0;					// contains the value which represents the total distance

		
		/*-----------------------------------------------------------------------------------------*/

		function perm(seq)
		{
			var allperms = [];
			for (var i = 0; i < seq.length; i=i+1)
        		{
        			var rest = perm(seq.slice(0, i).concat(seq.slice(i + 1)));
                		if(!rest.length)
                		{
                        		allperms.push([seq[i]])
                		}
                		else
                		{
                			for(var j = 0; j < rest.length; j=j+1)
                			{
                				allperms.push([seq[i]].concat(rest[j]))
                			}
                		}
        		}
        		return allperms;
		}

		function solveForTSP()
		{
			var seq=[];
			for(var i=0;i<sno;i++)
			{
				if(i!=srcindex)
				{
					seq.push(i);
				}
			}
			var allperms=perm(seq);
		
        
        		for(var i=0;i<allperms.length;i++)
        		{
                		var totaldist=dmatrix[srcindex][allperms[i][0]]
                		var j=0;
                		while(j<allperms[i].length-1)
                		{
                        		totaldist+=dmatrix[allperms[i][j]][allperms[i][j+1]]
                        		j+=1
                		}
                		totaldist+=dmatrix[allperms[i][j]][srcindex]
                		if(totaldist<totalcost)
                		{
                        		totalcost=totaldist;
                        		finalpath=allperms[i];
                		}
        		}
		}

		//solveForTSP();
		//console.log(finalpath)

		// Above is brute force approach
		// Find B and B approach in compute.js

		/* -----------------------------------------------------------------------------------------------------------------*/

		var [finalpath,totalcost]=computeTSP(srcindex,dmatrix,dmatrix.length)				// computeTSP returns path and cost


		// display the required path
		$("#matrix").html("");
		$("#matrix").append("<h4>Path to be travelled : </h4>");
		var content="";

		content="<ol>"
		content+="<li><strong class='text-success'>"+locnames[srcindex]+"</strong> &#10145;</li>";		
		for(var i=1;i<finalpath.length-1;i++)
		{
			content+="<li><strong class='text-success'>"+locnames[finalpath[i]]+"</strong> &#10145;</li>";	
		}
		content+="<li><strong class='text-success'>"+locnames[srcindex]+"</strong></li>";
		content+="</ol>";

		/*
		var totalcost=0;
		var j=0,k=0;
		while(j<sno-1)
		{
			k=j+1;
			totalcost+=dmatrix[finalpath[j]][finalpath[k]];
			j+=1
		}
		*/

		content+="<br/><strong>&#9758; Total Distance : "+totalcost+" km.</strong>";
		$("#matrix").append(content);

		// display the distance matrix
		$("#showDetails").css({"display":"block"});
		$("#showDetails").click(function() {
			var c=$('#showDetails').html();
			
			$("#dmatrix").fadeToggle();

			if(c[0]=="S")			// Change the button to Hide details
			{
				$("#showDetails").html("Hide")
				$("#dmatrix").html("");
				$("#dmatrix").append("<caption style='caption-side:top'>Matrix rows are indexed as per Sno.</caption>");
				$("#dmatrix").append("<caption>All measures are in km.</caption>");

				$("#dmatrix").append("<tr>");
				$("#dmatrix").append("<td class='bg-info'>Locations</td>");					// cell at top left corner
				for(var i=0;i<sno;i++)
				{
					$('#dmatrix').append("<td class='bg-info text-white'>"+locnames[i]+"</td>");
				}				
				$("#dmatrix").append("</tr>");

				for(var i=0;i<sno;i++)
				{
					$("#dmatrix").append("<tr>");
					$("#dmatrix").append("<td class='bg-info text-white'>"+locnames[i]+"</td>");
					for(var j=0;j<sno;j++)
					{
						$('#dmatrix').append("<td>"+dmatrix[i][j]+"</td>");
					}
					$("#dmatrix").append("</tr>");
				}
			}
			else					// Change the button to Show details
			{
				$("#showDetails").html("Show the Distance matrix");
			}
		});
		
		// Produce map output
		$.ajax({

			url: "https://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=17.6868,83.2185&wp.1=18.1067,83.3956&optmz=distance&routeAttributes=routePath&key=AkW_VcHhnQ2h7_vCU7CeSvNeOWG3Z6mDyEGAgazwHSRebxY1agfeOrWoIKk0a-V2",
			type: "GET",
			success: function(data)
			{

				var map = new Microsoft.Maps.Map('#myMap', {
	        	credentials: 'AkW_VcHhnQ2h7_vCU7CeSvNeOWG3Z6mDyEGAgazwHSRebxY1agfeOrWoIKk0a-V2',
	        	center: new Microsoft.Maps.Location(cordlist[finalpath[0]].lat,cordlist[finalpath[0]].lng)
	    		
	    		});

				map.setView({
	        	zoom: 10
	    		});

	    		//var points=data.resourceSets[0].resources[0].routePath.line.coordinates;
	    		for(var i=0;i<cordlist.length;i++)
	    		{
	    			var current=new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(cordlist[finalpath[i]].lat,cordlist[finalpath[i]].lng), {
	    			text:""+(i+1),
	    			title: locnames[finalpath[i]],
	    			width:2
	    			});
	    			
	    			map.entities.push(current);
	    		}

	    		// Draw route path line between the locations to be visited
	    		for(var i=0;i<cordlist.length-1;i++)
				{
					$.ajax({

						url: "https://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0="+cordlist[finalpath[i]].lat+","+cordlist[finalpath[i]].lng+"&wp.1="+cordlist[finalpath[i+1]].lat+","+cordlist[finalpath[i+1]].lng+"&optmz=distance&routeAttributes=routePath&key=AkW_VcHhnQ2h7_vCU7CeSvNeOWG3Z6mDyEGAgazwHSRebxY1agfeOrWoIKk0a-V2",

						//url: "https://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=17.6868,83.2185&wp.1=18.1067,83.3956&optmz=distance&routeAttributes=routePath&key=AkW_VcHhnQ2h7_vCU7CeSvNeOWG3Z6mDyEGAgazwHSRebxY1agfeOrWoIKk0a-V2",
				
						type: "GET",
						success: function(data)
						{

	    					var points=data.resourceSets[0].resources[0].routePath.line.coordinates;
                    		var linevertices=[];
        			
        					for(var i=0;i<points.length;i++)
        					{
        						var loc=new Microsoft.Maps.Location(points[i][0],points[i][1]);
                        		linevertices.push(loc);
        					}
                    
                   			var line=new Microsoft.Maps.Polyline(linevertices);

                    		map.entities.push(line);

						}	
					});
				}
			}
		});
	});
});
