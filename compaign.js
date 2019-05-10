let allCompaigns=document.getElementById('allCompaigns')
let totalCompaigns=document.getElementById('totalCompaigns')
let newCompaignForm=document.getElementById('newCompaignForm')

let compaignTitle=document.getElementById('compaignTitle')
let compaignSubject=document.getElementById('compaignSubject')
let compaignCategories=document.getElementById('compaignCategories')
let compaignMessage=document.getElementById('compaignMessage')
let compaignList=document.getElementById('compaignList')

let lists=[]

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
// serializer
function formSerialize(formElement) {
    const values = {};
    const inputs = formElement.elements;

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type!="submit"){ 
            values[inputs[i].name] = inputs[i].value;
        }
    
    }
    return values;
    
}

// submitting form
newCompaignForm.addEventListener('submit', function(e){
    e.preventDefault();
    // let s_form = $(newCompaignForm).serializeArray();
    let s_form= formSerialize(newCompaignForm)
    let data =JSON.stringify(s_form)

    console.log(data)
    makeRequest('post','https://young-bastion-69451.herokuapp.com/create-compaign',{"Content-Type": "application/json"},data)
    .then(response=>{
        console.log(response)
        setTimeout(()=>{load()},2000)
    })
})

function deleteCompaign(compaign_id){
    console.log(compaign_id)
    let header={"Content-Type": "application/json",compaign_id:compaign_id}
    console.log(header)
    makeRequest('delete','https://young-bastion-69451.herokuapp.com/delete-compaign',header)
    .then(response=>{
        console.log(response)
        if(response.status===200 && response.data===""){
            popup.innerHTML=`Deleted`
            popup.classList.remove('hide') 
            popup.classList.remove('hide')
            setTimeout(()=>{popup.classList.add('hide'); },1000)
            setTimeout(()=>{load()},4000) 
        }else{
            console.log(response.errors)
        }
    })
}


function sendCompaign(compaign_id){
    let header={"Content-Type": "application/json",compaign_id:compaign_id}
    makeRequest('post','https://young-bastion-69451.herokuapp.com/send-compaign',header)
    .then(response=>{
        console.log(response)
        popup.innerHTML=`Compaign Scheduled to be sent`
        popup.classList.remove('hide')
        setTimeout(()=>{popup.classList.add('hide'); },1000)
        setTimeout(()=>{load()},4000)
    })
}

function viewCompaign(compaign_id){
    let result;
    let header={"Content-Type": "application/json",compaign_id:compaign_id}
    console.log(compaign_id)
    makeRequest('get','https://young-bastion-69451.herokuapp.com/compaign',header)
    .then(response=>{
        let result=response.data
        console.log(response)
        var matchedList= lists.filter(function(list) {
            return list.id == result.list_ids[0];
        });
        console.log(matchedList)
        compaignTitle.value=result.title
        compaignSubject.value=result.subject
        compaignCategories.value=result.categories[0]
        compaignMessage.value=result.plain_content
       compaignList.innerHTML= `<strong><span>${matchedList[0].name}<span>&nbsp&nbsp-<span>with&nbsp${matchedList[0].recipient_count}&nbsp Recipients<span></strong>`
      
    })
}


function load(){
    // Fetch alL created lists
    makeRequest('get','https://young-bastion-69451.herokuapp.com/lists')
    .then(response=>{
            let results;
            results=response.data
            console.log(results)
            let options=results.lists.map(list=> {
                return `<option value="${list.id}">${list.name}</option>`

            });
            results.lists.forEach(list => {
                lists.push({"id":list.id,"name":list.name,"recipient_count":list.recipient_count})
            });
            allLists.innerHTML =options.join('')
        })
    // FETCH ALL RECIPIENTS
    makeRequest('get','https://young-bastion-69451.herokuapp.com/compaigns')
    .then(response=>{
       let results;
        results=response.data.result
        console.log(results)
       let li=results.map(compaign=> {
           return `<li class="row" >
           <span class="col-3" onclick="viewCompaign('${compaign.id}')"><a href="#"> ${compaign.title} </a></span>
           <span class="col-3">${compaign.subject}</span>&nbsp&nbsp
           <span class="text-info col-2">${compaign.status}</span>
           <span class="btn btn-primary col-3" onclick="sendCompaign('${compaign.id}')"> Send Compaign </span>
           <span onclick="deleteCompaign('${compaign.id}')" class="text-danger float-right col-2"><i class="fas fa-trash"></i></span></li><hr>`;
        });
        allCompaigns.innerHTML =li.join('')
        totalCompaigns.innerHTML="-"+results.length+""   
       })
   

}


document.addEventListener("DOMContentLoaded",load())