export function getCookie(key: string): string {
  const name = key + "=";
  const ca = document.cookie.split(";"),
    l = ca.length;
  for (let i = 0; i < l; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1);
    if (c.indexOf(name) != -1) return unescape(c.substring(name.length, c.length));
  }
  return "";
}
