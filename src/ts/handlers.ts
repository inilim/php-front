import { appInit } from "./initPhp";

export function output(event: CustomEvent) {
    console.log('[php-app] output event.detail', event.detail);
}

export function error(event: CustomEvent) {
    console.log('[php-app] error event.detail', event.detail);
}

export function ready(event: CustomEvent) {
    console.log("[php-app] import php done");
    appInit();
}