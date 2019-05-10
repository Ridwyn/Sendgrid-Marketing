
let allRecipients= document.getElementById('recipients')
let allList=document.getElementById('contactLists')
let detailRecipient=document.getElementById('detailRecipient')
let recipientEmail=document.getElementById('recipientEmal')
let recipientFName=document.getElementById('recipientFName')
let recipientLName=document.getElementById('recipientLName')
let popup=document.getElementById('popup');
let listName=document.getElementById('listName');
let listsOfRecipients=document.getElementById('listsOfRecipients')
let submitFormBtn=document.getElementById('submitForm')
let editFormBtn=document.getElementById('editForm')
let recipientForm=document.getElementById('recipientEditForm')
let dropdownList=document.getElementById('dropdownList');
let totalContacts=document.getElementById('totalContacts')
let lists=[];
let recipients=[]



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

function deleteRecipient(recipient_id){
    let header={"Content-Type": "application/json",id:""+recipient_id+""}
    // console.log(header)
    makeRequest('delete','https://young-bastion-69451.herokuapp.com/delete-recipient',header)
    .then(response=>{
        console.log(response)
        if(response.status===200){
            popup.innerHTML=`Deleted`
            popup.classList.remove('hide')
            load()
            setTimeout(()=>{popup.classList.add('hide'); },1000)
            setTimeout(()=>{
            load()   
            },2500)
        }
    })
}

function removeContactFromList(listId,recipientId){
    let header={"Content-Type": "application/json"}
    let body=JSON.stringify({recipient_id:""+recipientId+"",list_id:parseInt(listId)})
    makeRequest('delete','https://young-bastion-69451.herokuapp.com/remove-from-list',header,body)
    .then(response=>{
        console.log(response)
        if(response.status===200){
            popup.innerHTML=`Removed Successfully`
            popup.classList.remove('hide')
            setTimeout(()=>{popup.classList.add('hide')},1000)
            var matchedList= lists.filter(function(list) {
                return list.id == listId;
            });
            let prvCnt=matchedList[0]
            console.log(prvCnt)
            setTimeout(()=>{
                load()
                let list=lists
                console.log(list)
                // location.reload(true);                
            },3500)
        }
    })
     console.log(body)
}

function addRecipientToList(listId,recipientId,listName){
    let header={ "Content-Type": "application/json",id:""+listId+""}
    let body=JSON.stringify({id:""+recipientId+""})
    makeRequest('post','https://young-bastion-69451.herokuapp.com/add-to-list',header,body)
    .then(response=>{console.log(response)
        if(response.status===200&&response.data==='CREATED'){
            popup.innerHTML=`Added to <span class="text-dark">${listName}</span>`
            popup.classList.remove('hide')
            setTimeout(()=>{popup.classList.add('hide'); },1000)
            setTimeout(()=>{               
                load()
                // location.reload(true);
            },3500)
            
        }else{
            popup.innerHTML=`<span class="text-danger">NOT ADDED TRY AGAIN<span>`
            popup.classList.remove('hide')
            setTimeout(()=>{popup.classList.add('hide')},1000)
            setTimeout(()=>{
                location.reload(true);
            },2500)
        }        

    })
    console.log(header,[body])

}

