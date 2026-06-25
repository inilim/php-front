import { getObjPhp, phpExecWithArg } from "./initPhp";

type PromiseAny = Promise<any>;

// @INFO тут функции которые из ФРОНТА по событиям вызывают PHP логику

export function clickTabCommonHandle(event: Event): void {
    phpExecWithArg((keyMap) => {
        // App\EventHandle\ClickTabCommonHandle
        return getObjPhp().exec(
            `\\App\\EventHandle\\ClickTabCommonHandle::invoke("${keyMap}")`,
        );
    }, event);
}

export function clickBtnCommonHandle(event: Event): void {
    phpExecWithArg((keyMap) => {
        // App\EventHandle\ClickTabCommonHandle
        return getObjPhp().exec(
            `\\App\\EventHandle\\ClickBtnCommonHandle::invoke("${keyMap}")`,
        );
    }, event);
}