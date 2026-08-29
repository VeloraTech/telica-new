/* =========================================================
   TELICA DIGITAL CONCEPTS
   Phase 1 — Interactions
   ========================================================= */

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealElements = document.querySelectorAll(".reveal");
const year = document.querySelector("[data-year]");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function closeMenu() {
  if (!menuToggle || !siteNav) return;

  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (year) {
  year.textContent = new Date().getFullYear();
}
/* =========================================================
   TELICA FAQ ACCORDION
========================================================= */

const faqItems =
    document.querySelectorAll(".faq-item");


faqItems.forEach((item) => {

    const question =
        item.querySelector(".faq-question");


    if (!question) {
        return;
    }


    question.addEventListener("click", () => {

        const currentlyOpen =
            item.classList.contains("is-open");


        /*
         * Close all other FAQ items.
         */

        faqItems.forEach((otherItem) => {

            if (otherItem !== item) {

                otherItem.classList.remove(
                    "is-open"
                );

                const otherQuestion =
                    otherItem.querySelector(
                        ".faq-question"
                    );


                otherQuestion?.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });


        /*
         * Toggle current FAQ item.
         */

        item.classList.toggle(
            "is-open",
            !currentlyOpen
        );


        question.setAttribute(
            "aria-expanded",
            String(!currentlyOpen)
        );

    });

});