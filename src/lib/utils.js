export function slugify(input) {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function combineDateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  // Postgres `time` columns come back as "HH:MM:SS" (with seconds), not "HH:MM".
  // Slice to "HH:MM" before appending our own ":00" seconds, otherwise the
  // result is "...T18:30:00:00" which is an invalid date string and produces NaN.
  const time = timeStr && /^\d{2}:\d{2}/.test(timeStr) ? timeStr.slice(0, 5) : '00:00';
  const date = new Date(`${dateStr}T${time}:00`);
  return isNaN(date.getTime()) ? null : date;
}

export function formatDateLong(dateStr, locale = 'uz-UZ') {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T00:00:00`);
  try {
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr.slice(0, 5);
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(' ');
}
