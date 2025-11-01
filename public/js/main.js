import {
    data,
    addProductsToData,
    addProductsToDom, showModalScreenDelete, showModalScreenEdit,
    setProductsLocalstorage,setUsersLocalstorage
} from "./Func.js";
const latestUsersSection=document.querySelector('.latest-users')
let countProductsShow = 6
const productsData = document.querySelectorAll('.products-data')
const usersData = document.querySelector('.users-data')

let targetId = null

function createNewArticleUser(user){
    latestUsersSection.insertAdjacentHTML('beforeend', `
        <article data-id="${user.id}">
          <!-- user icon -->
          <span class="icon-card">
            <i class="fa-solid fa-user"></i>
          </span>
          <!-- user data -->
          <div>
            <p class="user-name">${user.name}</p>
            <p class="user-email">${user.email}</p>
          </div>
        </article>
    `)
}


window.onload = function (){
    /*================Theme====================*/
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme !== null){
      if (savedTheme === 'light'){
        setLight(themeButton)
      }else {
        setDark(themeButton)
      }
    }
    let countProducts,countUsers
    latestUsersSection.innerHTML = ''
    /*================Users====================*/
    const savedUsers = JSON.parse(localStorage.getItem('localUsers')) || []
    if (savedUsers.length > 0 ) {
        const reverseSavedUsers = savedUsers.reverse()
        const latestReverseSavedUsers = reverseSavedUsers.slice(0, 4)
        console.log(latestReverseSavedUsers)
        latestReverseSavedUsers.forEach(user => {
            createNewArticleUser(user)
        })
        countUsers = savedUsers.length
    }else{
        countUsers = 0
    }
    /*================Products====================*/
    const savedProducts = JSON.parse(localStorage.getItem('localProducts')) || []
    tableBodySection.innerHTML = ''
    if (savedProducts.length > 0){
        addProductsToData(savedProducts)
        const reverseSavedProducts = data.products.reverse()

        tableBodySection.appendChild(addProductsToDom(reverseSavedProducts, 0, 6))
        countProducts = savedProducts.length
    }else {
        countProducts = 0
    }

    productsData.forEach(tag => {
        tag.textContent = countProducts.toLocaleString()
    })
    usersData.textContent = countUsers.toLocaleString()

}
tableBodySection.addEventListener('click', event => {
    let targetRemoveBtn = event.target.closest('.remove-btn')
    let targetEditBtn = event.target.closest('.edit-btn')
    if (targetRemoveBtn){
        targetId = +targetRemoveBtn.dataset.id
        let parentTargetRemoveBtn = targetRemoveBtn.closest('.tableRow')
        showModalScreenDelete(modalScreen, data.products,parentTargetRemoveBtn,targetId,pagination,countProductsShow,tableBodySection)
    }else if (targetEditBtn){
        targetId = +targetEditBtn.dataset.id
        let parentTargetEditBtn = targetEditBtn.closest('.tableRow')
        showModalScreenEdit(modalScreen,parentTargetEditBtn,targetId)
        /*showModalScreenEdit(modalScreen, data.products,parentTargetEditBtn,targetId,pagination,countProductsShow,tableBodySection,'ویرایش')*/
    }
})

