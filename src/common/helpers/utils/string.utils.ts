export function RandomString(length: number): string {
  return Array.from({ length }, () =>
    Math.random().toString(36).charAt(2),
  ).join('');
}


export function RandomNumberString(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10).toString()).join('');
}

export function removeTrailingSlash(str: string): string {
  return str.replace(/\/+$/, '');
}

export function capitalizeFirstChar(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
