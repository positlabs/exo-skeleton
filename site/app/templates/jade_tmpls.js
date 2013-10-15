this["JST"] = this["JST"] || {};

this["JST"]["app/templates/main"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),pageTitle = locals_.pageTitle;buf.push("<html lang=\"en\"><head><title>" + (jade.escape(null == (jade.interp = pageTitle) ? "" : jade.interp)) + "</title><script type=\"text/javascript\">if (foo) {\n   bar(1 + 5)\n}</script></head><body><h1>Jade - node template engine</h1></body></html>");;return buf.join("");
};