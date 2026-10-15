
"use client";

import { useEffect, useRef } from "react";

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptSrc = "https://elfsightcdn.com/platform.js";

    // Avoid loading the Elfsight script multiple times
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptSrc}"]`
    );

    if (!script) {
      script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }

    const removeWatermark = () => {
      const widgetDiv = containerRef.current?.querySelector(
        '[class^="elfsight-app-"]'
      );

      const shadowRoot = widgetDiv?.shadowRoot;

      if (!shadowRoot) return;

      const elements = shadowRoot.querySelectorAll(
        'a[href*="elfsight.com"], [style*="z-index: 999999"]'
      );

      elements.forEach((element) => element.remove());
    };

    const observer = new MutationObserver(removeWatermark);

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();

      // Do not remove a shared script that other widgets may use
    };
  }, []);

  return (
    <section
      className="section testimonials"
      id="testimonials"
      style={{
        paddingTop: "0",
        marginTop: "0",
        paddingBottom: "40px",
      }}
    >
      <div
        className="container"
        style={{
          paddingTop: "0",
          marginTop: "0",
        }}
      >
        <div
          className="section-head reveal"
          style={{
            marginTop: "0",
            paddingTop: "0",
            marginBottom: "16px",
          }}
        >
          <div className="section-head-copy">
            <div className="eyebrow">Patient stories</div>
            <h2 style={{ marginTop: "4px", marginBottom: "8px" }}>
              In their own words.
            </h2>
          </div>

          <p style={{ marginTop: "0", marginBottom: "0" }}>
            Read the latest Google reviews from our patients.
          </p>
        </div>

        <div
          className="testimonials-widget"
          ref={containerRef}
          style={{
            marginTop: "0",
            paddingTop: "0",
          }}
        >
          <div
            className="elfsight-app-2326e4a5-e7e3-4893-a44d-6916ccb14033"
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  );
}
