
/**
 * errorHandler is called on network error or HTTP code != 2xx. Otherwise successHandler
 * is called.
 */
function httpGet(uri, params, successHandler, errorHandler) {
    // GET is default for fetch
    fetch(uri)
       .then(response => {
           processResponse(response, successHandler);
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

function processResponse(response, successHandler) {
    if (!response.ok) {
        throw new Error("Network response was not OK");
    }
    const contentType = response.headers.get("content-type");
    if (contentType && isContentTypeJson(contentType)) {
        response.json().then(data => { successHandler(true, data); });
    } else {
        response.text().then(text => { successHandler(false, text); });
    }
}

/**
 * From https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
async function httpPost(url, params, successHandler, errorHandler, data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        //mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        //redirect: 'follow', // manual, *follow, error
        //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    processResponse(response, successHandler);
}

async function httpDelete(url, params, successHandler, errorHandler) {
    const response = await fetch(url, {
        method: 'DELETE',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
    processResponse(response, successHandler);
}