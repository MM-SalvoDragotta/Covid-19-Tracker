const rapidApiKey = "689cdde1e7mshecdba67d4030dcfp1c88acjsn0cf409ea52a5";
const rapidApiHost = "covid-19-data.p.rapidapi.com"

const options = {
	headers: {
	  "x-rapidapi-host": rapidApiHost,
	  "x-rapidapi-key": rapidApiKey,
	},
  };

const searchList = document.querySelector("#search-list");
var countryName = document.getElementById('results-text');
var msg = $(".msg")

const labels = ['Confirmed', 'Recovered', 'Deaths' ];

var covidDataChart = "";
var arrayCountries = [];
var SearchedCountries = [];



//https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
function toTitleCas (phrase) {
	return phrase
	  .toLowerCase()
	  .split(' ')
	  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
	  .join(' ');
  };

//Fetch Data By Country
var dataByCountry = function (country){
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
			$(".msg" && ".refresh").html ("There is no data for this date .Please click to refresh").show()
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
				// onAnimationProgress: drawSegmentValues,
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
					animation : {
						onComplete : downloadChart()
					},
					
					
			},
			plugins: [ChartDataLabels],
			options: {
				
			}
		}
	};
	var myChart = document.getElementById('myChart').getContext('2d');
	
	covidDataChart = new Chart(myChart, barChartData);	
	covidDataChart.plugins.register(ChartDataLabels);

}  

function downloadChart(){
	document.getElementById("download").addEventListener('click', function(){
	var url_base64jp = document.getElementById("myChart").toDataURL("image/jpg");
	var a =  document.getElementById("download");
	a.href = url_base64jp;
  });
}



function fillText(){
	var ctx = this.chart.ctx;
	ctx.fillStyle = '#fff';
	ctx.fillText(percent, model.x + x, model.y + y + 15);
}

var renderLocalStorage = function(){

	SearchedCountries = SearchedCountries.map(function(x){ return toTitleCas(x); })
	SearchedCountries.sort()
	//https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
	var unique = SearchedCountries.filter((v, i, a) => a.indexOf(v) === i);
	
	for (var i=0; i<unique.length; i++ ) {
		$("#search-list").
		append(`
		<li data-index=${i} class="saved-search button previous-button is-small is-warning is-light is-focused is-rounded">${unique[i]}
		<button class="button-saved-country">❌</button>
		</li>
		`)
	}
}

function storeSearches() {
	// Stringify and set key in localStorage to theSearches array
	localStorage.setItem("SearchedCountries", JSON.stringify(SearchedCountries));
  }

function searchListRender(){
	var storedSearches = JSON.parse(localStorage.getItem("SearchedCountries"));
	// If theScores were retrieved from localStorage, update the theSearches array to it
	if (storedSearches !== null) {
	  storedSearches = storedSearches.map(function(x){ return toTitleCas(x); })
	  storedSearches.sort()
	  var unique = storedSearches.filter((v, i, a) => a.indexOf(v) === i);
  
	  SearchedCountries = unique;
	  localStorage.setItem("SearchedCountries", JSON.stringify(unique));
	}
	// This is a helper function that will render Searches to the DOM
	renderLocalStorage();
	searchLink ();
  }

function AddCountryToStorage(country){
	SearchedCountries.push(country)
	$('#search-list').empty()
	SearchedCountries = SearchedCountries.map(function(x){ return x.toUpperCase(); })
	SearchedCountries.sort()
	var unique = SearchedCountries.filter((v, i, a) => a.indexOf(v) === i);
	
	SearchedCountries = unique;
	localStorage.setItem("SearchedCountries", JSON.stringify(unique));
	
	searchListRender()  
  
	const url = `https://covid-19-data.p.rapidapi.com/country?name=${country}`;
	return url
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
	})
	.catch((error) => {
		$(".msg" && ".refresh").html ("Please click to refresh and search for a valid country").show()				
	});		
};

function refreshPage(){
    window.getElementById(".refresh").reload();
}   

//remove the saved search
searchList.addEventListener("click", function(event) {
	var element = event.target;
	// Checks if element is a button
	if (element.classList.contains("button-saved-country")){
	
	  // Get its data-index value and remove the search element from the list
	  var index = element.parentElement.getAttribute("data-index");
	  SearchedCountries.splice(index, 1);
	  $('#search-list').empty()
	  // Store updated theScores in localStorage, re-render the list
	  storeSearches();
	  searchListRender();    
	}else{
	  return
	}
  });

$("#submit").click(function(event){
	var country = $("input[name=browser]").val();
	if (country === "") {
		return;
	  }  
	var date = $("#date-input-start").val();				
	// console.log(country);
	if (covidDataChart){
		covidDataChart.destroy();	
	}	
	if (!date)  {
		AddCountryToStorage(country)
		dataByCountry(country);
		
	} else {
		AddCountryToStorage(country)
		dataByCountryDate(country, date)		
	}		
});

var searchLink = function(){
	$("li.saved-search").on("click",function(event) {  
		var element = event.target; 
		if (element.classList.contains("saved-search")){
		// console.log(element.textContent)
		var country= element.childNodes[0].nodeValue.trim()
		console.log(country) 
		console.log('testing');
		// var url = AddCountryToStorage(country)
		// renderLocalStorage();
		if (covidDataChart){
			covidDataChart.destroy();	
		}	
		// if (!date)  {
		// 	AddCountryToStorage(country)
		// 	dataByCountry(country);
			
		// } else {
		// 	AddCountryToStorage(country)
		// 	dataByCountryDate(country, date)		
		// }	
		dataByCountry(country)

		}else{
		return
		}	
	});
	}

//Download Chart Image


	function init(){
		getCountries();	
		searchListRender();
		// searchLink();
				
	}

	init()
	