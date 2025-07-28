import moment from 'moment';

export function FormatTime(updateAtUser, isOnline) {
  const lastOnline = moment(updateAtUser);
  const now = moment();
  const diffMillis = now - lastOnline;
  const duration = moment.duration(diffMillis);

  if (isOnline) {
    return "Active now";
  } else if (duration.asMinutes() < 60) {
    const mins = Math.floor(duration.asMinutes());
    return `Online ${mins} min ago`;
  } else if (duration.asHours() < 24) {
    const hours = Math.floor(duration.asHours());
    return `Online ${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (duration.asHours() < 48) {
    return "Yesterday";
  } else {
    return `Online at ${lastOnline.format("DD/MM/YYYY")}`;
  }
}
