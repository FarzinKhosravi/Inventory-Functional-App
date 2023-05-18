import { createProductHTML, enableTitleInput } from "./Product.js";

// Functions :

function saveCategories(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function getCategories() {
  return localStorage.getItem("categories")
    ? JSON.parse(localStorage.getItem("categories"))
    : [];
}

function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function getProducts() {
  return localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : [];
}

function editProduct(title, id, productsTitle, editCancelButtons, products) {
  if (title && id) {
    const editedProduct = products.find((product) => product.id == id);

    editedProduct.title = title;
    editedProduct.createdDate = new Date().toISOString();

    products = products.sort((a, b) => {
      return new Date(a.createdDate) > new Date(b.createdDate) ? -1 : 1;
    });

    saveProducts(products);

    createProductHTML(products);
  } else {
    enableTitleInput(productsTitle, editCancelButtons, id);
  }
}

function removeProduct(id, products) {
  products = products.filter((product) => product.id != id);
  saveProducts(products);
}

export {
  getProducts,
  getCategories,
  saveCategories,
  saveProducts,
  editProduct,
  removeProduct,
};
