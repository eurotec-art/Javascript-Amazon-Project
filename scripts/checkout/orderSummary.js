import {
  cart,
  removeFromCart,
  quantity,
  updateDeliveryOption,
} from "../../data/carts.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

const today = dayjs();
const deliveryDate = today.add(7, "days");
/* console.log(deliveryDate.format("dddd, MMMM D"));
 */
function quantityItems() {
  if (document.querySelector(".return-to-home-link")) {
    document.querySelector(".return-to-home-link").innerHTML =
      quantity() + " items";
  }
}

quantityItems();

export function renderOrderSumary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productid = cartItem.productId;
    /*  console.log(productid); */

    const matchingProduct = getProduct(productid);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    /* console.log(deliveryOption); */

    const today = dayjs();

    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
      <div class="cart-item-container
      js-cart-item-container
      js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img
            class="product-image"
            src="${matchingProduct.image}"
          />

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity:
                <span class="quantity-label">
                  <input type="number" id="input-modify-qta" class="input-modify-qta" data-input-qta="${matchingProduct.id}" min="1" value="${cartItem.quantity}"/>
                  <button>
                    Save
                  </button>
                </span> 
              </span>
              <span class="update-quantity-link link-primary  update-visible-${matchingProduct.id}" data-update-id="${matchingProduct.id}">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
  `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      /* console.log(deliveryOption); */

      const today = dayjs();

      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      /* console.log(isChecked); */

      html += `
        <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? "checked" : ""}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}"
          >
          <div>
            <div class="delivery-option-date">
              ${dateString}}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `;
      /* console.log(html); */
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );

      container.remove();

      quantityItems();

      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".update-quantity-link").forEach((link) => {
    /* console.log(link); */
    link.addEventListener("click", () => {
      const updateId = link.dataset.updateId;
      console.log(updateId);
    });
  });

  document.querySelectorAll(".input-modify-qta").forEach((link) => {
    /* console.log(link); */
    link.addEventListener("click", () => {
      const inputQta = link.dataset.inputQta;
      /* console.log(inputQta); */
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((Element) => {
    Element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = Element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSumary();
      renderPaymentSummary();
    });
  });
}