function viewRecipient(recipientId){
    let result;
    let header={"Content-Type": "application/json",id:`${recipientId}`}
    document.getElementsByClassName('dropdown')[0].classList.remove('hide')
    editFormBtn.classList.remove('hide')
    makeRequest('get','https://young-bastion-69451.herokuapp.com/recipient',header)
    .then(response=>{result=response.data
        recipientEmail.value=result.email
        recipientFName.value=result.first_name
        recipientLName.value=result.last_name 
        editFormBtn.addEventListener('click',function (e) {
            e.preventDefault();
            submitFormBtn.classList.remove('hide')
           let inputs= recipientForm.getElementsByTagName('input')
            for(let i=0;i<inputs.length;i++){
                if(inputs[i].name!="email"){ inputs[i].disabled=false;}
               
            }
        })   
    })

    // submiting edited form
    submitFormBtn.addEventListener('click',(e)=>{
        e.preventDefault();
        let body=  {
            email: ""+recipientEmail.value+"",
            first_name: ""+recipientFName.value+"",
            last_name: ""+recipientLName.value+"",
        }
        // make request to send updated data to sendgrid
        makeRequest('patch','https://young-bastion-69451.herokuapp.com/update-recipient',header,JSON.stringify(body))
        .then(response=>{result=response
            console.log(response.body)

            if(response.status===201&&response.data==='CREATED'){
                popup.innerHTML="Contact Updated"
                popup.classList.remove('hide')
                setTimeout(()=>{popup.classList.add('hide'); },1000)
                setTimeout(()=>{
                    load()
                },2500)
            }
      
        })
    })

    // ADDING CONTACT TO A LIST
        // Get all list and populate dropdown
        makeRequest('get','https://young-bastion-69451.herokuapp.com/lists')
        .then(response=>{
            let results;
            results=response.data
            let a=results.lists.map(list=>{
                return `<a class="dropdown-item text-info" onclick="addRecipientToList('${list.id}','${recipientId}','${list.name}')" href="#">${list.name}</a>`;
            })
            dropdownList.innerHTML=a.join('')
        })

}

function viewRecipientInList(listId,name){
    let result;
    let header={"Content-Type": "application/json",id:""+listId+""}
    let url='https://young-bastion-69451.herokuapp.com/list-recipients';
    makeRequest('get',url,header)
    .then(response=>{result=response.data
        if(response.status===200){
            listName.innerHTML=name;
            let li=result.recipients.map(recipient => {
             return `<li><span onclick="viewRecipient('${recipient.id}')"><a href="#"> ${recipient.email}</a> </span> <span onclick="removeContactFromList('${listId}','${recipient.id}')" class="text-danger float-right"><i class="fas fa-minus-circle text-danger "></i></span></li><hr>`;
            });
            listsOfRecipients.innerHTML=li.join('');
            // no recipients added yet
            if(!result.recipients.length>0){           
                listsOfRecipients.innerHTML=`<h4 class="text-info">No Contacts added yet</h4>`
            }
        }
  
    })
}

function load(){
    // FETCH ALL RECIPIENTS
 makeRequest('get','https://young-bastion-69451.herokuapp.com/recipients')
 .then(response=>{
    let results;
     results=response.data
     console.log(results)
    let li=results.recipients.map(recipient=> {
        return `<li ><span onclick="viewRecipient('${recipient.id}')"><a href="#"> ${recipient.email} </a></span><span>${recipient.first_name}&nbsp;&nbsp;${recipient.last_name}</span><span onclick="deleteRecipient('${recipient.id}')" class="text-danger float-right"><i class="fas fa-trash"></i></span></li><hr>`;
     });
    allRecipients.innerHTML =`<ul  id="recipientsUl"> ${li.join('')} </ul>`;
     totalContacts.innerHTML="-"+results.recipient_count+""
     results.recipients.forEach(recipient => {
        recipients.push({"id":recipient.id,"name":recipient.email})
        // console.log(recipients)
    });
    })
     // FETCH ALL CONTACT LIST
    makeRequest('get','https://young-bastion-69451.herokuapp.com/lists')
    .then(response=>{
            let results;
            results=response.data
            console.log(results)
            let li=results.lists.map(list=> {
                return `<li class="row"><div onclick="viewRecipientInList('${list.id}','${list.name}')" class="col-6"><a href="#">${list.name}</a></div> <div class="col-4">${list.recipient_count}</div></li><hr>`;
            });
            allList.innerHTML =`<ul  id="recipientsUl"> ${li.join('')} </ul>`;
            results.lists.forEach(list => {
                lists.push({"id":list.id,"name":list.name,"recipient_count":list.recipient_count})
                // console.log(lists)
            });
    })




}

document.addEventListener("DOMContentLoaded",load())