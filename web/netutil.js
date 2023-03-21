
/**
 * errorHandler is called on network error or HTTP code != 2xx. Otherwise successHandler
 * is called.
 */
function httpGet(uri, params, successHandler, errorHandler) {
    fetch(uri)
       .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        const contentType = response.headers.get("content-type");
        if (contentType && isContentTypeJson(contentType)) {
            return response.json().then(data => { successHandler(true, data); });
        } else {
            return response.text().then(text => { successHandler(false, text); });
        }
        })
        .catch((error) => {
            console.log("fetch returned error from uri " + uri, error);
            errorHandler();
        });
}

function isContentTypeJson(contentType) {
    if (contentType.indexOf("application/json") !== -1) return true;
    if (contentType.indexOf("application/hal+json") !== -1) return true;
    return false;
}