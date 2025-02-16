import { Builder, By, until, WebDriver, logging } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

describe('Google Search', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // Configure logging preferences
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    prefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .setLoggingPrefs(prefs)
      .build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('should navigate to Google and validate the title', async () => {
    // Navigate to Google
    console.log('Navigating to Google');
    await driver.get('https://www.google.com');

    // Wait for the title to be present
    console.log('Waiting for the title to contain "Google"');
    await driver.wait(until.titleContains('Google'), 1000);

    // Check if the reject-all button is present
    const rejectAllButtonLocator = await driver.findElements(By.xpath(`//div[text()='Reject all']/..`)); // Safe way to search for element
    if (rejectAllButtonLocator.length > 0) await rejectAllButtonLocator[0].click();

    // Find the search box element and interact with it
    console.log('Finding the search box element');
    const searchBox = await driver.findElement(By.name('q'));
    await driver.wait(until.elementIsEnabled(searchBox), 1000);
    console.log('Typing "WebDriver" into the search box');
    await searchBox.click();
    await searchBox.sendKeys('WebDriver');

    // Submit the search form
    console.log('Submitting the search form');
    await searchBox.submit();

    // Wait for the results page to load and display the results
    console.log('Waiting for the results page to load');
    await driver.wait(until.titleContains('WebDriver'), 1000);

    // Validate the title contains 'WebDriver'
    console.log('Validating the title contains "WebDriver"');
    const title = await driver.getTitle();
    expect(title).toContain('WebDriver');
  });
});