export function setCookie(
  cn: string,
  cv: string,
  expireDays?: number,
  opts?: {
    path?: string;
    domain?: string;
    secure?: boolean;
  },
): string {
  let expire;
  if (typeof expireDays === "number") {
    expire = new Date();
    expire.setDate(expire.getDate() + expireDays);
  }
  opts = opts || {};
  return (document.cookie = [
    escape(cn),
    "=",
    escape(cv),
    expire ? "; expires=" + expire.toUTCString() : "", // use expires attribute, max-age is not supported by IE
    opts.path ? "; path=" + opts.path : "",
    opts.domain ? "; domain=" + opts.domain : "",
    opts.secure ? "; secure" : "",
  ].join(""));
}
