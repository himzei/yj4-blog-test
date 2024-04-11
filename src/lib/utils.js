export function formatToTimeAgo(date) {
  const formatter = new Intl.RelativeTimeFormat("ko");
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diffInMilliseconds = time - now;

  if (Math.abs(diffInMilliseconds) < 1000 * 60 * 60) {
    // 1시간 이내
    const diffInMinutes = Math.ceil(diffInMilliseconds / (1000 * 60));
    return formatter.format(diffInMinutes, "minutes");
  } else if (Math.abs(diffInMilliseconds) < 1000 * 60 * 60 * 24) {
    // 1일 이내
    const diffInHours = Math.ceil(diffInMilliseconds / (1000 * 60 * 60));
    return formatter.format(diffInHours, "hours");
  } else if (Math.abs(diffInMilliseconds) < 1000 * 60 * 60 * 24 * 3) {
    // 3일이내
    const diffInThreeDays = Math.ceil(
      diffInMilliseconds / (1000 * 60 * 60 * 24)
    );
    return formatter.format(diffInThreeDays, "day");
  } else {
    // 3일이상
    return date.substr(0, 10);
  }
}
