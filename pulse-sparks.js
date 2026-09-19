(() => {
  let lastBurst = 0;

  function isMajorSuccess() {
    const points = document.querySelector(".card .date")?.textContent?.trim();
    return points === "5 points" || Boolean(document.querySelector(".bag-card.ready"));
  }

  function burst() {
    const hero = document.querySelector(".hero");
    if (!hero || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const now = Date.now();
    if (now - lastBurst < 350) return;
    lastBurst = now;
    hero.querySelector(".pulse-sparks")?.remove();
    const major = isMajorSuccess();
    const count = major ? 18 : 9;
    const layer = document.createElement("span");
    layer.className = `pulse-sparks${major ? " major" : ""}`;
    layer.setAttribute("aria-hidden", "true");
    for (let index = 0; index < count; index += 1) {
      const spark = document.createElement("i");
      spark.className = "pulse-spark";
      spark.style.setProperty("--angle", `${index * (360 / count) + (Math.random() * 14 - 7)}deg`);
      spark.style.setProperty("--delay", `${(index % 5) * 22}ms`);
      layer.appendChild(spark);
    }
    hero.appendChild(layer);
    setTimeout(() => layer.remove(), major ? 1250 : 1000);
  }

  const observer = new MutationObserver(records => {
    if (records.some(record => record.type === "attributes" && record.target.classList?.contains("reward"))) burst();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"], subtree: true });
})();
