import { useEffect, useRef, useState } from "react";

/**
 * Custom Hook: useChartContainer
 * Memastikan Recharts container memiliki ukuran valid sebelum render.
 * Menghindari error "width(-1)" atau "height(-1)".
 */
export default function useChartContainer() {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current && ref.current.offsetWidth > 0) {
        setReady(true);
      }
    };

    // Tunggu layout stabil dulu
    const timer = setTimeout(handleResize, 200);

    const ro = new ResizeObserver(handleResize);
    if (ref.current) ro.observe(ref.current);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  return { ref, ready };
}
