import { useEffect, useState } from "react";

function getMinuteDate() {
  const now = new Date();
  now.setSeconds(0, 0);
  return now;
}

export function useCurrentMinute() {
  const [currentMinute, setCurrentMinute] = useState(getMinuteDate);

  useEffect(() => {
    const update = () => setCurrentMinute(getMinuteDate());
    const now = new Date();
    const delayToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    let interval: ReturnType<typeof setInterval> | undefined;

    const timeout = setTimeout(() => {
      update();
      interval = setInterval(update, 60000);
    }, delayToNextMinute);

    return () => {
      clearTimeout(timeout);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return currentMinute;
}
