let data = {
    users: [
        /*{
            id: 1,
            name: "پیمان احمدی",
            username: "peyman",
            email: "peyman@gmail.com",
            password: "peyman1212",
        },
        {
            id: 2,
            name: "arash",
            username: "peyman",
            email: "arash@gmail.com",
            password: "peyman1212",
        },*/
    ],

    products: [
        /*{
            id: 1,
            title: "کفش ورزشی",
            price: 2000000,
            slug: "nike-sport-shoe",
        },
        {
            id: 2,
            title: "کفش ورزشی2",
            price: 22000000,
            slug: "nike2-sport-shoe",
        },*/
    ],
};
function setThemeLocalStorage(theme){
    localStorage.setItem('theme', theme)
}
function setLight(btn){
    document.documentElement.className = 'light'
    btn.innerHTML = '<i class="fas fa-sun"></i>'
}
function setDark(btn){
    document.documentElement.className = 'dark'
    btn.innerHTML = '<i class="fas fa-moon"></i>'
}

function addUsersToData(users){
    users.forEach(user => {
        data.users.push(user)
    })
}
function addProductsToData(products){
    products.forEach(product => {
        data.products.push(product)
    })
}
function isExistNewProductInData(title, price,slug){
    price = Number(price)
    return data.products.some(product => {
        return (product.title === title) && (product.price === price) && (product.slug === slug)
    })
}
function isExistEditProductInData(id, title, price,slug){
    price = Number(price)
    let flag = false
    flag =  data.products.some(product => {
        if (product.id !== id){
            return (product.title === title) && (product.price === price) && (product.slug === slug)
        }
    })
    return flag
}
function isValidProductRowForEdit(id,title, price,slug){
    let flag = false
    if(isExistValue(title,'عنوان') && isExistValue(price,'قیمت') && isExistValue(slug, 'نام کوتاه')){
        if (isNaN(price)){
            showMessage('قیمت باید به عدد باشد','error')
        }else if (isExistEditProductInData(id,title, price , slug)){
            showMessage('این محصول قبلا وارد شده','error')
        }else {
            flag = true
        }
    }
    return flag
}
function showMessage(msg,icon){
    const themeClass = document.documentElement.className === 'dark' ? 'swal2-dark' : 'swal2-light';
    Swal.fire({
        title: msg,
        icon: icon,
        customClass: {
            popup: themeClass
        }
    });
}


function isExistValue(value,title){
    let flag = false
    if (!value){
        showMessage(`فیلد ${title} محصول خالی است`,'error')
    }else {
        flag = true
    }
    return flag
}
function isValidProductRow(title, price,slug){
    let flag = false
    if(isExistValue(title,'عنوان') && isExistValue(price,'قیمت') && isExistValue(slug, 'نام کوتاه')){
        if (isNaN(price)){
            showMessage('قیمت باید به عدد باشد','error')
        }else {
            if (isExistNewProductInData(title, price , slug)){
                showMessage('این محصول قبلا وارد شده','error')
            }else {
                flag = true
            }
        }
    }
    return flag
}

