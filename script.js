/*
 * jQuery v1.9.1 included
 */

$(document).ready(function () {
  // Category button click
  $(".category-button").on("click", function () {
    var selectedCategoryId = $(this).data("category-id");
    selectCategory(selectedCategoryId);
  });

  // Select the first category by default
  var firstCategoryId = $(".category-button").first().data("category-id");
  if (firstCategoryId) {
    selectCategory(firstCategoryId);
  }

  function selectCategory(selectedCategoryId) {
    // (Un)select buttons
    $(".category-button").each(function () {
      var categoryEl = $(this);
      var categoryId = categoryEl.data("category-id");
      if (selectedCategoryId === categoryId) {
        categoryEl.addClass("selected");
      } else {
        categoryEl.removeClass("selected");
      }
    });

    // Show/hide category list
    $(".category").each(function () {
      var categoryEl = $(this);
      var categoryId = categoryEl.data("category-id");
      if (selectedCategoryId === categoryId) {
        categoryEl.show();
      } else {
        categoryEl.hide();
      }
    });
  }

  // Open/close search
  $("#show-search").on("click", function () {
    $("#search-header").fadeIn("fast");
    $("#query").focus();
  });
  $("#hide-search").on("click", function () {
    $("#search-header").fadeOut("fast");
  });

  // Back button
  $("#back-button").on("click", function () {
    window.history.back();
  });
});
