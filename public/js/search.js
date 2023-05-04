const searchInput = document.querySelector('.search-input');

document.querySelectorAll('.recipes-box').forEach(menu=>{
    searchInput.addEventListener('input',()=>{
        if(menu.id.substring(5).includes(searchInput.value.toLowerCase())){
            menu.classList.remove('none');
        }else{
            menu.classList.add('none');
        }
        console.log(searchInput.value);
        if(searchInput.value==''){
            menu.classList.remove('none');
        }
    })
});
