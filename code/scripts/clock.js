let is12HourFormat = true;

function updateClock() {
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: is12HourFormat,
  };
  document.getElementById("clock").textContent = new Intl.DateTimeFormat(
    [],
    options
  ).format(now);
}

function toggleClockFormat() {
  is12HourFormat = !is12HourFormat;
  updateClock();
}

setInterval(updateClock, 1000);
updateClock();
