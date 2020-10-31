const http = require('http');
const $jsdom = require("jsdom");
const moment = require("moment");
const fs = require('fs');

const { JSDOM } = $jsdom;

const $data = [];
const $host = `orsted.com`;
const $url = `https://${$host}`;

const options = {
    protocolPrefix: 'https://',
    host: 'www.bytecheck.com',
    path: `/results?resource=${encodeURI($url)}`
}

// if (process.platform === "win32") {
//     var rl = require("readline").createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });

//     rl.on("SIGINT", function () {
//         process.emit("SIGINT");
//     });
// }
  
  
process.on('SIGINT', function(i_should_exit) {
    process.exit();
});

const performRequest = (options, repeatInterval=5000) => {
    const request = http.request(options, function (res) {
        let data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        
        res.on('end', function () {
            const $dom = new JSDOM(data);
            const document = $dom.window.document;
            const pEl = document.querySelector("div#byte-check-content-type .byte-check-info-value");
            // console.log(pEl.textContent);
            let $rec = {};

            if(pEl) {
                $rec = {host: $host, date: new Date(), ttfb: pEl.textContent, ttfb_ms: parseInt(pEl.textContent)};
            } else {
                $rec = {host: $host, date: new Date(), ttfb: "0 ms", ttfb_ms: 0, error: `Could not get response.`};
            }
            const $ref = moment().format('MMDDYYYYHH');
            const $fileName = `./data/json/${$ref}.json`;
            console.log($fileName, $rec);
            fs.appendFileSync($fileName, `\r\n${JSON.stringify($rec)},`);
            if(repeatInterval) {
                setTimeout(() => performRequest(options), repeatInterval);
            }
        });
    });

    request.on('error', function (e) {
        console.log(`Error:`, e.message);
    });
    request.end();
};

performRequest(options);