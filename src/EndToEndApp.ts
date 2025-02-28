import { Builder, WebDriver, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import TestContext from './utils/TestContext';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { squashString } from './utils/StringUtils';

declare global {
  let testContext: TestContext;
}

class EndToEndApp {
    private driver!: WebDriver;
    private prefs: logging.Preferences;
    private screenshotIntervalId: NodeJS.Timeout | null = null;
    private isDriverActive: boolean = false;

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
        this.isDriverActive = true;
    }

    /**
     * Get the current WebDriver instance
     * @returns The current webdriver instance. If the test is a retry the driver will be wrapped in a proxy that captures screenshots for video generation
     */
    async getDriver(): Promise<WebDriver> {
        if (!this.driver) {
            await this.startDriver();
        }
        if (process.env.RECORD_VIDEO === 'true') {
            await this.startScreenshotCapture(testContext);
        }
        return this.driver;
    }

    async stopDriver(): Promise<void> {
        this.isDriverActive = false;
        if (this.screenshotIntervalId) {
            clearInterval(this.screenshotIntervalId);
            this.screenshotIntervalId = null;
        }
        await this.driver.quit();
        if(process.env.RECORD_VIDEO === 'true') {
            this.generateVideoFromFrames(testContext);
        }
    }

    async startScreenshotCapture(testContext: TestContext): Promise<void> {
        // Clear any existing interval first to prevent memory leaks
        if (this.screenshotIntervalId) {
            clearInterval(this.screenshotIntervalId);
            this.screenshotIntervalId = null;
        }

        const videoDirectory = 'video';
        const trimmedTestName = squashString(testContext.testName);
        const framesDirectory = `${videoDirectory}/${trimmedTestName}`;

        if (!fs.existsSync(videoDirectory)) {
            fs.mkdirSync(videoDirectory);
        }

        if (!fs.existsSync(framesDirectory)) {
            fs.mkdirSync(framesDirectory);
        }

        this.screenshotIntervalId = setInterval(async () => {
            if (this.isDriverActive) {
                await this.driver.takeScreenshot().then((screenshotData) => {
                    const timestamp = Date.now();
                    const screenshotPath = path.join(framesDirectory, `screenshot-${timestamp}.png`);
                    fs.writeFileSync(screenshotPath, screenshotData, 'base64');
                    console.log(`Screenshot captured: ${screenshotPath}`);
                }).catch((err) => {
                    console.error('Error taking screenshot:', err);
                });
            }
        }, 100); // Capture a screenshot every 100 milliseconds (adjust the interval as needed)
    }

    generateVideoFromFrames(testContext: TestContext): void {
        const generateVideoCommand = `ffmpeg -framerate 30 -pattern_type glob -i '*.png' -aspect 16/9 -c:v libx264 -pix_fmt yuv420p test_failure.mp4`;
        const videoDirectory = 'video';
        const trimmedTestName = squashString(testContext.testName);
        const framesDirectory = `${videoDirectory}/${trimmedTestName}`;

        if (fs.existsSync(framesDirectory)) {
            if (fs.readdirSync(framesDirectory).length === 0) {
                console.error(`No frames found in directory test: ${framesDirectory}`);
                return;
            }
        } else {
            console.error(`No frames found for test: ${testContext.testName} in directory ${framesDirectory}`);
            return;
        }

        try {
            execSync(generateVideoCommand, { cwd: framesDirectory, stdio: 'inherit' });
        } catch (error) {
            console.error('Error generating video: ', error);
        }

        try {
            this.deleteVideoFrames(trimmedTestName);
        } catch (error) {
            console.error('Error deleting video frames: ', error);
        }
    }

    deleteVideoFrames(testName: string): void {
        const videoDirectory = 'video';
        const trimmedTestName = testName.replace(/\s/g, "");
        const framesDirectory = `${videoDirectory}/${trimmedTestName}`;

        const files = fs.readdirSync(framesDirectory);
        files.forEach((file) => {
            if (path.extname(file) === '.png') {
                fs.unlinkSync(path.join(framesDirectory, file));
            }
        });
    }
}

export default EndToEndApp;