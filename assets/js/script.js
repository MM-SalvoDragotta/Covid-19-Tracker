const rapidApiKey = "689cdde1e7mshecdba67d4030dcfp1c88acjsn0cf409ea52a5";
const rapidApiHost = "covid-19-data.p.rapidapi.com"
var msg = $(".msg")

const options = {
	headers: {
	  "x-rapidapi-host": rapidApiHost,
	  "x-rapidapi-key": rapidApiKey,
	},
  };

var countryName = document.getElementById('results-text');

const labels = ['Confirmed', 'Recovered', 'Deaths' ];
var covidDataChart = "";
var arrayCountries = [];

//https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
function toTitleCas (phrase) {
	return phrase
	  .toLowerCase()
	  .split(' ')
	  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
	  .join(' ');
  };

//Fetch Data By Country
function dataByCountry (country){
	const endpointUrl = `https://covid-19-data.p.rapidapi.com/country?name=${country}`;
	countryName.textContent = toTitleCas(country);
	//Fetch country data and display it
	fetch(endpointUrl, options)
	.then(response => {
		return response.json();
	})
	.then((body) => {
	renderChart(body[0].confirmed, body[0].recovered, body[0].deaths );	
	})
	.catch((error) => {
		$(".msg" && ".refresh").html ("Please click to refresh and search for a valid country").show()		
	});
};

//Fetch Data By Country and Date
function dataByCountryDate (country, date){
	const endpointUrl = `https://covid-19-data.p.rapidapi.com/report/country/name?name=${country}&date=${date}`;
	countryName.textContent = toTitleCas(country);
	//Fetch country data and display it
	fetch(endpointUrl, options)
	.then(response => {
		return response.json();
	})
	.then((body) => {
		if (body[0].provinces[0].confirmed) {
			renderChart(body[0].provinces[0].confirmed, body[0].provinces[0].recovered, body[0].provinces[0].deaths );
		} else {
			$(".msg").html ("There is no data for this date");
		}
	})
	.catch((err) => {
	console.log(err);
  });
}


//helpful tute on how to use charts.js: https://www.youtube.com/watch?v=sE08f4iuOhA 
function renderChart (confirmed, recovered, deaths){
	var chartType = $( "#chart-type option:selected" ).text();
		
	var barChartData ={
		type: chartType, //bar, horizontalBar, pie, line, donut, radar, polarArea , doughnut
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
				plugins: {
					legend: {
						display: true,						
						labels:{
							color: 'rgb(255, 99, 132)'
						}
					},
					subtitle: {
						display: false,
						text: 'Confirmed Recovered Deaths '
					},
	
			}
		}
	};
	var myChart = document.getElementById('myChart').getContext('2d');
	covidDataChart = new Chart(myChart, barChartData);		
}

var SearchedCountries = [];
  
$("#submit").click(function(event){
	var country = $("input[name=browser]").val();
	var date = $("#date-input-start").val();
				
		// console.log(country);
		if (covidDataChart){
			covidDataChart.destroy();	
		}	
		if (!date)  {
			dataByCountry(country);
		} else {
			dataByCountryDate(country, date)
		}
		//get List of countries
		var arrayCountries = $("option[option-country]");
		// console.log(arrayCountries)

		//Save to local Storage
		
		// if ($.inArray(country + " " + date, SearchedCountries)==-1){
		// 	SearchedCountries.push(country + " " + date);
		
		if ($.inArray(country, SearchedCountries)==-1){
			SearchedCountries.push(country);
			localStorage.setItem("SearchedCountries", JSON.stringify(SearchedCountries));
		}
		console.log(SearchedCountries)
		renderLocalStorage()

	});

var renderLocalStorage = function(arrayCountries){
	
	//https://stackoverflow.com/questions/17745292/how-to-retrieve-all-localstorage-items-without-knowing-the-keys-in-advance
	const items = { ...localStorage };
	var localStorageString = items.SearchedCountries 
	var localStorageArray = JSON.parse(localStorageString)
	for (var i=0; i<localStorageArray.length; i++ ) {
		$(".previous").
		append(`
		<li><button id="${localStorageArray[i]}" class="button previous-button is-small is-warning is-light is-focused is-rounded"><span id="previous-country"></span>${localStorageArray[i]}</button></li>
		`)
	}
}



// Add Countries to dropdown
function getCountries() {
	const endpointUrl = "https://covid-19-data.p.rapidapi.com/help/countries";

	fetch(endpointUrl, options)
	.then(response => {
		return response.json();
	})
	.then((body) => {	
		for (var i = 0 ; i < body.length ; i++ ) {
			$("#browsers").append(`<option class="option-country" value="${body[i].name}">`);
			arrayCountries.push(body[i].name)
			// `<option id=${body[i].name} value=${body[i].name}>`		
		};
		
		renderLocalStorage(arrayCountries)

		
	})

	.catch((error) => {
		$(".msg" && ".refresh").html ("Please click to refresh and search for a valid country").show()
				
	});
		
};

function init(){
	getCountries();
	
}

init()

function refreshPage(){
    window.getElementById(".refresh").reload();
}   

