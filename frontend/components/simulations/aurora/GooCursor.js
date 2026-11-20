"use client";

import { useEffect, useRef } from "react";

export default function GooCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer:fine)").matches;
    const dot = dotRef.current, ring = ringRef.current;
    if (!(dot && ring && fine && !reduce)) {
      if (dot) dot.style.display = "none";
      if (ring) ring.style.display = "none";
      return;
    }
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };
    window.addEventListener("mousemove", onMove);
    function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    }
    loop();
    const onOver = (e) => {
      if (e.target.closest("[data-cursor], a, button")) ring.classList.add("grow");
      if (e.target.closest("[data-cursor-drag]")) ring.classList.add("drag");
    };
    const onOut = (e) => {
      if (e.target.closest("[data-cursor], a, button")) ring.classList.remove("grow");
      if (e.target.closest("[data-cursor-drag]")) ring.classList.remove("drag");
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cur-ring" ref={ringRef} aria-hidden="true"></div>
      <div className="cur-dot" ref={dotRef} aria-hidden="true"></div>
    </>
  );
}
