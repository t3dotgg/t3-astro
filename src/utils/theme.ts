export const getTheme = () => {
  if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
    return localStorage.getItem("theme") as 'light' | 'dark';
  }
  return null;
};

export function setTheme(theme: 'light' | 'dark') {
  /**
   * clear the current theme when setting a new theme value
   * (essentially always reset to system theme first)
   */
  window.localStorage.removeItem('theme');
  document.documentElement.classList.remove("light", "dark");
  // now set the new theme
  window.localStorage.setItem('theme', theme);
  document.documentElement.classList.add(theme);
}

export function setUpClientThemeScripts() {
  const startViewTransition = (fn: () => void) => document.startViewTransition?.(fn) ?? fn();
  const setUpThemeScripts = () => {
    // set the initial theme
    setTheme(getTheme());
    // event listener for theme toggling
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target?.matches(`button[data-theme-toggle]`)) {
        const theme = target.dataset.themeToggle;
        if (theme === "light" || theme === "dark") {
          startViewTransition(() => setTheme(theme));
        }
      }
    });
  };
  // set up on first pageload
  setUpThemeScripts();
  // run the setup function when the page is swapped (view transitions)
  // https://docs.astro.build/en/guides/view-transitions/#astroafter-swap
  // see more: https://github.com/withastro/astro/issues/7765
  document.addEventListener("astro:after-swap", setUpThemeScripts);
}
