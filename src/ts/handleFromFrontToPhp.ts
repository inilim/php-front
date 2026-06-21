import { getPhp, phpExecWithArg } from "./initPhp";

type PromiseAny = Promise<any>;

// @INFO тут функции которые из ФРОНТА вызывают PHP логику

export function clickTabCommonHandle(event: Event): void {
    phpExecWithArg((keyMap) => {
        // App\EventHandle\ClickTabCommonHandle
        return getPhp().exec(
            `\\App\\EventHandle\\ClickTabCommonHandle::invoke("${keyMap}")`,
        );
    }, event);
}

export function clickBtnCommonHandle(event: Event): void {
    phpExecWithArg((keyMap) => {
        // App\EventHandle\ClickTabCommonHandle
        return getPhp().exec(
            `\\App\\EventHandle\\ClickBtnCommonHandle::invoke("${keyMap}")`,
        );
    }, event);
}