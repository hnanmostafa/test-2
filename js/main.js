"use strict";
/// <reference types="../@types/jquery" />
let urlVr = "search.php?s=";
// Handle Side Nav For First Time
const widthOfLeftOfNav = $(".left-side").outerWidth();
$("nav").css("left", -widthOfLeftOfNav);

//  Handle Open and Close Icon
$(".open-close-icon").click(function () {
  $(".open-close-icon").toggleClass("my-none");
});
// Handle My NAv Bar In Openning
$(".fa-align-justify").click(function () {
  $("nav").animate({ left: "0px" }, 600);
  for (let i = 0; i < 5; i++) {
    $(".my-links li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 6) * 100
      );
  }
});
// Handle My NAv Bar In Clossing
$(".fa-x").click(function () {
  $("nav").animate({ left: -widthOfLeftOfNav }, 1000);
  $(".my-links li").animate({ top: "300px" }, 1000);
});

// Fetch Data For This parameter
async function getMyData(forMyUrl) {
  let z = `https://www.themealdb.com/api/json/v1/1/${forMyUrl}`;
  let response = await fetch(z);
  let x = await response.json();
  return x;
}
async function disAppearIfDataCame(urlVr) {
  let firstUrl = await getMyData(urlVr);
  $(".loading-first").fadeOut(1000, function () {
    $("body").css("overflow", "visible");
  });
  displayDataForFirstTime(firstUrl, ".home-section", firstUrl.meals.length);
}
/************************************************************************/
let navLeft = -1 * $("nav").css("left").split("px")[0];
let navLeftofLeftSide = Number($(".right-side").css("width").split("px")[0]);
/************************************************************************/
async function appearLoading(sectionParent, visibility, myLeft, mytop) {
  $(`${sectionParent} > .loading`).css(
    "top",
    `${$(window).scrollTop() + mytop}px`
  );

  $(`${sectionParent} > .loading`).css("left", `${myLeft}px`);
  document.querySelector("body,html").scrollTop = 0;
  $(window).scroll(function () {
    $(`${sectionParent} > .loading`).css(
      "top",
      `${$(window).scrollTop() + mytop}px`
    );
  });
  $(`${sectionParent} > .loading`).fadeIn(0).css("display", "flex");
  $("body").css("overflow", `${visibility}`);
}
function disappearMyLoading(sectionParent, myLeft) {
  $(`${sectionParent} > .loading`).fadeOut(1000, function () {
    $("body").css("overflow", "visible");
  });
}

