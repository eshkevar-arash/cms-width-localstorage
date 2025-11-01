import {
    data,addProductsToData, addProductsToDom, createPaginationButtons
    ,setActivePaginationButton,createNewProductTableRow,isValidProductRow,showToast,
    setLabels,setDataLocalStorage,showModalScreenDelete,resetPagination,showModalScreenEdit,setId,
    setProductsLocalstorage

} from "./Func.js";


const createProduct = document.querySelector('#create-product')
let start
let countProductsShow = 6
let targetBtn = null
let countProducts
let targetId = null
function showModalScreenCreate(){
    modal.innerHTML =`
        <header class="modal-header">
            <h3>ایجاد محصول</h3>
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
              inputmode="decimal"
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
        const process = toast.querySelector('.process')
        const newProductTitle = productTitle.value.trim()
        const newProductPrice = productPrice.value.trim()
        const newProductSlug = productSlug.value.trim()
        const newProductId = setId(data.products);
        if (isValidProductRow(newProductTitle,newProductPrice,newProductSlug)){
            hideModalScreen()
            showToast('محصول با موفقیت ایجاد شد','success')

            process.addEventListener('transitionend', function (){
                toast.classList.add('hidden')
                process.style.width = '0'
                process.style.width = '0'
                tableBodySection.appendChild(createNewProductTableRow(newProductId,newProductTitle,newProductPrice,newProductSlug))
                addNewProductToData(newProductId,newProductTitle,+newProductPrice,newProductSlug)
                start = resetPagination(pagination,data.products,countProductsShow,tableBodySection)
                tableBodySection.appendChild(addProductsToDom(data.products, start, countProductsShow))
                setProductsLocalstorage()
                console.log(data.products)
                setLabels(data.products.length,productsData)
            },{once: true})

        }

    })

}
function addNewProductToData(id,title,price,slug){
    price = Number(price)
    const newProduct = {
        id,
        title,
        price,
        slug
    }
    data.products.push(newProduct)
}

pagination.addEventListener('click', event => {
    targetBtn = event.target.closest('.page')
    if (targetBtn){
        setActivePaginationButton(pagination,targetBtn)
        start = (+targetBtn.textContent - 1) * countProductsShow
        tableBodySection.innerHTML = ''
        tableBodySection.appendChild(addProductsToDom(data.products, start, countProductsShow))
    }
})
createProduct.addEventListener('click', ()=> {
    showModalScreenCreate()
})
tableBodySection.addEventListener('click', event => {
    let targetRemoveBtn = event.target.closest('.remove-btn')
    let targetEditBtn = event.target.closest('.edit-btn')
    if (targetRemoveBtn){
        targetId = +targetRemoveBtn.dataset.id
        console.log(targetId)
        let parentTargetRemoveBtn = targetRemoveBtn.closest('.tableRow')
        showModalScreenDelete(modalScreen, data.products,parentTargetRemoveBtn,targetId,pagination,countProductsShow,tableBodySection)
    }else if (targetEditBtn){
        targetId = +targetEditBtn.dataset.id
        let parentTargetEditBtn = targetEditBtn.closest('.tableRow')
        showModalScreenEdit(modalScreen,parentTargetEditBtn,targetId)

    }
})

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
    /*================Theme End====================*/
    start = 0
    countProductsShow = 6
    const savedProducts = JSON.parse(localStorage.getItem('localProducts')) || []
    tableBodySection.innerHTML = ''
    if (savedProducts.length > 0){
        /*================Products====================*/
        addProductsToData(savedProducts)

        tableBodySection.appendChild(addProductsToDom(data.products, start, countProductsShow))
        countProducts = savedProducts.length
        /*================Pagination====================*/
        pagination.appendChild(createPaginationButtons(data.products.length,countProductsShow))
        /*pagination.appendChild(createPaginationButtons(20,countProductsShow))*/
        targetBtn = pagination.querySelectorAll('.page')[0]
        if (targetBtn){
            setActivePaginationButton(pagination,targetBtn)
        }

    }else {
        countProducts = 0
    }
    setLabels(countProducts,productsData,captionText,'محصولی')
}

