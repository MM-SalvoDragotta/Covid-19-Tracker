const rapidApiKey = "689cdde1e7mshecdba67d4030dcfp1c88acjsn0cf409ea52a5";
const rapidApiHost = "covid-19-data.p.rapidapi.com"

const options = {
	headers: {
	  "x-rapidapi-host": rapidApiHost,
	  "x-rapidapi-key": rapidApiKey,
	},
  };

var countryName = document.getElementById('results-text');

// var country = "USA";
// var country2 = $('#search-input');
// console.log(country2.value);

const labels = ['Confirmed', 'Recovered', 'Deaths' ];

var covidDataChart = "";

//https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
function toTitleCas (phrase) {
	return phrase
	  .toLowerCase()
	  .split(' ')
	  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
	  .join(' ');
  };

function dataByCountry (country){
	const endpointUrl = `https://covid-19-data.p.rapidapi.com/country?name=${country}`;
	countryName.textContent = toTitleCas(country);
	//Fetch country data and display it
	fetch(endpointUrl, options)
	.then(response => {
		return response.json();
	})
	.then((body) => {
	// console.log(body);
	// console.log(body[0].confirmed)
	// myChart.destroy();
	renderChart(body[0].confirmed, body[0].recovered, body[0].deaths );
	console.log(body[0].confirmed);
	console.log(body[0].deaths);
	console.log(body[0].recovered);
		
	})
	.catch((err) => {
	console.log(err);
  });
}


//helpful tute on how to use charts.js: https://www.youtube.com/watch?v=sE08f4iuOhA 
function renderChart (confirmed, recovered, deaths){	
	// countryData = [30903, 910, 29466]
	var barChartData ={
		type: 'bar', //bar, horizontalBar, pie, line, donut, radar, polarArea , doughnut
			data: {
			labels: labels,
			datasets: [{
			data: [confirmed, recovered, deaths ],
			backgroundColor: ["blue" , "green", "red"],
			borderColor: ["black" , "black" , "black" ],
			borderWidth: 1.5,
			hoverOffset: 4
		}]		 
		},
			options: {
				// events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
				plugins: {
					legend: {
						display: false
					},
					subtitle: {
						display: true,
						text: 'Confirmed Recovered Deaths '
					},
					// customPlugin : {
					// 	id: 'custom_canvas_background_color',
					// 	beforeDraw: (myChart) => {
					// 		const ctx = myChart.canvas.getContext('2d');
					// 		ctx.save();
					// 		ctx.globalCompositeOperation = 'destination-over';
					// 		ctx.fillStyle = 'black';
					// 		ctx.fillRect(0, 0, myChart.width, myChart.height);
					// 		ctx.restore();
					// 	}

				// },
				// tooltip: {
				// 	// Tooltip will only receive click events
				// 	events: ['click']
				//   }
			}
		}


	};	
	var myChart = document.getElementById('myChart').getContext('2d');
	covidDataChart = new Chart(myChart, barChartData);	
	// console.log(covidDataChart);
}
  
$("#submit").click(function(event){
	// console.log(event.target)
	// console.log($(this).parentsUntil(".input").find("#search-input").val());
	// var country = $(this).parentsUntil(".input").find("#search-input").val();
	// var country = $(this).$('#browser option:selected').text();
	var country = $("input[name=browser]").val();
				
		console.log(country);
		if (covidDataChart){
			covidDataChart.destroy();	
		}	
		dataByCountry(country);
	});

function getCountries() {
	const endpointUrl = "https://covid-19-data.p.rapidapi.com/help/countries";

	fetch(endpointUrl, options)
	.then(response => {
		return response.json();
	})
	.then((body) => {
		// console.log(body);
		// console.log(body[0].name)
		for (var i = 0 ; i < body.length ; i++ ) {
			$("#browsers").append(`<option value="${body[i].name}">`);

			// `<option id=${body[i].name} value=${body[i].name}>`

		};
	})
	.catch((err) => {
		console.log(err);
	});
};

function save() {
	var country = ("#browser").value;
  	var new_data = document.getElementById.country;{
    localStorage.setItem(country, JSON.stringify([]));
  }
  var old_data = JSON.parse(localStorage.getItem(country));
  old_data.push(new_data);

  localStorage.setItem(country, JSON.stringify(old_data));
}

getCountries();