function displayDataForFirstTime(
  responseHome,
  theSectionWanted,
  numberOfArray
) {
  let cartona = "";
  if (responseHome.meals) {
    for (let i = 0; i < numberOfArray; i++) {
      cartona += `<div class="col-md-3 home-card" role="button" id="${responseHome.meals[i].idMeal}">
        <div
          class="overflow-hidden rounded-2 cursor-pointer position-relative card-container"
        >
          <img src="${responseHome.meals[i].strMealThumb}" alt="my Food Image" />
          <div
            class="layer position-absolute bottom-0 start-0 end-0 d-flex align-items-center"
          >
            <h3 class="ps-2">${responseHome.meals[i].strMeal}</h3>
          </div>
        </div>
      </div>`;
    }
  }

  $(`${theSectionWanted} .row`).html(cartona);
}
// Display For Details
/***************Display Single Meal*************************************************************/
function displayDataForDetails(response) {
  let cartona1 = "";
  let cartona2 = "";
  const myRegextDetails = /^strMeasure\d+$/i;
  const myRegextDetailsProperty = /^strIngredient\d+$/i;
  const myRegextDetailsValue = /\S+/i;
  let arrayOFInstructions = [];
  let arrayOFProperty = [];
  for (const [key, value] of Object.entries(response.meals[0])) {
    if (myRegextDetails.test(key) && myRegextDetailsValue.test(value)) {
      arrayOFInstructions.push(value);
    }
  }
  for (const [key, value] of Object.entries(response.meals[0])) {
    if (myRegextDetailsProperty.test(key) && myRegextDetailsValue.test(value)) {
      arrayOFProperty.push(value);
    }
  }
  for (let i = 0; i < arrayOFInstructions.length; i++) {
    cartona1 += `<li class="alert alert-info m-2 p-1">${arrayOFInstructions[i]} ${arrayOFProperty[i]} Sushi Rice</li>`;
  }
  let myTag = "";
  if (response.meals[0].strTags) {
    myTag = "Tags :";
    let arrayOfTags = response.meals[0].strTags.split(",");
    for (let i = 0; i < arrayOfTags.length; i++) {
      cartona2 += `<li class="alert alert-danger m-2 p-1">${arrayOfTags[i]}</li>`;
    }
  }

  $(".reciepe-detail").html(
    ` <div class="container py-5">
    <div class="me-auto d-flex justify-content-end">
      <i class="fa-solid close-icon-details fa-4 fa-x m-3"></i>
    </div>
    <div class="row">
      <div class="col-md-4">
        <div class="overflow-hidden rounded-2 position-relative">
          <img src="${response.meals[0].strMealThumb}" alt="my Food Image" />
        </div>
        <h2>${response.meals[0].strMeal}</h2>
      </div>
      <div class="col-md-8">
        <h2>Instructions</h2>
        <p>
        ${response.meals[0].strInstructions}
        </p>
        <h3><span class="fw-bolder">Area : </span>${response.meals[0].strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${response.meals[0].strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="d-flex g-3 flex-wrap">
        ${cartona1}
        </ul>
        <h3>${myTag}</h3>
        <ul class="d-flex g-3 flex-wrap">
        ${cartona2}
        </ul>
        <a
          target="_blank"
          href="${response.meals[0].strSource}"
          class="btn btn-success"
          >Source</a
        >
        <a
          target="_blank"
          href="${response.meals[0].strYoutube}"
          class="btn btn-danger"
          >Youtube</a
        >
      </div>
    </div>
  </div>`
  );
}
/********************************************Close Nav at any click**********************************************/
function closeNav() {
  if ($("nav").css("left") !== "-284px") {
    $(".open-close-icon").toggleClass("my-none");
    $("nav").animate({ left: -widthOfLeftOfNav }, 1000);
    $(".my-links li").animate({ top: "300px" }, 1000);
  }
}
/******************************************************************************************/
// Display For Home
async function holdHomeNewDataBeforeTakeAway() {
  await disAppearIfDataCame(urlVr);
  displaySingleCard(".home-section");
}
/***************************************Display Single Card**************************************************/
function displaySingleCard(varME) {
  $(".home-card").click(async function () {
    closeNav();
    clearInputs();
    appearLoading("body", "hidden", navLeftofLeftSide, 0);
    let idVar = `lookup.php?i=${this.id}`;
    let responseDetail = await getMyData(idVar);
    displayDataForDetails(responseDetail);
    disappearMyLoading("body");
    $(".reciepe-detail").removeClass("my-none");
    $(".my-main-section").addClass("my-none");
    $(".category-branch").addClass("my-none");
    $(".area-branch").addClass("my-none");
    $(".ingredients-branch").addClass("my-none");
    // Handle Close Detail Button
    $(".close-icon-details").click(function () {
      closeNav();
      appearLoading("body", "hidden");
      disappearMyLoading("body");
      $(".reciepe-detail").addClass("my-none");
      $(`${varME}`).removeClass("my-none");
    });
  });
}
holdHomeNewDataBeforeTakeAway();
/******************************Handle Search Section*************************************************************************/
$(".my-non-load-link").click(function () {
  clearInputs();
  closeNav();
  $(".my-main-section").addClass("my-none");
  $(".reciepe-detail").addClass("my-none");
  $(".category-branch").addClass("my-none");
  $(".area-branch").addClass("my-none");
  $(".ingredients-branch").addClass("my-none");
  $(`${$(this).attr("href")}`).removeClass("my-none");
});
$(window).scroll(function () {
  let offsetOfSection = $(".section-search").offset().top;
  if ($(window).scrollTop() > offsetOfSection) {
    $(`#search .loading`).css(
      "top",
      ` ${$(window).scrollTop() - offsetOfSection}px`
    );
  }
});
$(window).resize(function () {
  let offsetOfSection = $(".section-search").offset().top;
  if ($(window).scrollTop() > offsetOfSection) {
    $(`#search .loading`).css(
      "top",
      ` ${$(window).scrollTop() - offsetOfSection}px`
    );
  }
});

