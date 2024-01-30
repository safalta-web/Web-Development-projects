const api_url = "https://6245f389e3450d61b0f926c1.mockapi.io/api/v1/";

function showLoader(id) {
  let loadingElement = document.querySelector(id);
  if (loadingElement) {
    loadingElement.style.display = "block";
  }
}

function hideLoader(id) {
  let loadingElement = document.querySelector(id);
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

async function getApiData(url) {
  try {
    let connection = await fetch(url);
    return await connection.json();
  } catch (error) {
    console.log(error);
  }
}
async function processCategories() {
  showLoader("#loading");
  setTimeout(async () => {
    let results = await getApiData(api_url + "categories");
    let html = "<span>Filter: </span>";

    results.forEach((category) => {
      let htmlSegment = `
        <label>
          <input type="radio" name="category" onclick="selectCategory(${category.id});">
          ${category.name}
        </label>`;
      html += htmlSegment;
    });

    let categoryContainer = document.querySelector("nav");
    categoryContainer.innerHTML = html;

    let selectedCategory = localStorage.getItem("selectedCategory");
    if (selectedCategory !== null) {
      const selectedRadioButton = document.querySelector(
        input[(type = "radio")][
          (onclick = "selectCategory(${selectedCategory});")
        ]
      );
      if (selectedRadioButton) {
        selectedRadioButton.checked = true;
        selectCategory(selectedCategory);
      }
    }

    hideLoader("#loading");
  }, 500);
}

async function selectCategory(categoryId) {
  showLoader('#loadingCategories');
  try {
    let data = await getApiData(
      api_url + "categories/" + categoryId + "/items"
    );
    console.log(data);
    updateTable(data);
    hideLoader('#loadingCategories');
  } catch (error) {
    console.error(error);
  }
}

function updateTable(data) {
  let tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  data.items.forEach((item) => {
    let htmlSegment = `
      <tr class="hovering" onclick="processDetail(this)" data-category="${item.Category.id}" data-item="${item.itemId}">
        <td><img class="itemImage clickable-image" src="${item.image[0]}" alt=""></td>
        <td>${item.itemName}</td>
        <td>${item.itemBrief}</td>
        <td>$${item.price}</td>
      </tr>`;
    tbody.innerHTML += htmlSegment;
  });
}

function hideElements() {
  document.querySelector("table").style.display = "none";
  document.querySelector("nav").style.display = "none";
}


async function processDetail(clickedRow) {
  hideElements();
  document.querySelector('.datail-wrapper').classList.remove('hidden')
  let categoryId = clickedRow.dataset.category
  let itemId = clickedRow.dataset.item
  const item = await getApiData(`${api_url}categories/${categoryId}/items/${itemId}`)
  console.log(item)

  document.querySelector('.current-image').innerHTML = `<img src="${item.image[0]}" alt ='Some image' id ='main-image' data-selected="id0">
  `
  item.image.forEach((img, i) => {
    document.querySelector('.thumbnail_image').innerHTML += 
    `<img src="${img}" alt ='Some image' id ='main-image' data-selected="id${i}" onclick=changeImage(this)>`
  });

  document.querySelector('.name').innerHTML = item.itemName
  document.querySelector('.price').innerHTML = item.price
  document.querySelector('.text-container').innerHTML = item.itemFull

  item.size.forEach(size => {
    document.querySelector('.sizes').innerHTML += `<option value="${size}">${size}</option>`
  });
  item.colors.forEach(color => {
    document.querySelector('.colors').innerHTML += `<option value="${color}">${color}</option>`
  });
}

function hideDetail(){
  document.querySelector("table").style.display = "inline-block";
  document.querySelector("nav").style.display = "inline-block";
  document.querySelector('.datail-wrapper').classList.add('hidden')
}

function changeImage(clickedImage){
  var mainImage = document.getElementById('main-image');
      mainImage.src = clickedImage.src;
      mainImage.alt = clickedImage.alt;
      mainImage.dataset.selected = clickedImage.dataset.id;
     
      document.querySelectorAll('.thumbnail_image img').forEach(img => {
          if(img.dataset.id === mainImage.dataset.selected) {
              img.classList.add('active')
          }
          else {
              img.classList.remove('active')
          }
      });
  }
processCategories();