function doCryptEnc(data, callbackFn) {
    var enc = new TextEncoder("utf-8");
    var config = new Config();

    window.crypto.subtle.importKey(
        "raw", // raw format of the key - should be Uint8Array
        enc.encode(config.getAtZRanVal()),
        { // algorithm details
            name: "HMAC",
            hash: { name: "SHA-256" }
        },
        false, // export = false
        ["sign", "verify"] // what this key can do
    ).then(key => {
        window.crypto.subtle.sign(
            "HMAC",
            key,
            enc.encode(data)
        ).then(signature => {
            var b = new Uint8Array(signature);
            var str = Array.prototype.map.call(b, x => x.toString(16).padStart(2, '0')).join("");
            callbackFn(str);
        });
    });
}