$("#search input")
  .eq(0)
  .keyup(async function () {
    document.querySelector("body,html").scrollTop = 0;
    $(`#search .loading`).fadeIn(0).css("display", "flex");
    $("body").css("overflow", `hidden`);

    closeNav();
    let myVar = `search.php?s=${$(this).val()}`;
    let x = await getMyData(myVar);
    $("#search .loading").fadeOut(1000, function () {
      $("body").css("overflow", `auto`);
    });
    displayDataForFirstTime(x, ".section-search", x.meals.length);
    displaySingleCard("#search");
  });
$("#search input")
  .eq(1)
  .keyup(async function () {
    document.querySelector("body,html").scrollTop = 0;

    $(`#search .loading`).fadeIn(0).css("display", "flex");
    $("body").css("overflow", `hidden`);

    closeNav();
    let myVar;
    if ($(this).val()) {
      myVar = `search.php?f=${$(this).val()}`;
    } else {
      myVar = `search.php?f=a`;
    }
    let x = await getMyData(myVar);
    displayDataForFirstTime(x, ".section-search", x.meals.length);
    displaySingleCard("#search");
    $("#search .loading").fadeOut(1000, function () {
      $("body").css("overflow", `auto`);
    });
  });
/**********************************************Clear Inputs When you leave****************************************************/
async function clearInputs() {
  if ($("#search input").val()) {
    $("#search input").val("");
    let myVar = `search.php?s=${$(this).val()}`;
    let x = await getMyData(myVar);
    displayDataForFirstTime(x, ".section-search", x.meals.length);
  }
}
/**********************************************************Category********************************************************************/
async function displayCategory(x) {
  let cartonaC = "";

  for (let i = 0; i < x.categories.length; i++) {
    let cartonaF = "";
    let arrayOfWords = x.categories[i].strCategoryDescription.split(" ");
    let a;
    if (arrayOfWords.length > 8) {
      a = 8;
    } else {
      a = arrayOfWords.length;
    }
    for (let r = 0; r < a; r++) {
      cartonaF += `${arrayOfWords[r]}  `;
    }
    cartonaC += `
      <div class="col-md-6 col-lg-3 py-3 category-card" role='button' id="${x.categories[i].strCategory}">
        <div
          class="overflow-hidden rounded-2 cursor-pointer position-relative card-container"
        >
          <img   
            src="${x.categories[i].strCategoryThumb}"
            alt="my Food Image"
          />
          <div
            class="layer position-absolute bottom-0 start-0 end-0 d-flex align-items-center flex-column gap-1 py-1 px-3"
          >
            <h3 class="ps-2">${x.categories[i].strCategory}</h3>
            <p class="ps-2   align-self-center">${cartonaF} <a href="#" class='text-decoration-underline read-me' id= "${x.categories[i].strCategory}">...read more</a></p>
            <p class='for-popUp my-none'>${x.categories[i].strCategoryDescription}</P>
          </div>
        </div>
      </div>
    
      `;
  }
  $("#categories .row").html(cartonaC);
}

/*****************************MyLoadSection************************************/

