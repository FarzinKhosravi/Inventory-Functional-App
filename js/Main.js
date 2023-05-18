import {
  setupApp,
  addProduct,
  sortProductsDOM,
  filterProduct,
  productAddButton,
  searchInput,
  sortDropdownList,
  getProductSpecs,
} from "./Product.js";

import {
  categoryLink,
  categoryCancelButton,
  categoryAddButton,
  hideCategory,
  categoryView,
  addCategory,
} from "./Category.js";

document.addEventListener("DOMContentLoaded", () => {
  categoryLink.addEventListener("click", categoryView);
  categoryCancelButton.addEventListener("click", hideCategory);
  categoryAddButton.addEventListener("click", addCategory);
  productAddButton.addEventListener("click", addProduct);
  searchInput.addEventListener("input", filterProduct);
  sortDropdownList.addEventListener("change", sortProductsDOM);

  // Set products and categories that already exist :
  setupApp();

  getProductSpecs();
});
