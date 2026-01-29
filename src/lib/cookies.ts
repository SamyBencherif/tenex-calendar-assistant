export const setCookie = (name: string, value: string, seconds: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (seconds * 1000));
  const expires = "; expires=" + date.toUTCString();
  // Using Secure and SameSite=Strict for security. 
  // Note: Secure requires HTTPS, but works on localhost in most browsers.
  document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure; SameSite=Strict";
};

export const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=Strict';
};