$(".my-load-link").click(async function () {
  clearInputs();
  await appearLoading("body", "hidden", navLeftofLeftSide, 0);
  closeNav();
  $(".my-main-section").addClass("my-none");
  $(".category-branch").addClass("my-none");
  $(".reciepe-detail").addClass("my-none");
  $(".area-branch").addClass("my-none");
  $(".ingredients-branch").addClass("my-none");
  $(`${$(this).attr("href")}`).removeClass("my-none");
  let endpointme;
  if ($(this).attr("href") === "#categories") {
    endpointme = "categories.php";
    let x = await getMyData(endpointme);
    await displayCategory(x);
    disappearMyLoading("body", navLeftofLeftSide);
    await appearMealsForCategories();
  }
  if ($(this).attr("href") === "#area") {
    endpointme = "list.php?a=list";
    let x = await getMyData(endpointme);
    displayArea(x);
    disappearMyLoading("body", navLeftofLeftSide);
    appearMealsForAreas();
  }
  if ($(this).attr("href") === "#ingredients") {
    endpointme = "list.php?i=list";
    let x = await getMyData(endpointme);
    displayIngredients(x);
    disappearMyLoading("body", navLeftofLeftSide);
    appearMealsForIngredients();
  }
});
async function appearMealsForCategories() {
  $(".category-card").click(async function (e) {
    if (!e.target.classList.contains("read-me")) {
      appearLoading("body", "hidden", navLeftofLeftSide, 0);
      closeNav();
      $(".my-main-section").addClass("my-none");
      $(".reciepe-detail").addClass("my-none");
      $(".category-branch").removeClass("my-none");

      $(".area-branch").addClass("my-none");
      $(".ingredients-branch").addClass("my-none");
      let myEnd = `filter.php?c=${$(this).attr("id")}`;
      let x = await getMyData(myEnd);
      let k;
      if (x.meals.length <= 20) {
        k = x.meals.length;
      } else {
        k = 20;
      }
      displayDataForFirstTime(x, ".category-branch", k);
      disappearMyLoading("body", navLeftofLeftSide);
      displaySingleCard(".category-branch");
    } else {
      $(".popUp-Layer").fadeIn(1000).css("display", "flex");
      $(".popUp-Layer h3").text(`${$(this).find("h3").text()}`);
      $(".popUp-Layer p").text(`${$(this).find(".for-popUp").text()}`);
      $(".popUp-Layer img").attr("src", `${$(this).find("img").attr("src")}`);
      $(".my-ex").click(function () {
        $(".popUp-Layer").fadeOut(1000);
      });
      $(".nav-link-me").click(function () {
        $(".popUp-Layer").fadeOut(0);
      });
      $(".popUp-Layer").click(function (e) {
        if (e.target.classList.contains("popUp-Layer")) {
          $(".popUp-Layer").fadeOut(1000);
        }
      });
    }
  });
}

/***********************************Area********************************/

function displayArea(myResponse) {
  let cartonaAr = "";
  for (let i = 0; i < myResponse.meals.length; i++) {
    cartonaAr += `<div class="col-md-3 py-3 area-card d-flex justify-content-center align-content-center" role="button" id="${myResponse.meals[i].strArea}">
    <div class="overflow-hidden rounded-2 cursor-pointer  card-container d-flex justify-content-center align-items-center flex-column gap-3 text-center">
     <i class="fa-solid fa-house-laptop fa-4x"></i>
      <h3>${myResponse.meals[i].strArea}</h3>
    </div>
  </div>`;
  }
  $("#area .row").html(cartonaAr);
}

/**************************************************************************/

