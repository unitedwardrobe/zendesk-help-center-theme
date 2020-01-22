/*
 * jQuery v1.9.1 included
 */

$(document).ready(function() {
  // Category button click
  $(".category-button").on("click", function() {
    var selectedCategoryId = $(this).data("category-id");
    selectCategory(selectedCategoryId);
  });

  // Select the first category by default
  var firstCategoryId = $(".category-button")
    .first()
    .data("category-id");
  if (firstCategoryId) {
    selectCategory(firstCategoryId);
  }

  function selectCategory(selectedCategoryId) {
    // (Un)select buttons
    $(".category-button").each(function() {
      var categoryEl = $(this);
      var categoryId = categoryEl.data("category-id");
      if (selectedCategoryId === categoryId) {
        categoryEl.addClass("selected");
      } else {
        categoryEl.removeClass("selected");
      }
    });

    // Show/hide category list
    $(".category").each(function() {
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
  $("#show-search").on("click", function() {
    $("#search-header").fadeIn("fast");
    $("#query").focus();
  });
  $("#hide-search").on("click", function() {
    $("#search-header").fadeOut("fast");
  });

  // Back button
  $("#back-button").on("click", function() {
    window.history.back();
  });

  // Contact categories
  var categoriesEl = $("#contact-categories");
  var topicsEl = $("#content-topics");
  var categoriesSectionEl = $("#contact-categories-section");
  var topicsSectionEl = $("#contact-topics-section");
  var formSectionEl = $("#contact-form-section");

  function pushState(state) {
    window.history.pushState(state, null, window.location.pathname);
    $(window).scrollTop(0);
    dispatchEvent(
      new PopStateEvent("popstate", {
        state: state
      })
    );
  }

  function initContactCategories() {
    categoriesSectionEl.show();
    topicsSectionEl.hide();
    formSectionEl.hide();

    categoriesEl.empty();
    contactForm.forEach(function(category) {
      var asset = assetIconOther;
      switch (category.id) {
        case "general_information":
          asset = assetIconGettingStarted;
          break;
        case "shipping":
          asset = assetParcelReveivedIcon;
          break;
        case "payments":
          asset = assetIconPaying;
          break;
        case "returns":
          asset = assetIconReturn;
          break;
        case "cancellations":
          asset = assetIconCancellation;
          break;
        case "account":
          asset = assetIconMyAccount;
          break;
      }
      var categoryEl = $(
        '<li><div class="item"><div class="block-icon"><img src="' +
          asset +
          '" /></div><span class="block-title">' +
          category.title +
          "</span></div></li>"
      );

      categoriesEl.append(categoryEl);
      categoryEl.on("click", function() {
        pushState({ type: "topics", category: category });
      });
    });
  }

  function initTopics(category) {
    categoriesSectionEl.hide();
    topicsSectionEl.show();
    formSectionEl.hide();

    topicsEl.empty();
    category.topics.forEach(function(topic) {
      var topicEl = $('<li><div class="item">' + topic.title + "</li>");
      topicEl.on("click", function() {
        pushState({ type: "form", category: category, topic: topic });
      });
      topicsEl.append(topicEl);
    });
  }

  function initForm(category, topic) {
    categoriesSectionEl.hide();
    topicsSectionEl.hide();
    formSectionEl.show();

    var subjectEl = $("#request_subject");
    if (!subjectEl.val().length) {
      $("#request_subject").val("Help Center contact form");
    }

    if (category) {
      $("#request_custom_fields_360004329459").val(category.id);
    }

    if (topic) {
      $("#request_custom_fields_360004301640").val(topic.id);
    }
  }

  function initOrders(res) {
    var orders = [];
    var email;
    if (res.data && res.data.viewer) {
      email = res.data.viewer.account.email.emailAddress;
      var purchases = res.data.viewer.purchases.nodes;
      var sales = res.data.viewer.sales.nodes;
      orders = purchases.concat(sales).map(function(order) {
        var images = [];

        if (typeof order.item !== "undefined") {
          if (typeof order.item.image !== "undefined") {
            images = [order.item.image.url];
          } else if (typeof order.item.product !== "undefined") {
            images = [order.item.product.image.url];
          }
        } else if (typeof order.cartGroup !== "undefined") {
          images = order.cartGroup.items.map(function(item) {
            if (typeof item.image !== "undefined") {
              return item.image.url;
            } else if (typeof item.product !== "undefined") {
              return item.product.image.url;
            }
          });
        }

        return {
          createdOn: new Date(order.createdOn),
          orderReference: order.orderReference,
          images: images
        };
      });
      orders.sort(function(a, b) {
        return b.createdOn.getTime() - a.createdOn.getTime();
      });
    }

    if (!orders.length) {
      return;
    }

    if (email) {
      $("#request_anonymous_requester_email").val(email);
    }

    var orderContainerEl = $(".request_custom_fields_360004408319");
    var orderEl = $("#request_custom_fields_360004408319");
    var ordersEl = $("#orders");

    ordersEl.empty();

    orderEl.attr("readonly", "true");
    orderEl.attr("placeholder", orderPlaceholder);
    orderContainerEl.css({ display: "flex" });

    orders.forEach(function(order) {
      var orderItemEl = $('<div class="order">');
      var orderLabelsEl = $('<span class="order-labels">');
      var imageContainerEl = $('<div class="order-images">');

      if (order.images.length > 3) {
        var additionalImageEl = $('<div class="additional-images">');
        additionalImageEl.text("+" + (order.images.length - 2));
        imageContainerEl.append(additionalImageEl);
        order.images = order.images.slice(0, 2);
      }
      order.images.forEach(function(image) {
        imageContainerEl.append('<img src="' + image + '" />');
      });

      var orderReferenceEl = $('<div class="order-reference">');
      var orderDateEl = $('<div class="order-date">');
      orderReferenceEl.text(order.orderReference);
      orderDateEl.text(order.createdOn.toLocaleDateString());
      orderLabelsEl.append(orderReferenceEl);
      orderLabelsEl.append(orderDateEl);

      orderItemEl.append(orderLabelsEl);
      orderItemEl.append(imageContainerEl);

      ordersEl.append(orderItemEl);
      orderItemEl.on("click", function() {
        orderEl.val(order.orderReference);
        $("#request_subject").val(
          "Help Center contact form (" + order.orderReference + ")"
        );
        window.history.back();
      });
    });
  }

  $("#close_orders").on("click", function() {
    window.history.back();
  });

  // Contact form
  if (window.contactForm) {
    $(window).on("popstate", function(e) {
      var state = e.originalEvent.state;

      if (state) {
        $("#orders_overlay").fadeOut("fast");
        switch (state.type) {
          case "form":
            initForm(state.category, state.topic);
            break;
          case "topics":
            initTopics(state.category);
            break;
          case "categories":
            initContactCategories();
            break;
          case "order":
            $("#orders_overlay").fadeIn("fast");
            break;
        }
      }
    });

    window.addEventListener(
      "populateForm",
      function(e) {
        if (typeof e.detail !== "undefined") {
          initOrders(e.detail);
        }
      },
      false
    );

    initContactCategories();
    window.history.replaceState(
      { type: "categories" },
      null,
      window.location.pathname
    );

    $("#request_custom_fields_360004408319").on("click", function() {
      pushState({ type: "order" });
    });

    $("#hide_orders_overlay").on("click", function() {
      window.history.back();
    });
  }
});
