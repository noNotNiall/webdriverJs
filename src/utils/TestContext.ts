/**
 * A class to store the context of a test e.g. test name, whether it is a retry, and the maximum number of retries.
 */
class TestContext {
    testName: string;
    isRetry: boolean;
    maxRetries: number;

    constructor(testName: string, isRetry: boolean, maxRetries: number) {
        this.testName = testName;
        this.isRetry = isRetry;
        this.maxRetries = maxRetries;
    }
}

export default TestContext;