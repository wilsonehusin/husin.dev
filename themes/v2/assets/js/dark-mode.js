function setDarkMode(isWanted) {
  if (Boolean(isWanted)) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
}

function evalDarkMode() {
  const invert = localStorage.invertTheme === "true";
  const prefer = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = invert ? !prefer : prefer;
  setDarkMode(useDark);
}

function toggleDarkMode() {
  localStorage.invertTheme =
    localStorage.invertTheme === "true" ? "false" : "true";
  evalDarkMode();
}
