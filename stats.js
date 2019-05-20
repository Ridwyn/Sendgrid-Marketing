let allCategories=document.getElementById('allCategories')
let showStats=document.getElementById('showStats')
let showDate=document.getElementById('showDate')
let dropdownList=document.getElementById('dropdownList')
let dropdown=document.getElementById('dropdown')
let categoryName=document.getElementById('categoryName')

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
  async function filter(){ for (let i = 0; i < statsCategory.length; i++) {
        const element = statsCategory[i];
        if(element.stat.date==`${date}`){
           return await element.stat
        }     
    }
    }

    filter().then((result)=>{
        console.log(result)
        showStats.innerHTML=`
        <div><h4>Month Selected&nbsp&nbsp${result.date}</h4></div>
         <li class="row" >
            <span class="col-12">Blocks &nbsp&nbsp ${result.stats[0].metrics.blocks} </span><hr>
            <span class="col-12">Bounces &nbsp&nbsp ${result.stats[0].metrics.bounces} </span><hr>
            <span class="col-12">Clicks &nbsp&nbsp ${result.stats[0].metrics.clicks} </span><hr>
            <span class="col-12">Unsubscribes &nbsp&nbsp ${result.stats[0].metrics.unsubscribes} </span><hr>
            <span class="col-12">Delivered &nbsp&nbsp ${result.stats[0].metrics.delivered} </span><hr>
            <span class="col-12">Opens &nbsp&nbsp ${result.stats[0].metrics.opens} </span><hr>
            </li>
         `
    })
}


function viewStats(categoryName,date){
    console.log(categoryName)
    let header={
    "Content-Type": "application/json",
    "start_date":`${date}`,
    "category_name":categoryName,
    "limit":10
}
    makeRequest('get','https://young-bastion-69451.herokuapp.com/stats-category',header)
    .then(response=>{
       let results=response.data;
    //    statsCategory=[...results];
       results.forEach(result=>{
           statsCategory.push({stat:{date:result.date,stats:result.stats}})
       })
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

allCategories.addEventListener('click',(e)=>{
    if(e.target.id=="setDateBtn"){
        e.preventDefault()
         let dateform =e.target.parentNode
         let date=dateform.getElementsByTagName('input')[0]
         if(date.value!=''){
         console.log(date.value,dateform.id)
        //  show name searched for
         categoryName.innerHTML+=`&nbspfor ${dateform.id} `
        // Show dropdown
         dropdown.classList.remove('hide')
         viewStats(dateform.id,date.value)
         }else{
             alert("select a date")
         }
    }
})

function load(){
    // FETCH ALL CATEGORIES
    makeRequest('get','https://young-bastion-69451.herokuapp.com/categories')
    .then(response=>{
       let results;
        results=response.data
        console.log(results)
       let li=results.map(category=> {
           return `<li class="row" >
           <span class="col-6"><a href="#"> ${category.category} </a></span>
            <span class="col-6"><form id="${category.category}" ><input type="date" name="time" required> <button id="setDateBtn" type="submit">Stats From</button></form></span>
           </li><hr>`;
        });
        allCategories.innerHTML =li.join('')
 
       })

}

document.addEventListener("DOMContentLoaded",load())