import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 300, base: 100 },
  title: { min: 400, max: 900, base: 400 },
};

const Welcome = () => {
  const containerRef = useRef(null);

  // useGSAP with 'scope' handles cleanup and selection automatically
  useGSAP(() => {
    const setupEffect = (ref, type) => {
      const container = ref.current;
      if (!container) return;

      const letters = container.querySelectorAll(".anim-letter");
      const { base, max } = FONT_WEIGHTS[type];

      const onMouseMove = (e) => {
        const { left: containerLeft } = container.getBoundingClientRect();
        const mouseX = e.clientX - containerLeft;

        letters.forEach((letter) => {
          const { left: letterLeft, width } = letter.getBoundingClientRect();
          const center = letterLeft - containerLeft + width / 2;
          const distance = Math.abs(mouseX - center);
          
          // Gaussian distribution for smoothness
          const intensity = Math.exp(-(distance ** 2) / 20000); 
          const weight = base + (max - base) * intensity;

          gsap.to(letter, {
            fontVariationSettings: `'wght' ${weight}`,
            duration: 0.4,
            ease: "power2.out",
            overwrite: true, // CRITICAL: Stops old animations from fighting new ones
          });
        });
      };

      const onMouseLeave = () => {
        gsap.to(letters, {
          fontVariationSettings: `'wght' ${base}`,
          duration: 0.6,
          ease: "power3.out",
          overwrite: true,
        });
      };

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseleave", onMouseLeave);
    };

    setupEffect(titleRef, "title");
    setupEffect(subtitleRef, "subtitle");
  }, { scope: containerRef }); // Scoping helps GSAP find elements

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  const renderText = (text, className, baseWeight) =>
    [...text].map((char, i) => (
      <span
        key={i}
        className={`anim-letter ${className}`}
        style={{ 
          fontVariationSettings: `'wght' ${baseWeight}`, 
          display: "inline-block",
          willChange: "contents" // Optimization for variable font rendering
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section id="welcome" ref={containerRef} className="p-20">
      <p ref={subtitleRef} className="cursor-default">
        {renderText("Hey, I'm Shubhankar! Welcome to my", "text-3xl font-georama", 100)}
      </p>

      <h1 ref={titleRef} className="mt-7 cursor-default">
  {renderText("portfolio", "text-9xl italic font-georama", 400)}
</h1>
    </section>
  );
};

export default Welcome;