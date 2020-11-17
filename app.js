//
// Create wrappers to call back into
//
const CopilotMainAppOrignURL = (process.env.NODE_ENV !== "production" && (!process.env.COPILOT_LIVE)) ? "http://localhost:8070" : "https://copilot.gg";
const CopilotVersion = "1.0";

class PostMessageManager {
    constructor(windowEl, origin) {

        // This app window
        this._window = windowEl;

        // This browser window
        this._contentWindow = null;

        this._origin = origin;
        this._handles = {};
        this._window.addEventListener('message', (data) => this._onMessage(data), false);
    }

    _onMessage(event) {
        if (event.origin !== this._origin) {
            console.error("[postmessage] Denied message from invalid origin " + event.origin);
            return;
        }

        if (!event.data) {
            return;
        }

        this.fire(event.data.type, event.data);
    }

    on(name, fn) {
        if (!this._handles[name]) {
            this._handles[name] = [];
        }
        this._handles[name].push(fn);
    }

    setContentWindow(contentWindow) {
        this._contentWindow = contentWindow;
    }

    fire(name, data) {
        if (this._handles[name]) {
            for (var i in this._handles[name]) {
                this._handles[name][i](data);
            }
        }
    }

    post(name, data = {}) {
        this._contentWindow.postMessage(Object.assign(data, { type: name }), this._origin); 
    }
}

class TaskbarManager {
    constructor(nwWin) {
        this._win = nwWin;
        this._tray = null;
        this._win.on('close', () => {
            this._win.minimize();
        });

        this._win.on('minimize', () => {
            this._win.hide();
            this._tray = new nw.Tray({ icon: "assets/copilot.png" });

            var menu = new nw.Menu();
            menu.append(new nw.MenuItem({
                type: 'normal',
                label: 'Quit',
                click: () => {
                    this._win.close(true);
                }
            }));
            this._tray.menu = menu;


            this._tray.on('click', () => {
                this._win.show();
                this._tray.remove();
                this._tray = null;
            });
        });
    }
}

window.addEventListener('load', () => {
    //
    // Load in the application
    //
    var browser = document.getElementById('browser');
    console.log('app:load');

    var taskbarManager = new TaskbarManager(nw.Window.get());
    let messageManager = new PostMessageManager(window, CopilotMainAppOrignURL);
    browser.src = `${CopilotMainAppOrignURL}/dashboard/settings`;

    browser.addEventListener('consolemessage', (event) => {
        console.log(event.message);
    });

    browser.addEventListener('contentload', () => {
        messageManager.setContentWindow(browser.contentWindow);
        messageManager.post('extension-init', { version: CopilotVersion } );
    });

    messageManager.on('native-active', (data) => {
        console.log("NativeActive: ", data);
    });

    messageManager.on('native-download-update', (data) => {
        // Sanity check
        if (!isNaN(data.version) && data.version.toString().indexOf('.') != -1) {
            console.log("NativeDownloadUpdate: " + data.version);
            nw.Shell.openExternal("https://github.com/copilotgg/native/releases");
            nw.Window.get().close(true);
        }
    });
})