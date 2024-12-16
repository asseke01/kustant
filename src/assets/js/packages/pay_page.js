function get_query_params() {
    var params = new URLSearchParams(window.location.search);
    var payment_object = {};

    params.forEach(function(value, key) {
        payment_object[key] = decodeURIComponent(value);

        if (key == "auth") {
            payment_object[key] = JSON.parse(payment_object[key])
        }
    });

    return payment_object;
}

var payment_object = get_query_params();
halyk.pay(payment_object, function() {console.log("callback my js")})
