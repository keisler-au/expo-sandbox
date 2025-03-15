import * as Sentry from "sentry-expo";

class RequestService {
  static FAILED_CONNECTION =
    "We failed to connect to the server. Please try again.";
  static NOT_FOUND =
    "The entry used did not connect, please check it is correct and try again.";
  static WEBSOCKET_FAILURE =
    "We failed to connect to the server. If the issue re-occurs please report it via Settings";

  static async sendRequest(url: string, data: any) {
    let response;
    let error: boolean | string = false;
    // TODO: TESTING
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      response = await fetch(url, {
        signal: controller.signal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      clearTimeout(timeoutId);
    } catch (e: any) {
      Sentry.Native.captureException(e);
      error = this.FAILED_CONNECTION;
    }

    if (response?.status === 404) error = this.NOT_FOUND;
    if (response?.status === 400) error = this.FAILED_CONNECTION;

    return { response, error };
  }
}

export default RequestService;
