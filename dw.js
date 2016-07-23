(function($, undefined){
  "use strict";

  var autoScrolling = false;
  var manualSideNavControl = false;

  function updateHeader(title) {
    $(".menu-logo").toggleClass("active", !title);
    $("header .header-logo").text(title || "DataWorker");
  }

  function handleScrolledToTop(isAtTop) {
    var $fbtn = $(".fbtn-container");
    $fbtn.toggleClass("not-visible", isAtTop).attr("aria-hidden", isAtTop);

    if (isAtTop && !manualSideNavControl) {
      $("#side-nav .collapse").collapse("hide");
    }
  }

  function scrollToTarget(e, hash) {
    var isPopState = e.type === "popstate";

    if (isPopState) {
      hash = window.location.hash;
    }

    var $target = $("section" + hash);
    if ($target.length) {
      autoScrolling = true;
      $("html, body").animate({ scrollTop: $target.offset().top }, 500, function () {
        autoScrolling = false;
      });

      // Prevent browser from scrolling to target and back before animating
      if (!isPopState && window.history && window.history.pushState) {
        window.history.pushState(null, "", hash);
        e.preventDefault();
      }
    }
  }

  window.onpopstate = scrollToTarget;

  $(document)
    // Close mobile side-nav on navigation
    .on("click", "#side-nav a:not([data-toggle])", function() {
      $("#side-nav").trigger("click.dismiss.bs.menu");
    })
    // Refresh scrollspy when side-nav is opened
    .on("shown.bs.menu", function() {
      $("body").scrollspy("refresh");
    })
    // Create accordion effect in side-nav
    .on("show.bs.collapse", "#side-nav .collapse", function() {
      $("#side-nav .collapse.in").collapse("hide");
    })
    // Animate scrolling to target
    .on("click", 'a[href^="#"]', function (e) {
      // Prevent auto-expanding on scroll when user manually toggled a section
      manualSideNavControl = $(this).data("toggle") === "collapse";

      scrollToTarget(e, $(this).attr("href"));
    })
    // Handle scrollspy events
    .on("activate.bs.scrollspy", "#side-nav li", function() {
      var hash = $("a", this).attr("href");
      // Update header title to match current section
      if ($("section" + hash).length) {
        updateHeader($(this).text().trim());
        handleScrolledToTop(hash === "#top");
      }

      // Auto-expand side-nav
      if (!autoScrolling && !manualSideNavControl) {
        $(this).closest(".collapse").collapse("show");
      }
    })
})(jQuery);