async function appearMealsForAreas() {
  $(".area-card").click(async function () {
    await appearLoading("body", "hidden", navLeftofLeftSide, 0);
    closeNav();
    $(".my-main-section").addClass("my-none");
    $(".reciepe-detail").addClass("my-none");
    $(".category-branch").addClass("my-none");
    $(".area-branch").removeClass("my-none");
    let myEnd = `filter.php?a=${$(this).attr("id")}`;
    let x = await getMyData(myEnd);
    let k;
    if (x.meals.length <= 20) {
      k = x.meals.length;
    } else {
      k = 20;
    }
    displayDataForFirstTime(x, ".area-branch", k);
    disappearMyLoading("body", navLeftofLeftSide);
    displaySingleCard(".area-branch");
  });
}
/*************************************************************************************/
async function appearMealsForIngredients() {
  $(".ingredients-card").click(async function (e) {
    if (!e.target.classList.contains("read-me")) {
      await appearLoading("body", "hidden", navLeftofLeftSide, 0);
      closeNav();
      $(".my-main-section").addClass("my-none");
      $(".reciepe-detail").addClass("my-none");
      $(".area-branch").addClass("my-none");
      $(".ingredients-branch").removeClass("my-none");
      let myEnd = `filter.php?i=${$(this).attr("id")}`;
      let x = await getMyData(myEnd);
      let k;
      if (x.meals.length <= 20) {
        k = x.meals.length;
      } else {
        k = 20;
      }
      displayDataForFirstTime(x, ".ingredients-branch", k);
      disappearMyLoading("body", navLeftofLeftSide);
      displaySingleCard(".ingredients-branch");
    } else {
      $(".popUp-Layer").fadeIn(1000).css("display", "flex");
      $(".popUp-Layer h3").text(`${$(this).find("h3").text()}`);
      $(".popUp-Layer p").text(`${$(this).find(".for-popUp").text()}`);

      $(".my-ex").click(function () {
        $(".popUp-Layer").fadeOut(1000);
      });
      $(".nav-link-me").click(function () {
        $(".popUp-Layer").fadeOut(0);
      });
      $(".popUp-Layer").click(function (e) {
        if (e.target.classList.contains("popUp-Layer")) {
          $(".popUp-Layer").fadeOut(1000);
        }
      });
    }
  });
}
/************************************************************************************/

function displayIngredients(myResponse) {
  let cartonaAr = "";
  for (let i = 0; i < 20; i++) {
    let cartonaF = "";
    let arrayOfWords = myResponse.meals[i].strDescription.split(" ");
    let a;

    for (let r = 0; r < 20; r++) {
      cartonaF += `${arrayOfWords[r]}  `;
    }
    cartonaAr += `<div class="col-md-3 py-3 ingredients-card d-flex justify-content-center align-content-center" role="button" id="${myResponse.meals[i].strIngredient}">
    <div class="overflow-hidden rounded-2 cursor-pointer  card-container  text-center">
    <i class="fa-solid fa-drumstick-bite fa-4x pb-2"></i>
      <h3 class='pb-2'>${myResponse.meals[i].strIngredient}</h3>
      <p>${cartonaF} <a href="#" class='text-decoration-underline read-me' id= "${myResponse.meals[i].strIngredient}">...read more</a></p>
      <p class='for-popUp my-none'>${myResponse.meals[i].strDescription}</P>
    </div>
  </div>`;
  }
  $("#ingredients .row").html(cartonaAr);
}

/******************************************Contact*****************************************************/
let nameInputFocused = false;
let emailInputFocused = false;
let phoneInputFocused = false;
let ageInputFocused = false;
let passwordInputFocused = false;
let repasswordInputFocused = false;
const nameRegex = /^[a-zA-Z ]+$/;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
const passRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
document.getElementById("name-input").addEventListener("focus", function () {
  nameInputFocused = true;
});
document.getElementById("email-input").addEventListener("focus", function () {
  emailInputFocused = true;
});
document.getElementById("phone-input").addEventListener("focus", function () {
  phoneInputFocused = true;
});
document.getElementById("age-input").addEventListener("focus", function () {
  ageInputFocused = true;
});
document
  .getElementById("password-input")
  .addEventListener("focus", function () {
    passwordInputFocused = true;
  });
document
  .getElementById("repassword-input")
  .addEventListener("focus", function () {
    repasswordInputFocused = true;
  });

