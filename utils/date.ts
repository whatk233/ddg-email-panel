export function getTimestamp() {
  return Math.round(Number(new Date()));
}

export function timestamp2ISO8601(ts: number) {
  try {
    return new Date(ts).toISOString();
  } catch {
    return "";
  }
}

export function iso8601Date() {
  return new Date().toISOString();
}

export function iso8601ToTimestamp(t: string) {
  return Math.round(Number(new Date(t)));
}
