declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function gtag(...args: any[]) {
  if (window && window.gtag) {
    window.gtag(...args);
  } else {
    console.warn('gtag ainda não disponível');
  }
}
