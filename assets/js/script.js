
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
// var array = []

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
	// var array = []
	// array.push(body[0].confirmed);
	// array.push(body[0].recovered);
	// console.log(body[0].confirmed)
	// console.log(array)
	renderChart(body[0].confirmed, body[0].recovered, body[0].deaths );
	// console.log(body[0].confirmed);
	// console.log(body[0].deaths);
	// console.log(body[0].recovered);	
	})

	.catch((error) => {
		console.log(error)
		console.log(msg)
		$(".msg" && ".refresh").html ("Please click to refresh and search for a valid country").show()
	});

//	msg.textContent = "";
//	form.reset();
//	input.focus();
};


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

var PreviousCountries = [];
  
$("#submit").click(function(event){
	// console.log(event.target)
	// console.log($(this).parentsUntil(".input").find("#search-input").val());
	// var country = $(this).parentsUntil(".input").find("#search-input").val();
	// var country = $(this).$('#browser option:selected').text();
	var country = $("input[name=browser]").val();
				
		// console.log(country);
		if (covidDataChart){
			covidDataChart.destroy();	
		}	
		dataByCountry(country);
		//get List of countries
		var arrayCountries = $("option[option-country]");
		// console.log(arrayCountries)

		//Save to local Storage
		
		
		// localStorage.setItem(country, JSON.stringify(country));
		if ($.inArray(country, PreviousCountries)==-1){
			PreviousCountries.push(country);
			localStorage.setItem("PreviousCountries", JSON.stringify(PreviousCountries));
		}
		console.log(PreviousCountries)
		renderLocalStorage()

	});


var renderLocalStorage = function(arrayCountries){
	
	//https://stackoverflow.com/questions/17745292/how-to-retrieve-all-localstorage-items-without-knowing-the-keys-in-advance
	const items = { ...localStorage };
	var localStorageString = items.PreviousCountries 
	var localStorageArray = JSON.parse(localStorageString)
	for (var i=0; i<localStorageArray.length; i++ ) {
		$(".previous").
		append(`
		<li><button id="${localStorageArray[i]}" class="button previous-button is-small is-warning is-light is-focused is-rounded"><span id="previous-country"></span>${localStorageArray[i]}</button></li>
		`)
	}
}

const arrayCountries = [];

// Add Countries to dropdown
function getCountries() {
	const endpointUrl = "https://covid-19-data.p.rapidapi.com/help/countries";

	fetch(endpointUrl, options)
	.then(response => {
		return response.json();
	})
	.then((body) => {
		// console.log(body);
		// console.log(body[0].name)
		// arrayCountries = body	
		for (var i = 0 ; i < body.length ; i++ ) {
			$("#browsers").append(`<option class="option-country" value="${body[i].name}">`);
			arrayCountries.push(body[i].name)
			// `<option id=${body[i].name} value=${body[i].name}>`		
		};
		
		renderLocalStorage(arrayCountries)

		
	})

	.catch((error) => {
		console.log(error);
		$(".msg" && ".refresh").html ("Please click to refresh and search for a valid country").show();		
	});
		
};

function init(){
	getCountries();
	
}

init()




function autocomplete(inp, arr) {
	
	var currentFocus;

	inp.addEventListener("input", function(e) {
		var a, b, i, val = this.value;
		
		closeAllLists();
		if (!val) { return false;}
		currentFocus = -1;
	
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		
		this.parentNode.appendChild(a);
	
		for (i = 0; i < arr.length; i++) {
		 
		  if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
			
			b = document.createElement("DIV");
		
			b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
			b.innerHTML += arr[i].substr(val.length);
			
			b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
			
			b.addEventListener("click", function(e) {
				
				inp.value = this.getElementsByTagName("input")[0].value;
				
				closeAllLists();
			});
			a.appendChild(b);
		  }
		}
	});

	inp.addEventListener("keydown", function(e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
		 
		  currentFocus++;
		 
		  addActive(x);
		} else if (e.keyCode == 38) { 
		  
		  currentFocus--;
		 
		  addActive(x);
		} else if (e.keyCode == 13) {
		  
		  e.preventDefault();
		  if (currentFocus > -1) {
		
			if (x) x[currentFocus].click();
		  }
		}
	});
	function addActive(x) {

	  if (!x) return false;
	 
	  removeActive(x);
	  if (currentFocus >= x.length) currentFocus = 0;
	  if (currentFocus < 0) currentFocus = (x.length - 1);

	  x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
	  
	  for (var i = 0; i < x.length; i++) {
		x[i].classList.remove("autocomplete-active");
	  }
	}
	function closeAllLists(elmnt) {
	 
	  var x = document.getElementsByClassName("autocomplete-items");
	  for (var i = 0; i < x.length; i++) {
		if (elmnt != x[i] && elmnt != inp) {
		  x[i].parentNode.removeChild(x[i]);
		}
	  }
	}
	
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
  }

function refreshPage(){
    window.getElementById(".refresh").reload();
}   

 
  //autocomplete(document.getElementById("search-input"), endpointUrl);

