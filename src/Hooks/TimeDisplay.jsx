// components/TimeDisplay.js
import React from 'react';
import moment from 'moment';

const TimeDisplay = ({ isoString, inputcss }) => {
  console.log(isoString)
  if(!isoString)
    return 
  const lastOnline = moment(isoString);
  const now = moment();
  const diffMillis = now - lastOnline;
  const duration = moment.duration(diffMillis);

  let statusText = '';

  if(duration.asMinutes()<= 1) {
    statusText = "Current sent";
  }
  else if (duration.asMinutes() < 60 && duration.asMinutes()  > 1) {
    const mins = Math.floor(duration.asMinutes());
    statusText = `${mins} min ago`;
  } else if (duration.asHours() < 12) {
    const hours = Math.floor(duration.asHours());
    statusText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (duration.asHours() < 24) {
    const date = new Date(isoString);
    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    statusText = timeString;
  } else if (duration.asHours() < 48) {
    statusText = "Yesterday";
  } else {
    statusText = lastOnline.format("DD/MM/YYYY");
  }

  return <span className={inputcss}>{statusText}</span>;
};

export default TimeDisplay;
