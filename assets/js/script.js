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
var input = document.getElementById('search-input');
var invalidCountryMsg = document.querySelector(".refresh");
var downloadButton = $('.hide')
// console.log(invalidCountryMsg)
// console.log(invalidCountryMsg.html)

var msg = $(".msg")

const labels = ['Confirmed', 'Recovered', 'Deaths' ];

var covidDataChart = "";
var arrayCountries = [];
var SearchedCountries = [];
var errorWrongCountry = false

var m = moment()
var  mFormat = moment()

// var CurrentDate = moment();

// console.log(CurrentDate)
// console.log(CurrentDate.format('Do MMMM YYYY'))

//https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
function remove(arrOriginal, elementToRemove){
    return arrOriginal.filter(function(el){return el !== elementToRemove});
}

function removeCountryAndRender(){
	var removeThis = $("input[name=browser]").val()
	// console.log(removeThis)
	SearchedCountries = JSON.parse(localStorage.getItem("SearchedCountries"));
	var cleanArray = remove(SearchedCountries, toTitleCas(removeThis));			
	localStorage.setItem("SearchedCountries", JSON.stringify(cleanArray));
	$('#search-list').empty();
	searchListRender();	
	
	$("#browsers option").value = ''
  }

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
	// downloadButton.style.display = "inline-block";
	})
	.catch(() => {	
		removeCountryAndRender();
		$(".msg" && ".refresh").html ("Please click to refresh and search for a valid country").show();	
		countryName.textContent ="";
	});
};

//Fetch Data By Country and Date
function dataByCountryDate (country, date){
	const endpointUrl = `https://covid-19-data.p.rapidapi.com/report/country/name?name=${country}&date=${date}`;
	// countryName.textContent = toTitleCas(country);
	m = moment(date, 'YYYY-MM-DD')
	mFormat = m.format('Do MMMM YYYY');	
	console.log(country) 
	console.log(mFormat) 
	countryName.textContent = country + " - " + mFormat
	
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
	var chartType = $("#chart-type option:selected" ).text();
	
		
	var barChartData ={
		type: chartType, //bar, horizontalBar, pie, line, donut, radar, polarArea , doughnut
		data: {
		labels: labels,
		datasets: [{
			data: [confirmed, recovered, deaths ],
			backgroundColor: ["blue" , "green", "red"],
			borderColor: ["black" , "black" , "black" ],
			borderWidth: 1.5,
			hoverOffset: 4,
			label: 'Confirmed',
			}]
				 
		},
			//Configutation options
			options: {					
					legend: {						
						display: true,
						position:'right',	
						padding:500,						
						labels:{
							color: 'rgb(255, 99, 132)',
							font : {size:24},						
													
						}
					},
					subtitle: {
						display: false,
						text: 'Confirmed Recovered Deaths '
					},
					animation : {
						onComplete : downloadChart()
					},
					scales: {
						yAxes: [{
						  ticks: {
							beginAtZero: true
						  }
						}]
					  },
					  title: {
						display: true,
						text: 'COVID-19 API'
					},		
			
			
		}
	};
	var myChart = document.getElementById('myChart').getContext('2d');
	
	covidDataChart = new Chart(myChart, barChartData);	
	

	if( chartType == "pie" || chartType =="doughnut" || chartType =="polarArea" ){
		covidDataChart.canvas.parentNode.style.height = '600px';
		covidDataChart.canvas.parentNode.style.width = '600px';
	}

	if( chartType == "bar" ){
		covidDataChart.canvas.parentNode.style.height = '800px';
		covidDataChart.canvas.parentNode.style.width = '800px';
	}
}  

//https://dev.to/noemelo/how-to-save-chart-as-image-chart-js-2l0i
//https://github.com/NoeMelo/Chart.js
function downloadChart(){
	document.getElementById("download").addEventListener('click', function(){
	var url_base64jp = document.getElementById("myChart").toDataURL("image/jpg");
	var a =  document.getElementById("download");
	a.href = url_base64jp;
  });
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
		<button class="button is-small is-rounded button-saved-country">❌</button>
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

function AddCountryToStorage(country, date){
	if (!date){
		SearchedCountries.push(country)
	} else {
		SearchedCountries.push(country + "_" + date)
	}
	
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
		$(".msg" && ".refresh").html ("Get Countries failed").show()				
	});		
};

//Clear input
$("#clear").click(function(){
	input.value = '';		
});

  
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
	console.log(date);
	if (covidDataChart){
		covidDataChart.destroy();	
	}	
	try {
		if (!date)  {
			AddCountryToStorage(country,date)
			dataByCountry(country);
			
		} else {
			AddCountryToStorage(country, date)
			dataByCountryDate(country, date)		
		}	
	}	
	catch (e){
		console.log(e)
	}
});

var searchLink = function(){
	$("li.saved-search").on("click",function(event) {  
		var element = event.target;
		var country = "";
		var date = "" 
		if (element.classList.contains("saved-search")){
		// console.log(element.textContent)
		var storedString= element.childNodes[0].nodeValue.trim()
		if (storedString.indexOf("-")==-1){
			country = storedString;
		} else {
			var spliString = storedString.split("_");
			country = spliString[0]
			date = spliString[1]
		}	
		

		if (covidDataChart){
			covidDataChart.destroy();	
		}	
		if (!date)  {
			dataByCountry(country);
			
		} else if (date){			
			dataByCountryDate(country, date)		
		}
		}else{
		return
		}	
	});
	}

function init(){
		getCountries();	
		searchListRender();		
				
	}

init()
	