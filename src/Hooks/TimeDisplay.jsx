// components/TimeDisplay.js
const TimeDisplay = ({ isoString,inputcss }) => {
  const date = new Date(isoString);
  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return <span className = {inputcss}>{timeString}</span>;
};

export default TimeDisplay;
