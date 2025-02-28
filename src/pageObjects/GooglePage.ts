import { WebDriver, By, until, WebElement } from 'selenium-webdriver';

/**
 * Page object for the Google homepage
 */
class GooglePage {
    private driver: WebDriver;
    private url: string = 'https://www.google.com';

    private searchBoxLocator: By = By.name('q');

    constructor(driver: WebDriver) {
        this.driver = driver;
    }

    /**
     * Open the page using the class url property
     */
    async open(): Promise<void> {
        await this.driver.get(this.url);
        await this.tryAcceptCookies();
    }

    /**
     * Get the current page title
     * @returns the current page title as a string
     */
    async getTitle(): Promise<string> {
        return await this.driver.getTitle();
    }

    /**
     * Check for the presence of the "Reject all" button and click it if it exists
     */
    async tryAcceptCookies(): Promise<void> {
        const rejectAllButtonLocator = await this.driver.findElements(By.xpath(`//div[text()='Reject all']/..`));
        if (rejectAllButtonLocator.length > 0) await rejectAllButtonLocator[0].click();
    }

    /**
     * Select the searchbox, enter a search query, and submit
     * @param query the search query to enter and submit
     */
    async searchStringAndSubmit(query: string): Promise<void> {
        const searchBox: WebElement = await this.driver.findElement(this.searchBoxLocator);
        await this.driver.wait(until.elementIsEnabled(searchBox), 3000);
        await searchBox.click();
        await searchBox.sendKeys(query);
        await searchBox.submit();
    }

    /**
     * Wait for the page title to contain an expected string
     * @param expectedString the string to wait for in the page title
     */
    async waitForTitleToContain(expectedString: string): Promise<void> {
        console.log('Waiting for the title to contain', expectedString);
        await this.driver.wait(until.titleContains(expectedString), 5000);
    }
}

export default GooglePage;