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
    private elementStorageRead: HTMLElement | null;

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

        if (this.elementCookieRead) {
            this.elementCookieRead.innerText = "Created";
        }
    };

    private onClickReadCookie = (): void => {
        const result = readCookie<string>("test");

        if (this.elementCookieRead) {
            if (result) {
                this.elementCookieRead.innerText = result;
            } else {
                this.elementCookieRead.innerText = "";
            }
        }
    };

    private onClickRemoveCookie = (): void => {
        removeCookie("test");

        if (this.elementCookieRead) {
            this.elementCookieRead.innerText = "Removed";
        }
    };

    private onClickWriteStorage = (): void => {
        writeStorage<string>("test", "1");

        if (this.elementStorageRead) {
            this.elementStorageRead.innerText = "Created";
        }
    };

    private onClickReadStorage = (): void => {
        const result = readStorage<string>("test");

        if (this.elementStorageRead) {
            if (result) {
                this.elementStorageRead.innerText = result;
            } else {
                this.elementStorageRead.innerText = "";
            }
        }
    };

    private onClickRemoveStorage = (): void => {
        removeStorage("test");

        if (this.elementStorageRead) {
            this.elementStorageRead.innerText = "Removed";
        }
    };

    constructor() {
        this.variableObject = {} as modelExample.Ivariable;
        this.methodObject = {} as modelExample.Imethod;

        this.elementDivTest = null;
        this.elementObserverTest = null;
        this.elementCookieRead = null;
        this.elementStorageRead = null;
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
            onClickRemoveCookie: this.onClickRemoveCookie,
            onClickWriteStorage: this.onClickWriteStorage,
            onClickReadStorage: this.onClickReadStorage,
            onClickRemoveStorage: this.onClickRemoveStorage
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
        this.elementStorageRead = this.elementHookObject.elementStorageRead;

        this.statusElmentObserverTest();
    }

    destroy(): void {}
}
