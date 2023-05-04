// open , close popup
const menuName = document.querySelector('.menu_name');
const menuPrice = document.querySelector('.menu_price');
const menuImage = document.querySelector('.menu_image');
const menuTag = document.querySelector('.menu_tag');
const menuID = document.querySelector('.menu_id');

// edit form
document.querySelectorAll('.edit').forEach(element=>{
    element.addEventListener('click',async (e)=>{
        document.querySelector('.popup-container').classList.remove('edit-container-noneActive');
        fetch('/api/menus',{method:'post'}).then(res=>{
            return res.json()
        }).then(result=>{
            let data = result.find(obj=>{
                return obj.id == e.target.id;
            })
            menuName.value = data.menu
            menuPrice.value = data.price
            menuImage.value = data.image
            menuTag.value = data.tag
            menuID.value = e.target.id

            document.querySelector('.pv-name').textContent = menuName.value;
            document.querySelector('.pv-image').src = menuImage.value;
            if(menuTag.value){
                document.querySelector('.pv-price').textContent = `${menuPrice.value}฿ `
                var spanTag = document.createElement('span');
                spanTag.textContent = menuTag.value;
                spanTag.classList.add('pv-tag');
                document.querySelector('.pv-price').appendChild(spanTag);
            }
            else document.querySelector('.pv-price').textContent = `${menuPrice.value}฿`;
        })
    });
})
// preview form update
document.querySelectorAll('.dataInput').forEach(input_ => {
    input_.addEventListener('input', () => {
        // name
        if(menuName.value) document.querySelector('.pv-name').textContent = menuName.value;
        else document.querySelector('.pv-name').textContent = menuName.placeholder ;
        // price & tag
        if(menuPrice.value) document.querySelector('.pv-price').textContent = `${menuPrice.value}฿ `;
        else document.querySelector('.pv-price').textContent = menuPrice.placeholder;
        if(menuTag.value){
            var spanTag = document.createElement('span');
            spanTag.textContent = menuTag.value;
            document.querySelector('.pv-price').appendChild(spanTag)
        }else{
            if (document.querySelector('.pv-tag')) document.querySelector('.pv-tag').remove();
        }
        // image
        if(menuImage.value) document.querySelector('.pv-image').src = menuImage.value;
        else document.querySelector('.pv-image').src = 'https://cdn.dribbble.com/users/1215152/screenshots/12858414/media/2899b4a569a01cdb3614b65e7f250092.gif';
        
    })
})

// close popup
document.querySelector('.close-popup').addEventListener('click',(e)=>{
    document.querySelector('.popup-container').classList.add('edit-container-noneActive');
});

// add data
document.querySelector('.add-data').addEventListener('click',()=>{
    document.querySelector('.popup-container').classList.remove('edit-container-noneActive');
    defaultPV();
    menuID.value = 'add';
})

// remove menu
document.querySelectorAll('.remove').forEach(e=>{
    e.addEventListener('click',(element)=>{
        fetch('/api/remove/menu',
        {
            method:'post',    
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:element.target.id})
        }).then(res=>{return res.json()}).then(result=>{
            if(result.result=='success'){
                window.location.href = '/admin';
            }
        })
    })
})

function defaultPV(){
    menuName.value = '';
    menuPrice.value = '';
    menuImage.value = '';
    menuTag.value = '';
    document.querySelector('.pv-name').textContent = menuName.placeholder ;
    document.querySelector('.pv-price').textContent = menuPrice.placeholder;
    document.querySelector('.pv-image').src = 'https://cdn.dribbble.com/users/1215152/screenshots/12858414/media/2899b4a569a01cdb3614b65e7f250092.gif';
}
