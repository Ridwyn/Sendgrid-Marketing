let allCategories=document.getElementById('allCategories')
let showStats=document.getElementById('showStats')
let showDate=document.getElementById('showDate')
let dropdownList=document.getElementById('dropdownList')

let statsCategory=[]

async function makeRequest(method,url,headers,body) {
    try {
      let  response = await axios({
        method: method,
        url:url,
        headers:headers,
        data: body
      }); 
        return response       
    } catch (error) {
        console.error(error);
    }
    
}

function filterMonth(date){
    console.log(date)
    console.log(statsCategory)
   let matchedDate= statsCategory.filter(function(date) {
        return statsCategory.date ==date;
    })
    console.log(statsCategory.date)

}

function viewStats(categoryName){
    console.log(categoryName)
    let header={
    "Content-Type": "application/json",
    "start_date":"2019-03-01",
    "category_name":categoryName,
    "limit":10
}
    makeRequest('get','http://localhost:3000/api-staging/site/emailMarketing/stats-category',header)
    .then(response=>{
       let results=response.data;
       statsCategory=[...results];
        console.log(results)
        // showDate.innerHTML=results
       let li=results.map(a=> {
           return `<li class="row" >
           <a href="#"><span class="col-3" onclick="filterMonth('${a.date}')"> ${a.date} </span></a>
           </li><hr>`;
        });
        dropdownList.innerHTML =li.join('')
 
       })

}


function load(){
    // FETCH ALL CATEGORIES
    makeRequest('get','http://localhost:3000/api-staging/site/emailMarketing/categories')
    .then(response=>{
       let results;
        results=response.data
        console.log(results)
       let li=results.map(category=> {
           return `<li class="row" >
           <span class="col-3" onclick="viewStats('${category.category}')"><a href="#"> ${category.category} </a></span>
           </li><hr>`;
        });
        allCategories.innerHTML =li.join('')
 
       })

}

document.addEventListener("DOMContentLoaded",load())