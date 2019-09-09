const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "main.html"),
      protocol: "file:",
      slashes: true
    })
  );
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

let createAddWindow = () => {
  addWindow = new BrowserWindow({
    width: 200,
    height: 300,
    title: "Add Shopping List Item"
  });
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "add.html"),
      protocol: "file:",
      slashes: true
    })
  );

  ipcMain.on("item:add", (e, item) => {
    console.log(item);
    mainWindow.webContents.send("item:add", item);
    // addWindow.close();
  });

  mainWindow.on("close", () => {
    app.quit();
  });

  addWindow.on("close", () => {
    addWindow = null;
  });
};

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddWindow();
        }
      },
      {
        label: "Clear Items",
        click() {
          mainWindow.webContents.send("item:clear");
        }
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.platform == "darwin") mainMenuTemplate.unshift({});

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