function validateInputs() {
  if (nameInputFocused) {
    if (nameRegex.test(document.getElementById("name-input").value)) {
      document
        .querySelector("#name-alert")
        .classList.replace("my-block", "my-none");
    } else {
      document
        .querySelector("#name-alert")
        .classList.replace("my-none", "my-block");
    }
  }
  if (emailInputFocused) {
    if (emailRegex.test(document.getElementById("email-input").value)) {
      document
        .querySelector("#email-alert")
        .classList.replace("my-block", "my-none");
    } else {
      document
        .querySelector("#email-alert")
        .classList.replace("my-none", "my-block");
    }
  }
  if (phoneInputFocused) {
    if (phoneRegex.test(document.getElementById("phone-input").value)) {
      document
        .querySelector("#phone-alert")
        .classList.replace("my-block", "my-none");
    } else {
      document
        .querySelector("#phone-alert")
        .classList.replace("my-none", "my-block");
    }
  }
  if (ageInputFocused) {
    if (ageRegex.test(document.getElementById("age-input").value)) {
      document
        .querySelector("#age-alert")
        .classList.replace("my-block", "my-none");
    } else {
      document
        .querySelector("#age-alert")
        .classList.replace("my-none", "my-block");
    }
  }
  if (passwordInputFocused) {
    if (passRegex.test(document.getElementById("password-input").value)) {
      document
        .querySelector("#password-alert")
        .classList.replace("my-block", "my-none");
    } else {
      document
        .querySelector("#password-alert")
        .classList.replace("my-none", "my-block");
    }
  }
  if (repasswordInputFocused) {
    if (
      document.getElementById("password-input").value ===
      document.getElementById("repassword-input").value
    ) {
      document
        .querySelector("#repassword-alert")
        .classList.replace("my-block", "my-none");
    } else {
      document
        .querySelector("#repassword-alert")
        .classList.replace("my-none", "my-block");
    }
  }
  if (
    nameRegex.test(document.getElementById("name-input").value) &&
    emailRegex.test(document.getElementById("email-input").value) &&
    ageRegex.test(document.getElementById("age-input").value) &&
    phoneRegex.test(document.getElementById("phone-input").value) &&
    passRegex.test(document.getElementById("password-input").value) &&
    document.getElementById("password-input").value ===
      document.getElementById("repassword-input").value
  ) {
    document.querySelector("#submitBtn").removeAttribute("disabled");
  } else {
    document.querySelector("#submitBtn").setAttribute("disabled", true);
  }
}

$("#contact input").keyup(function () {
  validateInputs();
});
let arrayOfUsers = [];
document.querySelector("#submitBtn").addEventListener("click", function () {
  let user = {
    name: document.getElementById("name-input").value,
    email: document.getElementById("email-input").value,
    age: document.getElementById("age-input").value,
    phone: document.getElementById("phone-input").value,
    pass: document.getElementById("password-input").value,
  };
  appearLoading("body", "hidden", navLeftofLeftSide, 0);
  clearInputs();
  let myValForUsers = true;

  for (let i = 0; i < arrayOfUsers.length; i++) {
    if (user.email == arrayOfUsers[i].email) {
      myValForUsers = false;
    }
  }
  if (myValForUsers) {
    arrayOfUsers.push(user);
    localStorage.setItem("arrayOfUsers", JSON.stringify(arrayOfUsers));
  }

  disappearMyLoading("body", navLeftofLeftSide);
  document.querySelector("#submitBtn").setAttribute("disabled", true);
});

function clearInputs() {
  document.getElementById("name-input").value = "";
  document.getElementById("email-input").value = "";
  document.getElementById("age-input").value = "";
  document.getElementById("phone-input").value = "";
  document.getElementById("password-input").value = "";
  document.getElementById("repassword-input").value = "";
}
$(".nav-link-me").click(function () {
  document
    .querySelector("#name-alert")
    .classList.replace("my-block", "my-none");
  document.querySelector("#age-alert").classList.replace("my-block", "my-none");
  document
    .querySelector("#email-alert")
    .classList.replace("my-block", "my-none");
  document
    .querySelector("#password-alert")
    .classList.replace("my-block", "my-none");
  document
    .querySelector("#repassword-alert")
    .classList.replace("my-block", "my-none");
  document
    .querySelector("#phone-alert")
    .classList.replace("my-block", "my-none");
});
