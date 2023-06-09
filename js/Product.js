import { createCategoryHTML } from "./Category.js";

import {
  getProducts,
  saveProducts,
  editProduct,
  removeProduct,
} from "./LocalStorage.js";

// Variables :

const productsList = document.querySelector(".products-list");
const productAddButton = document.querySelector(".add-product__button");
const searchInput = document.querySelector(
  ".sort-filter-wrapper__input-search"
);
const sortDropdownList = document.querySelector(
  ".sort-filter-wrapper__dropdown-list"
);
const totalProducts = document.querySelector(".header__products-quantity");

let products = [];

let product = {};

// Functions :

// Set products and categories that already exist :
function setupApp() {
  createCategoryHTML();

  products = getProducts();

  createProductHTML(products);

  // Get total products of DOM :
  getDOMProducts();
}

// Get total products of DOM :
function getDOMProducts() {
  products = getProducts();

  totalProducts.textContent = products.length;
}

function sortProductsDOM() {
  const sortOption = sortDropdownList.value;

  products = getProducts();

  switch (sortOption) {
    case "oldest":
      products = products.sort((a, b) => {
        return new Date(a.createdDate) > new Date(b.createdDate) ? 1 : -1;
      });
      break;

    default:
      products = products.sort((a, b) => {
        return new Date(a.createdDate) > new Date(b.createdDate) ? -1 : 1;
      });
      break;
  }

  createProductHTML(products);
}

function filterProduct() {
  products = getProducts();

  products = products.filter((product) =>
    product.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  createProductHTML(products);
}

function getProductSpecs() {
  const productInputs = [
    ...document.querySelectorAll(".add-product__input-product"),
  ];

  const titleInput = document.querySelector(".add-product__input-title");
  const quantityInput = document.querySelector(".add-product__input-quantity");
  const categoryList = document.querySelector(".add-product__dropdown-list");

  productInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const title = titleInput.value;
      const quantity = quantityInput.value;
      const category = categoryList.value;

      updateProduct(title, quantity, category);
    });
  });
}

function updateProduct(title, quantity, category) {
  if (title && quantity && category) {
    product = {};

    product.title = title;
    product.quantity = quantity;
    product.category = category;
  } else product = {};
}

function addProduct() {
  if (product.title && product.quantity && product.category) {
    if (product.category === "Select a Category:") return;
    else {
      productsSort(product);

      products = getProducts();

      createProductHTML(products);

      selectAllDeleteButtons();

      selectAllEditButtons();

      // After creating the product, the entries in the product form are deleted :
      emptyProductInputs();

      getDOMProducts();
    }
  } else return;
}

function selectAllEditButtons() {
  const editButtons = [...document.querySelectorAll(".product__edit-button")];
  const productsTitle = [...document.querySelectorAll(".product__input-title")];
  const editCancelButtons = [
    ...document.querySelectorAll(".product__edit-cancel-btn"),
  ];

  editButtons.forEach((btn) => {
    const id = btn.dataset.id;

    btn.addEventListener("click", () => {
      // Action to enable product title for editing :
      enableTitleInput(productsTitle, editCancelButtons, id);
    });
  });
}

// Action to enable product title for editing :
function enableTitleInput(productsTitle, editCancelButtons, id) {
  const productTitle = productsTitle.find((input) => input.dataset.id == id);
  const editCancelButton = editCancelButtons.find(
    (btn) => btn.dataset.id == id
  );

  // Cancels product editing :
  cancelEditProduct(editCancelButton, productTitle);

  productTitle.removeAttribute("disabled");
  productTitle.classList.add("product__input-edit");

  products = getProducts();

  productTitle.addEventListener("change", () => {
    const title = productTitle.value;

    editProduct(title, id, productsTitle, editCancelButtons, products);
  });
}

// Cancels product editing :
function cancelEditProduct(editCancelButton, productTitle) {
  editCancelButton.style.display = "flex";

  editCancelButton.addEventListener("click", () => {
    productTitle.setAttribute("disabled", "");
    productTitle.classList.remove("product__input-edit");

    editCancelButton.style.display = "none";
  });
}

function selectAllDeleteButtons() {
  const deleteButtons = [
    ...document.querySelectorAll(".product__delete-button"),
  ];

  products = getProducts();

  deleteButtons.forEach((btn) => {
    const id = btn.dataset.id;

    btn.addEventListener("click", () => {
      removeProduct(id, products);

      products = getProducts();

      createProductHTML(products);

      selectAllDeleteButtons();

      getDOMProducts();
    });
  });
}

function createProductHTML(products) {
  const maxLength = 10;
  const quantityMaxLength = 3;

  let productHTML = "";

  products.forEach((product) => {
    productHTML += `
      <li class="product">
              <div class="product__title">
              <div>
              <input
                type="text"
                class="product__input-title"
                value="${product.title.substring(0, maxLength)}"
                data-id="${product.id}"
                disabled
              />
            </div>
            <div class="product__edit-cancel-btn" data-id="${product.id}"></div>
              </div>
              <div class="product__specs">
                <div class="product__product-specs">
                  <span class="product__date product__spec">${new Date(
                    product.createdDate
                  ).toLocaleDateString("fa-IR")}</span>
                  <span class="product__category product__spec">${product.category.substring(
                    0,
                    maxLength
                  )}</span>
                  <span class="product__quantity product__spec">${product.quantity.substring(
                    0,
                    quantityMaxLength
                  )}</span>
                </div>
                <div class="product__buttons">
                  <button class="product__edit-button" data-id="${
                    product.id
                  }">Edit</button>
                  <button class="product__delete-button" data-id="${
                    product.id
                  }">Delete</button>
                </div>
              </div>
            </li> 
      `;
  });

  productsList.innerHTML = productHTML;

  selectAllDeleteButtons();

  selectAllEditButtons();
}

function productsSort(product) {
  product.id = new Date().getTime();
  product.createdDate = new Date().toISOString();

  products = [...products, product];

  products = products.sort((a, b) => {
    return new Date(a.createdDate) > new Date(b.createdDate) ? -1 : 1;
  });

  saveProducts(products);
}

// After creating the product, the entries in the product form are deleted :
function emptyProductInputs() {
  const titleInput = document.querySelector(".add-product__input-title");
  const quantityInput = document.querySelector(".add-product__input-quantity");

  titleInput.value = "";
  quantityInput.value = "";

  product = {};
}

export {
  setupApp,
  addProduct,
  sortProductsDOM,
  filterProduct,
  productAddButton,
  searchInput,
  sortDropdownList,
  getProductSpecs,
  createProductHTML,
  enableTitleInput,
};
