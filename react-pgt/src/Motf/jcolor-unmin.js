const main = function (a) {
    "use strict";
    function b(a, b, c) {
	return Math.max(Math.min(a, c), b);
    }function c(a) {
	return a.toFixed(2);
    }function d(a) {
	return (255 * a | 0) + "";
    }function e(a) {
	return (360 * a | 0) + "";
    }function f(a) {
	return (100 * a).toFixed(2) + "%";
    }function g(a, b, c) {
	var d,
	    e = c ? b.split("").map(function (a) {
		return n[a](u[a]);
	    }) : b.split(""),
	    f = b.indexOf(a),
	    g = [],
	    h = v[a];for (d = 0; h > d; ++d) {
		var i = d / (h - 1);e[f] = n[a](i);var j = q ? b + "(" + e.join().toUpperCase() + ")" : '<stop stop-color="' + b + "(" + e.join().toUpperCase() + ')" offset="' + i + '"/>';g.push(j);
	    }return g = g.join(q ? "," : ""), function (b) {
		var c = g;for (var d in b) {
		    d === a || (c = c.replace(m[d], n[d](b[d])));
		}if (q) return "linear-gradient(to right, " + c + ")";var e = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none"><linearGradient id="the-gradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">' + c + '</linearGradient><rect x="0" y="0" width="1" height="1" fill="url(#the-gradient)" /></svg>';return "url(data:image/svg+xml;base64," + l(e) + ")";
	    };
    }function h(a) {
	function b(a, b, c) {
	    return 0 > c && (c += 1), c > 1 && (c -= 1), 1 / 6 > c ? a + 6 * (b - a) * c : .5 > c ? b : 2 / 3 > c ? a + (b - a) * (2 / 3 - c) * 6 : a;
	}if ("r" in a) return a;var c,
	d,
	e,
	f = a.h,
	g = a.s,
	h = a.l;if (0 === g) c = d = e = h;else {
	    var i = .5 > h ? h * (1 + g) : h + g - h * g,
		j = 2 * h - i;c = b(j, i, f + 1 / 3), d = b(j, i, f), e = b(j, i, f - 1 / 3);
	}var k = { r: c, g: d, b: e };return "a" in a && (k.a = a.a), k;
    }function i(a) {
	if ("h" in a) return a;var b,
	c,
	d = a.r,
	e = a.g,
	f = a.b,
	g = Math.max(d, e, f),
	h = Math.min(d, e, f),
	i = (g + h) / 2;if (g === h) b = c = 0;else {
	    var j = g - h;switch (c = i > .5 ? j / (2 - g - h) : j / (g + h), g) {case d:
										  b = (e - f) / j + (f > e ? 6 : 0);break;case e:
										  b = (f - d) / j + 2;break;case f:
										  b = (d - e) / j + 4;}b /= 6;
	}var k = { h: b, s: c, l: i };return "a" in a && (k.a = a.a), k;
    }function j(b, c) {
	var d,
	    e = {};if (b = b.toLowerCase(), !/^(rgb|hsl)a?$/i.test(b)) throw 'Color spaces must be any of the following: "rgb", "rgba", "hsl" or "hsla"';if ("string" == typeof c) {
		if (c = c.toLowerCase(), /^#[0-9a-f]{6}([0-9a-f]{2})?$/.test(c)) for (4 === b.length && 9 !== c.length && (c += "ff"), d = 1; d < c.length; d += 2) {
		    e[b[(d - 1) / 2]] = parseInt(c.substr(d, 2), 16) / 255;
		} else {
		    if (!/^(rgb|hsl)a?\([\d\s,.%]+\)$/.test(c)) throw 'Color strings must be hexadecimal (e.g. "#00ff00", or "#00ff00ff") or CSS style (e.g. rgba(0,255,0,1))';var f = c.match(/(rgb|hsl)a?/)[0],
		    g = c.match(/[\d.]+/g);/rgb/.test(f) ? (e.r = g[0] / 255, e.g = g[1] / 255, e.b = g[2] / 255) : (e.h = g[0] / 360, e.s = g[1] / 100, e.l = g[2] / 100), e.a = +g[3];
		}
	    } else {
		if (!a.isPlainObject(c)) throw "Unrecognized color format";var j = Object.keys(c).sort().join("");if (!/^a?(bgr|hls)$/i.test(j)) throw "Color objects must contain either r, g and b keys, or h, s and l keys. The a key is optional.";b.split("").sort().join("") !== j && (c = /rgb/.test("space") ? h(c) : i(c)), e = c;
	    }e = /rgb/.test(b) ? h(e) : i(e), isFinite(e.a) || (e.a = 1);for (var k in e) {
		if (e[k] < 0 || 1 < e[k]) throw "Color component out of range: " + k;
	    }this.getComponents = function () {
		return e;
	    }, this.getComponent = function (a) {
		return e[a];
	    }, this.setComponent = function (a, b) {
		e[a] = b;
	    }, this.getSpace = function () {
		return b;
	    };
    }function k(c, d) {
	function e(b, c) {
	    return a("<div>").addClass(b).appendTo(c);
	}function f(a, b, c, d) {
	    c && n.setComponent(c, d);for (var e = 0; e < G.length; ++e) {
		var f = G[e];f.css({ backgroundImage: f.data("template")(n.getComponents()) }).find(".handle").css({ left: 100 * n.getComponent(f.data("componentKey")) + "%" }), E.css({ backgroundColor: n.toCssString() }), m.displayColor && o.text(p());
	    }
	}var h = this,
	i = c.attr("class"),
	k = c.children().detach(),
	l = c.text();c.addClass("colorpicker").empty();var m = a.extend({ color: c.css("color"), colorSpace: "hsla", expandEvent: "mousedown touchstart", collapseEvent: "", staticComponents: !1 }, d),
	n = new j(m.colorSpace, m.color);c.addClass("componentcount-" + n.getSpace().length).toggleClass("show-labels", !!m.labels);var o,
	p,
	q = a(document),
	t = e("maximize-wrapper", c),
	u = e("inner-maximize-wrapper", t),
	v = e("ui-wrapper", u),
	D = e("display-wrapper", v),
	E = e("display", D),
	F = e("slider-container", v),
	G = a.map(n.getSpace().split(""), function (a) {
	    var b = e("slider " + a, F);return e("handle", b).attr("data-component", a), b.data({ componentKey: a, template: g(a, n.getSpace(), m.staticComponents) }), b;
	});if (m.displayColor) {
	    if (!/^(hex|css)$/.test(m.displayColor)) throw 'Invalid displayColor value, should be "hex" or "css"';o = e("output-wrapper", u), p = { hex: n.toString, css: n.toCssString }[m.displayColor].bind(n, m.displayColorSpace || m.colorSpace);
	}c.on(B, f), setTimeout(f.bind(null, void 0, this), 0);var _H,
	I,
	J = function J(b) {
	    a(b.target).closest(c).length || I();
	};_H = function H() {
	    c.addClass("expanded").css({ zIndex: C });var b = 0;u.children().each(function () {
		b += a(this).outerHeight(!0);
	    }), u.css({ width: v.width(), height: b }), a(window).on(y, J), m.collapseEvent && c.on(m.collapseEvent, I), c.off(m.expandEvent, _H);var d = q.width(),
	    e = q.height(),
	    f = v.offset(),
	    g = Math.min(0, d - f.left - v.outerWidth(!0) - 10),
	    h = Math.min(0, e - f.top - v.outerHeight(!0) - 10);c.css("transform", "translate(" + g + "px, " + h + "px)");
	}, I = function I() {
	    r ? c.off(x).one(x, function () {
		c.css({ zIndex: "" });
	    }) : c.css({ zIndex: "" }), c.css({ zIndex: C - 1 }), u.css({ width: "", height: "" }), c.removeClass("expanded"), a(window).off(y, J), m.expandEvent && c.on(m.expandEvent, _H), c.css("transform", "");
	}, m.expandEvent && c.on(m.expandEvent, _H);var K = function K(c) {
	    var d = a(c.target);if (d.hasClass("slider")) {
		var e = s ? c.originalEvent.touches[0].clientX - a(c.target).offset().left : a.isNumeric(c.offsetX) ? c.offsetX : c.clientX - a(c.target).offset().left;d.trigger(B, [h, d.data("componentKey"), b(e / d.outerWidth(), 0, 1)]), c.preventDefault(), c.stopPropagation();
	    }
	},
	L = function L() {
	    a(window).off(z, K);
	};return c.on(y, function (b) {
	    var c = a(b.target);"mousedown" === b.type && b.button !== w || !c.hasClass("slider") || (K(b), a(window).on(z, K), a(window).one(A, L));
	}), this.destroy = function () {
	    a(window).off(A, L), a(window).off(z, K), a(window).off(y, J), c.off().empty().removeData("colorpicker").attr("class", i).html(k).text(l);
	}, this.toString = function () {
	    return n.toString.apply(n, arguments);
	}, this.toCssString = function () {
	    return n.toCssString.apply(n, arguments);
	}, this.toObject = function () {
	    return n.convertComponents.apply(n, arguments);
	}, this.getColorSpace = function () {
	    return n.getSpace();
	}, this.on = c.on.bind(c), this.off = c.off.bind(c), c.data("colorpicker", this), this;
    }var l = window.btoa || function (a) {
	for (var b, c, d, e = [], f = -1, g = a.length, h = [,,,]; ++f < g;) {
	    b = a.charCodeAt(f), c = a.charCodeAt(++f), h[0] = b >> 2, h[1] = (3 & b) << 4 | c >> 4, isNaN(c) ? h[2] = h[3] = 64 : (d = a.charCodeAt(++f), h[2] = (15 & c) << 2 | d >> 6, h[3] = isNaN(d) ? 64 : 63 & d), e.push(t.charAt(h[0]), t.charAt(h[1]), t.charAt(h[2]), t.charAt(h[3]));
	}return e.join("");
    },
    m = { r: /R/g, g: /G/g, b: /B/g, h: /H/g, s: /S/g, l: /L/g, a: /A/g },
    n = { r: d, g: d, b: d, h: e, s: f, l: f, a: c },
    o = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
    p = /MSIE [1-8]/.test(navigator.userAgent),
    q = !/MSIE 9.0/.test(navigator.userAgent),
    r = q,
    s = "ontouchstart" in document.documentElement || "ontouchstart" in window,
    t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    u = { r: 0, g: 0, b: 0, h: 0, s: 1, l: .5, a: 1 },
    v = { r: 2, g: 2, b: 2, h: 7, s: 2, l: 3, a: 2 },
    w = 0,
    x = o ? "webkitTransitionEnd" : "transitionend",
    y = s ? "touchstart" : "mousedown",
    z = s ? "touchmove" : "mousemove",
    A = s ? "touchend touchcancel" : "mouseup",
    B = "newcolor",
    C = 999999;j.prototype.convertComponents = function (b) {
	b = b || this.getSpace();var c = a.extend({}, this.getComponents());if (new RegExp(b).test(this.getSpace())) return 3 === b.length && delete c.a, c;if (c = /rgb/.test(b) ? h(c) : i(c), /a/.test(b)) {
	    var d = this.getComponent("a");c.a = "undefined" == typeof d ? 1 : d;
	}return c;
    }, j.prototype.componentsToString = function (a, b) {
	function c(a) {
	    return (1 === a.length ? "0" : "") + a;
	}for (var d = "#", e = 0; e < b.length; ++e) {
	    d += c(Math.floor(255 * a[b[e]]).toString(16));
	}return d;
    }, j.prototype.toString = function (a) {
	return a = a || this.getSpace(), this.componentsToString(this.convertComponents(a), a);
    }, j.prototype.componentsToCssValuesString = function (a, b) {
	for (var c = [], d = 0; d < b.length; ++d) {
	    var e = b[d];c.push(n[e](a[e]));
	}return c.join(", ");
    }, j.prototype.toCssString = function (a) {
	return a = a || this.getSpace(), a + "(" + this.componentsToCssValuesString(this.convertComponents(a), a) + ")";
    }, a.fn.colorpicker = function (a) {
	if (p) throw "Colorpicker does not work with your browser";var b = this.eq(0);if (!b.length) throw "No element matched";return b.data("colorpicker") || new k(b, a);
    };
};

export default main;
