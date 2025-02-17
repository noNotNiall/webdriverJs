import { WebDriver } from 'selenium-webdriver';
import EndToEndApp from '../src/EndToEndApp';
import GooglePage from '../src/pageObjects/GooglePage';

describe('Google Search', () => {
  let app: EndToEndApp;

  beforeAll(async () => {
    app = new EndToEndApp();
  });

  afterAll(async () => {
    await app.quitDriver();
  });

  test('Should navigate to Google and validate the title', async () => {
    const googlePage  = new GooglePage(await app.getDriver());
    console.log('Navigating to Google');
    await googlePage.open();
    await googlePage.waitForTitleToContain('Google');
    expect(await (await app.getDriver()).getTitle()).toContain('Google');
    await googlePage.searchStringAndSubmit('WebDriver');
    await googlePage.waitForTitleToContain('WebDriver');

    console.log('Validating the title contains "WebDriver"');
    expect(await googlePage.getTitle()).toContain('WebDriver');
  });
});