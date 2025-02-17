import { Builder, WebDriver, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

class EndToEndApp {
    private driver!: WebDriver;
    private prefs: logging.Preferences;

    constructor() {
    // Configure logging preferences
    this.prefs = new logging.Preferences();
    this.prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    this.prefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);
    }

    async startDriver(): Promise<void> {
    this.driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .setLoggingPrefs(this.prefs)
      .build();
    }
    
    async getDriver(): Promise<WebDriver> {
        if (!this.driver) {
          await this.startDriver();  
        }
        return this.driver;
    }

    async quitDriver(): Promise<void> {
        await this.driver.quit();
    }
}

export default EndToEndApp;
