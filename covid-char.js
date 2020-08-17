(function() {
   let content = '';

   getData = () => {
       fetch('https://api.covid19api.com/summary')
       .then(response => response.json())
       .then((data) => {
          globalData(data);
       }).catch(err => console.log(err));
   }


   globalData = (covidData) => {
     let totalConfirmed = covidData.Global.TotalConfirmed;
     let totalDeaths = covidData.Global.TotalDeaths;
     let totalRecovered = covidData.Global.TotalRecovered;

    content += `
      <div class="gl">
       <h3>Global</h3>
      </div>
       <div class="row">
         <div class="col-sm">
          <div class="card text-white bg-danger mb-3" style="width: 20rem">
          <div class="card-header">Total Confirmed</div>
            <div class="card-body">
              <p class="card-text">${totalConfirmed.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div class="col-sm">
         <div class="card text-white bg-secondary mb-3" style="width: 20rem">
           <div class="card-header">Total Deaths</div>
           <div class="card-body">
             <p class="card-text">${totalDeaths.toLocaleString()}</p>
           </div>
          </div>
        </div>
        <div class="col-sm">
         <div class="card text-white bg-primary mb-3" style="width: 20rem">
           <div class="card-header">Total Recovered</div>
           <div class="card-body">
             <p class="card-text">${totalRecovered.toLocaleString()}</p>
           </div>
          </div>
         </div>
        </div>
     `;

     document.querySelector('.global').innerHTML = content;
  
     loadData();
    }

    loadData = () => {
      fetch('https://api.covid19api.com/country/philippines')
      .then(res => res.json())
      .then((responseData) => {
          let datas = setChartData(responseData);
          renderChart(datas);
      })
      .catch(err => console.log(err));
   }

    setChartData = (resData) => {
      let item = [];
      resData.forEach((dataItem) => {
            item.push(dataItem.Confirmed);
      });
      return item.slice(resData.length - 20, resData.length);
    }

     renderChart = (caseData) => {
       var ctx = document.getElementById('myChart').getContext('2d');
       chart = new Chart(ctx, {
          type: 'line',
      
          data: {
              labels: [],
              datasets: [{
                  label: 'Confirmed Case',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: 'rgba(75, 192, 192, 0.4)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  data: caseData
              }]
          }, 
          options: {
            responsive: true,
            scales: {
              xAxes: [{ display: true }],
              yAxes: [{ display: true }]
            }
          }
        });
        
        dataLabels = () => {
          fetch('https://api.covid19api.com/country/philippines')
          .then(res => res.json())
          .then((responseData) => {
             let date = [];
             responseData.forEach((dateData) => {
               date.push(new Date(dateData.Date).toDateString().substr(4,6));
             });
             chart.data.labels = date.slice(responseData.length - 20, responseData.length);
             chart.update();
          })
          .catch(err => console.log(err));
        }

        selectCountry = () => {
          fetch('https://api.covid19api.com/summary')
          .then(res => res.json())
          .then((resData) => {
            let countryName = [];
            let option = '';
            resData.Countries.forEach((resItem) => {
                countryName.push(resItem.Country);
            });
    
            for (let i = 0; i < countryName.length; i++) {
               option += '<option class="option" value="'+ countryName[i] +'">' + countryName[i] + '</option>';
            }
            
            document.querySelector('#country').innerHTML = option;
    
            document.querySelector('#country').addEventListener('change', function(){
                      let country = getSelected().value;
                      setCountry(country);
            }, false);
          })
        }
    
        getSelected = () => {
          let optionValue = document.querySelector('#country');
          let opt;
          for (let x = 0; x < optionValue.options.length; x++) {
              opt = optionValue.options[x];
              if (opt.selected === true) {
                break;
              }
          }
           return opt;
        }

        setCountry = (cou) => {
          fetch('https://api.covid19api.com/country/'+ cou)
          .then(res => res.json())
          .then((response) => {
              let countryData = [];
              response.forEach((logData) => {
                countryData.push(logData.Confirmed);
              })
               chart.data.datasets[0].data = countryData.slice(response.length - 20, response.length);;
               chart.update();
          })
          .catch(err => console.log(err));
       }
        dataLabels();
        selectCountry();
      }
   getData();
})();