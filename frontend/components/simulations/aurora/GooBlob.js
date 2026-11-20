"use client";

import { useEffect, useRef } from "react";

export default function GooBlob() {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer:fine)").matches;
    const gooCursor = ref.current;
    const stage = document.getElementById("gooStage");
    if (!(stage && gooCursor && fine && !reduce)) {
      if (gooCursor) gooCursor.style.display = "none";
      return;
    }
    let tx = 0, ty = 0, cx = 0, cy = 0, inside = false, raf;
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      tx = e.clientX - r.left - r.width / 2;
      ty = e.clientY - r.top - r.height / 2;
      inside = true;
    };
    const onLeave = () => { inside = false; tx = 0; ty = 0; };
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    function follow() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      const scale = inside ? 1.15 : 0.6;
      gooCursor.style.transform = `translate(${cx}px, ${cy}px) scale(${scale})`;
      raf = requestAnimationFrame(follow);
    }
    follow();
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <span className="blob cursor" id="gooCursor" ref={ref}></span>;
}
