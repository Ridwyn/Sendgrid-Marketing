
let allRecipients= document.getElementById('recipients')
let allList=document.getElementById('contactLists')
let detailRecipient=document.getElementById('detailRecipient')
let recipientEmail=document.getElementById('recipientEmal')
let recipientFName=document.getElementById('recipientFName')
let recipientLName=document.getElementById('recipientLName')
let popup=document.getElementById('popup');

let submitFormBtn=document.getElementById('submitForm')
let editFormBtn=document.getElementById('editForm')




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

function viewRecipient(e){
    let result;
    editFormBtn.classList.remove('hide')
    makeRequest('get','https://young-bastion-69451.herokuapp.com/recipient',{id:""+e+""})
    .then(response=>{result=JSON.parse(response.data)
        recipientEmail.value=result.email
        recipientFName.value=result.first_name
        recipientLName.value=result.last_name 
        editFormBtn.addEventListener('click',function () {
            submitFormBtn.classList.remove('hide')
        })   
    })

    // submiting edited form
    submitFormBtn.addEventListener('click',()=>{
        let body=  {
            email: ""+recipientEmail.value+"",
            first_name: ""+recipientFName.value+"",
            last_name: ""+recipientLName.value+"",
        }
        console.log(JSON.stringify(body))
        makeRequest('put','https://young-bastion-69451.herokuapp.com/update-recipient',{"Content-Type": "application/json",id:""+e+""},JSON.stringify(body))
        .then(response=>{result=response
            if(response.status===200&&response.data==='CREATED'){
                popup.innerHTML="Update"
                popup.classList.remove('hide')
                setTimeout(()=>{popup.classList.add('hide')},1000)
                setTimeout(()=>{location.reload();},1500)
            }
      
        })
    })

}

function load(){

    // FETCH ALL RECIPIENTS
 makeRequest('get','https://young-bastion-69451.herokuapp.com/recipients')
 .then(response=>{
    let results;
     results=(JSON.parse(response.data))
     console.log(results)
    let li=results.recipients.map(recipient=> {
        return `<li onclick="viewRecipient('${recipient.id}')"><a href="#"> ${recipient.email}  <span>${recipient.first_name}</span><span>${recipient.last_name}</span></a></li>`;
     });
    allRecipients.innerHTML =`<ul  id="recipientsUl"> ${li.join('')} </ul>`;
  
    })

    // FETCH ALL CONTACT LIST
makeRequest('get','https://young-bastion-69451.herokuapp.com/lists')
.then(response=>{
        let results;
         results=(JSON.parse(response.data))
         console.log(results)
        let li=results.lists.map(lists=> {
            return `<a href="#"><li onclick="viewRecipient('${lists.id}')" class="row"><div class="col-6">${lists.name}</div> <div class="col-4">${lists.recipient_count}</div></li></a>`;
         });
        allList.innerHTML =`<ul  id="recipientsUl"> ${li.join('')} </ul>`;
      
})

}


document.addEventListener("DOMContentLoaded",load())