function setLabels(count,elements){
    elements.forEach(elem => {
        elem.textContent = count.toLocaleString()
    })
    /*if (count === 0){
        captionText.innerHTML = `هنوز ${title} در سایت شما وجود ندارد`
    }*/
}
function createNewProductTableRow(id,title,price,slug){
    const newDiv = document.createElement('div')
    newDiv.className = 'tableRow'
    newDiv.innerHTML = `
        <p class="product-title">${title}</p>
        <p class="product-price">${price}</p>
        <p class="product-shortName">${slug}</p>
        <div class="product-manage">
          <button data-id="${id.toLocaleString()}" class="edit-btn">
            <!-- Edit icon -->
            <i class="fas fa-edit"></i>
          </button>
          <button data-id="${id.toLocaleString()}" class="remove-btn">
            <!-- Delete fas icon -->
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
    `
    return newDiv
}
function addProductsToDom(products,start,countProductsShow){
    let end = start + countProductsShow
    const fragmentElem = document.createDocumentFragment()
    let id,title,price,slug
    for (let i = start; i < end; i++) {
        if (products[i]){
            id =products[i].id
            title = products[i].title
            price = products[i].price
            slug = products[i].slug
            fragmentElem.appendChild(createNewProductTableRow(id,title,price,slug))
        }

    }
    return fragmentElem
}
function createPaginationButtons(len, countShow){
    const fragmentElem = document.createDocumentFragment()
    let newSpan = null
    let countBtn = Math.ceil(len / countShow)
    if (countBtn > 1){
        for (let i = 1; i <= countBtn ; i++) {
            newSpan = document.createElement('span')
            newSpan.className = 'page'
            newSpan.setAttribute('tabindex', '1')
            newSpan.textContent = i.toLocaleString()
            fragmentElem.appendChild(newSpan)
        }
    }
    return fragmentElem
}
function setActivePaginationButton(parentElem,targetBtn){
    let allBtn = parentElem.querySelectorAll('.page')
    allBtn.forEach(btn => {
        btn.classList.remove('active')
    })
    targetBtn.classList.add('active')
}
function showToast(title,status){
    toast.classList.remove('hidden')
    toast.classList.add(status)
    toast.querySelector('.toast-content').textContent = title
    const process = toast.querySelector('.process')
    process.style.transition = 'width 3s linear'
    process.style.width = '100%'

}
function addNewBtnPagination(pagination, number){
    if (number > 1){
        pagination.insertAdjacentHTML('beforeend', `
            <span tabindex="1" class="page">${number}</span>
        `)
    }
}
function setProductsLocalstorage(){
    localStorage.setItem('localProducts', JSON.stringify(data.products))
}
function setUsersLocalstorage(){
    localStorage.setItem('localUsers', JSON.stringify(data.users))
}
function setDataLocalStorage(){
    const localData = {
        users: data.users || [],
        products: data.products || []
    };
    localStorage.setItem('localData', JSON.stringify(localData))
}
function findIndexItem(arr, id){
    return arr.findIndex(row => {
        return row.id === id
    })
}
function removeItemFromData(arr,id){
    let index = findIndexItem(arr,id)
    arr.splice(index , 1)
    /*setDataLocalStorage()*/
}
function showModalScreenDelete(modalScreen,arr,parentElem,id,pagination='',countShow,wrapper){
    const modal = modalScreen.querySelector('.modal')
    modal.innerHTML = `
        <i class="ui-border top red"></i>
          <i class="ui-border bottom red"></i>
          <header class="modal-header">
            <h3>حذف محصول</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <p class="remove-text">آیا از حذف این محصول اطمینان دارید؟</p>
          </main>
          <footer class="modal-footer">
            <button class="cancel">انصراف</button>
            <button class="submit">تائید</button>
          </footer>
    `
    modalScreen.classList.remove('hidden')
    const submit = modal.querySelector('.submit')
    const process = toast.querySelector('.process')
    submit.addEventListener('click', ()=> {
        hideModalScreen()
        showToast(`محصول با موفقیت حذف شد`,'success')
        process.addEventListener('transitionend', function (){
            toast.classList.add('hidden')
            process.style.width = '0'
            removeItemFromData(arr,id)
            setProductsLocalstorage()
            setLabels(data.products.length,productsData)
            let start = resetPagination(pagination,arr,countShow,wrapper)
            tableBodySection.appendChild(addProductsToDom(arr, start, countShow))

        },{once: true})

    })

}
function resetPagination(pagination,arr,countShow,wrapper){
    let start = 0
    if (pagination){
        pagination.innerHTML = ''
        pagination.appendChild(createPaginationButtons(arr.length,countShow))
        if (pagination.innerHTML !== ''){
            const allButtonsPagination = pagination.querySelectorAll('.page')
            let targetBtn = allButtonsPagination[allButtonsPagination.length - 1]
            if (targetBtn){
                setActivePaginationButton(pagination,targetBtn)
            }
            start = (allButtonsPagination.length - 1) * countShow
        }

    }
    wrapper.innerHTML = ''
    return start
}
function setId(arr){
    // پیدا کردن بیشترین آیدی فعلی
    const currentIds = arr.map(item => item.id);
    const maxId = currentIds.length > 0 ? Math.max(...currentIds) : 0;
    return maxId + 1
}
function showModalScreenEdit(modalScreen,wrapper,id){
    const modal = modalScreen.querySelector('.modal')
    modal.innerHTML = `
        <header class="modal-header">
            <h3>ویرایش محصول</h3>
            <button class="close-modal">
              <i class="fas fa-times"></i>
            </button>
          </header>
          <main class="modal-content">
            <input
              type="text"
              class="modal-input"
              placeholder="عنوان محصول را وارد نمائید ..."
              id="product-title"
            />
            <input
              type="text"
              class="modal-input"
              placeholder="قیمت محصول را وارد نمائید ..."
              id="product-price"
            />
            <input
              type="text"
              class="modal-input"
              placeholder="عنوان کوتاه محصول را وارد نمائید ..."
              id="product-shortName"
            />
          </main>
          <footer class="modal-footer">
            <button class="cancel">انصراف</button>
            <button class="submit">تائید</button>
          </footer>
    `
    modalScreen.classList.remove('hidden')
    const submit = modal.querySelector('.submit')
    submit.addEventListener('click', ()=> {
        const productTitle = modal.querySelector('#product-title')
        const productPrice = modal.querySelector('#product-price')
        const productSlug = modal.querySelector('#product-shortName')
        const newProductTitle = productTitle.value.trim()
        const newProductPrice = productPrice.value.trim()
        const newProductSlug = productSlug.value.trim()
        editProduct(id,newProductTitle,newProductPrice,newProductSlug,wrapper)
    })

}
function editProduct(id, title, price, slug,wrapper){
    if (isValidProductRowForEdit(id, title,price,slug)){
        hideModalScreen()
        showToast('محصول با موفقیت ویرایش شد', 'success')
        const process = toast.querySelector('.process')
        process.addEventListener('transitionend', function () {
            toast.classList.add('hidden')
            process.style.width = '0'
            process.style.width = '0'
            let index = findIndexItem(data.products, id)
            data.products[index].title = title
            data.products[index].price = +price
            data.products[index].slug = slug
            wrapper.querySelector('.product-title').textContent = title
            wrapper.querySelector('.product-price').textContent = price
            wrapper.querySelector('.product-shortName').textContent = slug
            /*setDataLocalStorage()*/
            setProductsLocalstorage()
        },{once: true})
    }
}
export {
    data,
    addProductsToDom,
    addUsersToData,
    addProductsToData,
    createPaginationButtons,
    setActivePaginationButton,
    createNewProductTableRow,
    isValidProductRow,
    showToast,
    addNewBtnPagination,
    setDataLocalStorage,
    showModalScreenDelete,
    resetPagination,
    showModalScreenEdit,
    setId,
    setLabels,
    isExistValue,
    showMessage,
    setProductsLocalstorage,
    setUsersLocalstorage,
    removeItemFromData,
    findIndexItem,
}
