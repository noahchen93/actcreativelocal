export function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    element.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  const startY = window.scrollY;
  element.scrollIntoView({ behavior: "smooth", block: "start" });

  window.setTimeout(() => {
    const targetTop = element.getBoundingClientRect().top;
    const hasStarted = Math.abs(window.scrollY - startY) > 2;
    const isAlreadyNearTop = targetTop >= 80 && targetTop <= window.innerHeight * 0.45;

    if (!hasStarted && !isAlreadyNearTop) {
      element.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, 160);
}
