/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Icontroller,
    IvariableEffect,
    IvirtualNode,
    variableBind,
    navigateTo,
    elementObserver,
    elementObserverOff,
    elementObserverOn,
    writeCookie,
    readCookie,
    removeCookie,
    writeStorage,
    readStorage,
    removeStorage
} from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelExample from "../model/Example";
import viewExample from "../view/Example";

export default class Example implements Icontroller {
    // Variable
    private variableObject: modelExample.Ivariable;
    private methodObject: modelExample.Imethod;

    private elementDivTest: HTMLElement | null;
    private elementObserverTest: HTMLElement | null;
    private elementCookieRead: HTMLElement | null;

    // Method
    private onClickLink = (pagePath: string): void => {
        navigateTo(pagePath);
    };

    private onClickCount = (): void => {
        this.variableObject.count.state += 1;
    };

    private onClickElementHook = (): void => {
        if (this.elementDivTest) {
            this.elementDivTest.innerText = "Novum exemplum textus.";
        }
    };

    private onClickVariableWatchTest = (): void => {
        this.variableObject.variableWatchTest.state = "Exemplum textus.";
    };

    private actionVariableWatchTest = (): void => {
        alert("actionWatchTest");
    };

    private statusElmentObserverTest = (): void => {
        if (this.elementDivTest) {
            elementObserver(this.elementDivTest, (element, change) => {
                elementObserverOff(element);

                if (change.type === "childList" && this.elementObserverTest) {
                    this.elementObserverTest.innerText = "jsmvcfw-elementHookName is changed.";
                }

                elementObserverOn(element);
            });
        }
    };

    private onClickWriteCookie = (): void => {
        writeCookie<string>("test", "1");
    };

    private onClickReadCookie = (): void => {
        const result = readCookie<string>("test");

        if (this.elementCookieRead && result) {
            this.elementCookieRead.innerText = result;
        }
    };

    private onClickRemoveCookie = (): void => {
        removeCookie("test");

        if (this.elementCookieRead) {
            this.elementCookieRead.innerText = "";
        }
    };

    constructor() {
        this.variableObject = {} as modelExample.Ivariable;
        this.methodObject = {} as modelExample.Imethod;

        this.elementDivTest = null;
        this.elementObserverTest = null;
        this.elementCookieRead = null;
    }

    elementHookObject = {} as modelExample.IelementHook;

    variable(): void {
        this.variableObject = variableBind(
            {
                count: 0,
                variableWatchTest: ""
            },
            this.constructor.name
        );

        this.methodObject = {
            onClickLink: this.onClickLink,
            onClickCount: this.onClickCount,
            onClickElementHook: this.onClickElementHook,
            onClickVariableWatchTest: this.onClickVariableWatchTest,
            onClickWriteCookie: this.onClickWriteCookie,
            onClickReadCookie: this.onClickReadCookie,
            onClickRemoveCookie: this.onClickRemoveCookie
        };
    }

    variableEffect(watch: IvariableEffect): void {
        watch([
            {
                list: ["variableWatchTest"],
                action: () => {
                    this.actionVariableWatchTest();
                }
            }
        ]);
    }

    view(): IvirtualNode {
        return viewExample(this.variableObject, this.methodObject);
    }

    event(): void {}

    subControllerList(): Icontroller[] {
        const resultList: Icontroller[] = [];

        return resultList;
    }

    rendered(): void {
        this.elementDivTest = this.elementHookObject.elementDivTest;
        this.elementObserverTest = this.elementHookObject.elementObserverTest;
        this.elementCookieRead = this.elementHookObject.elementCookieRead;

        this.statusElmentObserverTest();
    }

    destroy(): void {}
}
