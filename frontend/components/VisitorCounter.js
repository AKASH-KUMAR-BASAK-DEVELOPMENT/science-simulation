"use client";

import { useEffect, useState } from "react";

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/visits/count")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setCount(data.total);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <span className="visitor-counter" title="Total site visits">
      👁 {count.toLocaleString()} visits
    </span>
  );
}
