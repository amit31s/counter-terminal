enum TimeUnits {
  MINUTES = "minutes",
  MINUTE = "minute",
  SECONDS = "seconds",
  SECOND = "second",
}

const timeUnits: { [key in TimeUnits]: string } = {
  minutes: "minutes",
  minute: "minute",
  seconds: "seconds",
  second: "second",
};

export const generateOutput = (
  minutesRemaining: number | null,
  secondsRemaining: number | null,
) => {
  const { minutes, seconds, second } = timeUnits;
  if (!minutesRemaining || !secondsRemaining)
    return {
      unitOfTime: null,
      timeRemaining: null,
    };
  if (minutesRemaining > 1) {
    return { unitOfTime: minutes, timeRemaining: minutesRemaining };
  }
  const unitOfTime = secondsRemaining === 1 ? second : seconds;
  return { unitOfTime, timeRemaining: secondsRemaining };
};
