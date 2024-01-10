function toggleNavigationMenu() {
  const nav = document.querySelector("nav");
  nav.classList.toggle("overflow-hidden");
  nav.classList.toggle("sticky");
  nav.classList.toggle("top-0");

  const btn = document.querySelector("nav .menu-screen");
  btn.classList.toggle("menu-screen-show");
}
