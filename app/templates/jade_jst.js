this["JST"] = this["JST"] || {};

this["JST"]["index"] = function anonymous(locals) {
jade.debug = [{ lineno: 1, filename: "app/templates/index.jade" }];
try {
var buf = [];
jade.debug.unshift({ lineno: 1, filename: jade.debug[0].filename });
jade.debug.unshift({ lineno: 1, filename: jade.debug[0].filename });
buf.push("<p style=\"text-align:center\">");
jade.debug.unshift({ lineno: undefined, filename: jade.debug[0].filename });
jade.debug.unshift({ lineno: 1, filename: jade.debug[0].filename });
buf.push("index view says hello");
jade.debug.shift();
jade.debug.shift();
buf.push("</p>");
jade.debug.shift();
jade.debug.shift();;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade.debug[0].filename, jade.debug[0].lineno,"p(style=\"text-align:center\") index view says hello");
}
};

this["JST"]["main"] = function anonymous(locals) {
jade.debug = [{ lineno: 1, filename: "app/templates/main.jade" }];
try {
var buf = [];
jade.debug.unshift({ lineno: 1, filename: jade.debug[0].filename });
jade.debug.unshift({ lineno: 1, filename: jade.debug[0].filename });
buf.push("<div style=\"text-align:center; margin-top:40px\">");
jade.debug.unshift({ lineno: undefined, filename: jade.debug[0].filename });
jade.debug.unshift({ lineno: 2, filename: jade.debug[0].filename });
buf.push("<img src=\"assets/imgs/exo-logo_120.png\"/>");
jade.debug.shift();
jade.debug.unshift({ lineno: 4, filename: jade.debug[0].filename });
buf.push("<h1 style=\"text-transform:uppercase\">");
jade.debug.unshift({ lineno: undefined, filename: jade.debug[0].filename });
jade.debug.unshift({ lineno: 4, filename: jade.debug[0].filename });
buf.push("exo-skeleton");
jade.debug.shift();
jade.debug.shift();
buf.push("</h1>");
jade.debug.shift();
jade.debug.unshift({ lineno: 5, filename: jade.debug[0].filename });
buf.push("<strong>");
jade.debug.unshift({ lineno: undefined, filename: jade.debug[0].filename });
jade.debug.unshift({ lineno: 5, filename: jade.debug[0].filename });
buf.push("project scaffolding that uses backbone and layoutmanager");
jade.debug.shift();
jade.debug.shift();
buf.push("</strong>");
jade.debug.shift();
jade.debug.unshift({ lineno: 7, filename: jade.debug[0].filename });
buf.push("<p>");
jade.debug.unshift({ lineno: undefined, filename: jade.debug[0].filename });
jade.debug.unshift({ lineno: 7, filename: jade.debug[0].filename });
buf.push("rendered at " + (jade.escape((jade.interp = new Date()) == null ? '' : jade.interp)) + "");
jade.debug.shift();
jade.debug.shift();
buf.push("</p>");
jade.debug.shift();
jade.debug.shift();
buf.push("</div>");
jade.debug.shift();
jade.debug.shift();;return buf.join("");
} catch (err) {
  jade.rethrow(err, jade.debug[0].filename, jade.debug[0].lineno,"div(style=\"text-align:center; margin-top:40px\")\n    img(src=\"assets/imgs/exo-logo_120.png\")\n\n    h1(style=\"text-transform:uppercase\") exo-skeleton\n    strong project scaffolding that uses backbone and layoutmanager\n\n    p rendered at #{new Date()}\n");
}
};