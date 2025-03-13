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
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
    } catch (e: any) {
      console.log(e.toString());
      error = this.FAILED_CONNECTION;
    }

    if (response?.ok) {
      response = await response.json();
      response.ok = true;
    }
    if (response?.ok === false) {
      if (response.status === 404) error = this.NOT_FOUND;
      if (response.status == 400) error = this.FAILED_CONNECTION;
    }

    return { response, error };
  }
}

export default RequestService;
