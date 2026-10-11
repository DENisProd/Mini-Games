// Адрес бэкенда можно задать через VITE_API_URL, по умолчанию — тот же хост, порт 8080
export const host: string = import.meta.env.VITE_API_URL ?? `${window.location.protocol}//${window.location.hostname}:8080`;
