document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const vr = document.querySelector(".vr");

  const numTriggers = 400;

  for (let i = 0; i < numTriggers; i++) {
    const trigger = document.createElement("div");
    trigger.classList.add("trigger");
    container.insertBefore(trigger, container.firstChild);
  }

  const numLayers = 20;
  for (let i = 0; i < numLayers; i++) {
    const vrLayer = document.createElement("div");
    vrLayer.classList.add("vr_layer");

    const vrLayerItem = document.createElement("div");
    vrLayerItem.classList.add("vr_layer_item");

    vrLayer.appendChild(vrLayerItem);

    vr.appendChild(vrLayer);
  }

  const vrLayers = document.querySelectorAll(".vr_layer");

  vrLayers.forEach((layer, index) => {
    const translateZValue = (20 - index) * 17.5;
    const animationDelayValue = -210 * (index + 1);

    layer.style.transform = `translateZ(${translateZValue - 100}px)`;
    layer.querySelector(
      ".vr_layer_item"
    ).style.animationDelay = `${animationDelayValue}ms`;
  });
});
