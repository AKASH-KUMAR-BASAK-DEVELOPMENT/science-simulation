"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const Toast = forwardRef(function Toast(_props, ref) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    show(text, ms = 2600) {
      setMsg(text);
      setShow(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShow(false), ms);
    },
  }));

  return (
    <div className={"toast" + (show ? " show" : "")} role="status" aria-live="polite">
      {msg}
    </div>
  );
});

export default Toast;
