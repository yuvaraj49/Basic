<!DOCTYPE html>
<html>
<head>
	<title>Index</title>
	<style type="text/css">
		body {
			font-family: sans-serif;
			text-align: center;
		}
		table,td {
			border-collapse: collapse;
			margin-right: auto;
			margin-left: auto;
		}
		td,th {
			padding: 5px;
		}
	</style>
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript">
		$(document).ready(function() {
			
			var i=1;
			$("#fetch").click(function () {
				getLocation();

			});

			function getLocation()
			{
				if (navigator.geolocation)
				{
					navigator.geolocation.getCurrentPosition(showPosition);
				}
				else
				{
					alert("Your browser doesn't support geolocation");
				}
			}

			function showPosition(position)
			{
				var lat=position.coords.latitude;
				var long=position.coords.longitude;

				$('table').append("<tr> <td> "+lat+"N,"+long+"E </td> <td> "+i+"</td> </tr>");
				i++;
			}

		});
	</script>
</head>
<body>
	<h2>Know the shortest route between your service points.</h2>
	<button id="fetch"> &equiv; Mark this place &equiv; </button>
	<hr>

	<div id='locations'>
		<table border="1">
			<caption>Your marked locations : </caption>
			<tr>
				<th>Coordinates</th>
				<th>Location name</th>
			</tr>
		</table>
	</div>
</body>
</html>