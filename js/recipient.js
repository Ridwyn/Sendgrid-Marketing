let newRecipientForm=document.getElementById('newRecipientForm')
let allLists=document.getElementById('allLists')
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

// submiting form
newRecipientForm.addEventListener('submit', function(e){
    e.preventDefault();
    let s_form = formSerialize(newRecipientForm);
    let data =JSON.stringify(s_form)

    makeRequest('post','https://young-bastion-69451.herokuapp.com/create-recipient',{"Content-Type": "application/json"},data)
    .then(response=>{
        let result=response.data
        let header={ "Content-Type": "application/json",id:""+s_form.list_id+""}
        let body=JSON.stringify({id:""+result.persisted_recipients[0]+""})
        console.log(header,body)
      makeRequest('post','https://young-bastion-69451.herokuapp.com/add-to-list',header,body)
      .then(response=>{console.log(response)
        if(response.status===200&&response.data==="CREATED"){
            popup.innerHTML=`${s_form.email} created`
            popup.classList.remove('hide')
            setTimeout(()=>{popup.classList.add('hide'); },1000)
        }
        })
    })
})

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



function load(){
    // Fetch alL created lists
    makeRequest('get','https://young-bastion-69451.herokuapp.com/lists')
    .then(response=>{
            let results;
            results=(JSON.parse(response.data))
            console.log(results)
            let options=results.lists.map(list=> {
                return `<option value="${list.id}">${list.name}</option>`
                
            });
            allLists.innerHTML =options.join('')
        })
    // FETCH ALL RECIPIENTS
    makeRequest('get','https://young-bastion-69451.herokuapp.com/recipients')
    .then(response=>{
       let results;
        results=(JSON.parse(response.data))
        console.log(results)
       let li=results.recipients.map(recipient=> {
           return `<li ><span onclick="viewRecipient('${recipient.id}')"><a href="#"> ${recipient.email} </a></span><span>${recipient.first_name}&nbsp;&nbsp;${recipient.last_name}</span><span onclick="deleteRecipient('${recipient.id}')" class="text-danger float-right"><i class="fas fa-trash"></i></span></li><hr>`;
        });
       allRecipients.innerHTML =`<ul  id="recipientsUl"> ${li.join('')} </ul>`;
        totalContacts.innerHTML="-"+results.recipient_count+""   
       })
   

}


document.addEventListener("DOMContentLoaded",load())