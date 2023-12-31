const $ = (selector) => document.querySelector(selector)
const toggleActive = (node) => {
    node.classList.toggle('active')
}
class toggleBlockScroll {
    static block() {
        const body = $('body')
        body.style.overflow = 'hidden'
    }

    static unblock() {
        const body = $('body')
        body.style.overflow = 'auto'
    }
}

document.addEventListener('DOMContentLoaded', mainFn)

function mainFn(e) {
    document.addEventListener('click', eventDelegation)

    const modalForm = $('.modal-for-communication__block')

    modalForm.onsubmit = submitForm
}

function eventDelegation(e) {
    openBasketModal(e)
    changeValueBasketProduct(e)
    openMobileModalMenu(e)
    redirectTokLocationMap(e)
    openCommunicationModal(e)
}

function changeValueBasketProduct(e) {
    const type = e?.target?.dataset?.type

    let productPrice
    let prodoctCounter
    let resultPrice
    let productItem

    const deleteProductFromBasket = () => {
        productItem = e.target.closest('.basket-modal__card-items')
        productItem.remove()
    }

    const getProductPrice = (e) => {
        const node = e?.target
            .closest('.card-items__result')
            .querySelector('.card-items__result-price').innerText

        return node.replace(' ', '')
    }

    const getProductCount = (e) => {
        const node = e?.target
            .closest('.count-buttons-group')
            .querySelector('[data-product_count]')

        return node
    }

    const incProductCounter = () => {
        let n = +prodoctCounter.innerText

        prodoctCounter.innerText = n + 1
    }

    const decProductCounter = () => {
        let n = +prodoctCounter.innerText

        const newCounter = n - 1

        if (newCounter === 0) {
            deleteProductFromBasket()
            decBasketAmount()
            return
        }

        prodoctCounter.innerText = newCounter
    }

    const incResultPrice = () => {
        const nodeOrderPrice = $('.basket-modal__order-price')
        const oldOrderPrice = nodeOrderPrice.innerText

        resultPrice = +oldOrderPrice + +productPrice

        nodeOrderPrice.innerText = resultPrice
    }

    const decResultPrice = () => {
        const nodeOrderPrice = $('.basket-modal__order-price')
        const oldOrderPrice = +nodeOrderPrice.innerText

        resultPrice = +oldOrderPrice - +productPrice

        if (Math.sign(resultPrice) === -1) {
            nodeOrderPrice.innerText = 0

            return
        }

        nodeOrderPrice.innerText = resultPrice
    }

    const decBasketAmount = () => {
        const basketAmount = $('[data-type="basket-amount"]')
        const currentBasketAmount = +basketAmount.innerText

        basketAmount.innerText = currentBasketAmount - 1

        if (currentBasketAmount === 1) {
            basketAmount.style.display = 'none'
        }
    }

    if (type === 'dec-product' || type === 'inc-product') {
        prodoctCounter = getProductCount(e)
        productPrice = getProductPrice(e)

        switch (type) {
            case 'dec-product':
                decProductCounter()
                decResultPrice()
                break
            case 'inc-product':
                incProductCounter()
                incResultPrice()
                break
            default:
                break
        }
    }
}

function openBasketModal(e) {
    const node = e?.target
    const basketIcon = node?.dataset?.type === 'basket'

    if (basketIcon) {
        const bascketModal = $('.user-profile__basket-modal')
        toggleActive(bascketModal)
        toggleBlockScroll.block()
        return
    }

    //Закрытие окна при нажатии на любую области кроме модального окна
    if (!node.closest('.user-profile__basket-modal')) {
        const bascketModal = $('.user-profile__basket-modal')
        bascketModal.classList.remove('active')
    }
}

function openMobileModalMenu(e) {
    const node = e?.target
    const menuIcon = node?.dataset?.type === 'menu'

    const windowHeight = window.innerHeight
    const heightMobileMenu = $('.mobile-menu').offsetHeight
    const headerHeight = $('.header').offsetHeight

    //Расчет высота модального окна относительно хедера и нижнего мобильного меню
    const modalHeight = windowHeight - (heightMobileMenu + headerHeight)

    if (menuIcon) {
        const mobileModalMenu = $('.mobile-modal')

        toggleActive(mobileModalMenu)

        if (mobileModalMenu.classList.contains('active')) {
            mobileModalMenu.style.height = modalHeight + 'px'

            return
        }

        mobileModalMenu.style.height = '0px'
    }

    //Закрытие окна при нажатии на любую области кроме модального окна
    if (!node.closest('.mobile-modal')) {
        const mobileModalMenu = $('.mobile-modal')
        mobileModalMenu.classList.remove('active')
        mobileModalMenu.style.height = '0px'
    }
}

function openCommunicationModal(e) {
    const node = e?.target
    const icon = node.dataset.type === 'open-communication-modal'
    let modal
    let closeModalBtn

    if (icon) {
        modal = $('.modal-for-communication')
        closeModalBtn = $('.modal-for-communication__close-btn')

        closeModalBtn.onclick = () => {
            modal?.classList.remove('active')
        }

        toggleActive(modal)
        return
    }

    const closestModal = node.closest('.modal-for-communication__block')

    if (!closestModal) {
        modal = $('.modal-for-communication')
        modal?.classList?.remove('active')
    }
}
//Переадресует на карты при нажатии на иконку
function redirectTokLocationMap(e) {
    const node = e?.target
    if (node.classList.contains('location_icon')) {
        window.location.href = 'https://yandex.ru/maps/-/CDQYeIpk'
    }
}

function submitForm(e) {
    e.preventDefault()
    try {
        const data = new FormData(this)

        const name = data.get('name')
        const phone = data.get('phone')
        const acceptSendPersonalData = data.get('acceptSendPersonalData')

        if (!acceptSendPersonalData) {
            alert('Согласитесь на обработку персональных данных')
            return
        }

        alert('Успешно отправлено')
        $('.modal-for-communication').classList.remove('active')
        console.log({ name, phone })
    } catch (err) {
        alert('Ошибка отправки')
    }
}
