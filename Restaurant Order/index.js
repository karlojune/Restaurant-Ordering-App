import menuArray from "./data.js"

document.addEventListener("click", function (e) {
	if (e.target.dataset.incrementBtn) {
		handleOrderIncrementClick(e.target.dataset.incrementBtn)
	} else if (e.target.dataset.decrementBtn) {
		handleOrderDecrementClick(e.target.dataset.decrementBtn)
	} else if (e.target.dataset.removeOrderBtn) {
		handleRemoveOrderClick(e.target.dataset.removeOrderBtn)
	} else if (e.target.id === "complete-order-btn") {
		handleCompleteOrderClick()
	} else if (e.target.id === "pay-btn") {
		handleConfirmationClick()
	}
})

function handleOrderIncrementClick(id) {
	const targetMenuItem = menuArray.filter((menuItem) => menuItem.id == id)[0]
	targetMenuItem.quantity++
	getOrderContainerHtml()
	getOrderHtml()
	getTotalPriceHtml()
	render()
}

function handleOrderDecrementClick(id) {
	const targetMenuItem = menuArray.filter((menuItem) => menuItem.id == id)[0]

	if (targetMenuItem.quantity) {
		targetMenuItem.quantity--
	} else {
		document.getElementById(`decrement-btn-${id}`).style.disabled = true
	}
	getOrderHtml()
	getTotalPriceHtml()
	render()
}

function handleRemoveOrderClick(id) {
	const filteredOrder = menuArray.filter((order) => order.id == id)

	filteredOrder.forEach((order) => (order.quantity = 0))
	getTotalPriceHtml()
	render()
}

function getTotalPrice() {
	let price = 0
	menuArray.forEach((menu) => {
		price += menu.price * menu.quantity
	})

	return price
}

function getTotalPriceHtml() {
	let price = getTotalPrice()
	let html = `
	    <p class="menu-name">Total price:</p>
		<p class="menu-price">$${price}</p>
	`

	document.getElementById("total-price-container").innerHTML = html
	render()
}

function getOrderContainerHtml() {
	let html = `
            <h3>Your Order</h3>
            <ul class="order-items" id="order-items">
            </ul>
            <div class="total-price-container" id="total-price-container">
            </div>
            <button class="complete-order-btn" id="complete-order-btn">
            Complete Order
            </button>
    `
	document.getElementById("order-container").innerHTML = html
}

function handleCompleteOrderClick() {
	const totalPrice = getTotalPrice()

	if (totalPrice) {
		const modalElement = document.getElementById("modal")
		modalElement.style.display = "block"
		modalElement.innerHTML = `
            <form id="payment-form" class="payment-form">
				<p>Enter card details</p>
				<input type="text" placeholder="Enter your name" required name="full-name" id="name-input"/>

				<input
					type="text"
					placeholder="Enter your card number"
					pattern="[0-9]{16}"
					maxlength="16"
					required
				/>

				<input
					type="text"
					pattern="[0-9]{3}"
					placeholder="Enter CVV"
					maxlength="3"
					required
				/>

				<button type="submit" id="pay-btn">Pay</button>
			</form>
        `
	}
}

function handleConfirmationClick() {
	const paymentForm = document.getElementById("payment-form")

	paymentForm.addEventListener("submit", function (e) {
		e.preventDefault()

		const paymentFormData = new FormData(paymentForm)
		const name = paymentFormData.get("full-name")
		document.getElementById("order-container").innerHTML = `
            <span>Thanks ${name}, Your order is on its way!</span>
        `
		document.getElementById("modal").style.display = "none"
	})
}

function getOrderHtml() {
	let orderHtml = ""

	menuArray.forEach((order) => {
		if (order.quantity) {
			orderHtml += `
                    <li>
                        <div class="order-items-container">
                            <p class="menu-name">${order.name}</p>
                            <button data-remove-order-btn=${
															order.id
														}>remove</button>
                            <p class="margin-left menu-price">$${
															order.price * order.quantity
														}</p>
                        </div>
                    </li>
                `
		}
	})
	return orderHtml
}

function getHtmlMenu(arr) {
	let htmlMenu = ""

	arr.forEach(
		(menu) =>
			(htmlMenu += `
	        <div class="menu-item-container">
	            <li>
	                <image src="./images/${menu.name}.png"></image>
	            </li>
	            <li>
	                <div class="menu-desc">
	                    <p class="menu-name">${menu.name}</p>
	                    <p class="menu-ingredients">${menu.ingredients}</p>
	                    <p class="menu-price">$${menu.price}</p>
	                </div>
	            </li>
	            <li class="margin-left">
	                <div class="order-quantity-container">
	                    <button class="menu-button" data-increment-btn=${menu.id}>+</button>
	                    <p data-quantity-order=${menu.id}>${menu.quantity}</p>
	                    <button class="menu-button" id="decrement-btn-${menu.id}" data-decrement-btn=${menu.id}>-</button>
	                </div>
	            </li>
	        </div>
	    `)
	)
	return htmlMenu
}

function render() {
	document.getElementById("menu-list").innerHTML = getHtmlMenu(menuArray)
	document.getElementById("order-items").innerHTML = getOrderHtml()
}

render()
