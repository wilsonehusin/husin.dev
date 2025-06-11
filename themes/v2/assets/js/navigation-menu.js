function toggleNavigationMenu() {
  const nav = document.querySelector("nav");
  nav.classList.toggle("overflow-hidden");
  nav.classList.toggle("sticky");
  nav.classList.toggle("top-0");

  const btn = document.querySelector("nav .lucide-hamburger");
  btn.classList.toggle("show");

  const screen = document.querySelector("nav .menu-screen");
  screen.classList.toggle("menu-screen-show");
}
