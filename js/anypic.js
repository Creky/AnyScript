function AnyPic(){
var _this=this;
var imagemaxwidth = '600';
var zoomstatus = parseInt(1);
var aimgcount = new Array();
var container=document.createElement("div");
container.setAttribute("id","append_parent");
document.body.appendChild(container);

////////////
var BROWSER = {};
var USERAGENT = navigator.userAgent.toLowerCase();
browserVersion({
	'ie': 'msie',
	'firefox': '',
	'chrome': '',
	'opera': '',
	'safari': '',
	'mozilla': '',
	'webkit': '',
	'maxthon': '',
	'qq': 'qqbrowser',
	'rv': 'rv'
});
if (BROWSER.safari || BROWSER.rv) {
	BROWSER.firefox = true;
}
BROWSER.opera = BROWSER.opera ? opera.version() : 0;
HTMLNODE = document.getElementsByTagName('head')[0].parentNode;
if (BROWSER.ie) {
	BROWSER.iemode = parseInt(typeof document.documentMode != 'undefined' ? document.documentMode : BROWSER.ie);
	HTMLNODE.className = 'ie_all ie' + BROWSER.iemode;
}
var JSLOADED = [];
var JSMENU = [];
JSMENU['active'] = [];
JSMENU['timer'] = [];
JSMENU['drag'] = [];
JSMENU['layer'] = 0;
JSMENU['zIndex'] = {
	'win': 200,
	'menu': 300,
	'dialog': 400,
	'prompt': 500
};
JSMENU['float'] = '';
var EXTRAFUNC = [],EXTRASTR = '';
EXTRAFUNC['showmenu'] = [];

function $$(id) {
	return !id ? null : document.getElementById(id);
}

function isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}

function getEvent() {
	if (document.all) return window.event;
	func = getEvent.caller;
	while (func != null) {
		var arg0 = func.arguments[0];
		if (arg0) {
			if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
				return arg0;
			}
		}
		func = func.caller;
	}
	return null;
}

function in_array(needle, haystack) {
	if (typeof needle == 'string' || typeof needle == 'number') {
		for (var i in haystack) {
			if (haystack[i] == needle) {
				return true;
			}
		}
	}
	return false;
}

function browserVersion(types) {
	var other = 1;
	for (i in types) {
		var v = types[i] ? types[i] : i;
		if (USERAGENT.indexOf(v) != -1) {
			var re = new RegExp(v + '(\\/|\\s|:)([\\d\\.]+)', 'ig');
			var matches = re.exec(USERAGENT);
			var ver = matches != null ? matches[2] : 0;
			other = ver !== 0 && v != 'mozilla' ? 0 : other;
		} else {
			var ver = 0;
		}
		eval('BROWSER.' + i + '= ver');
	}
	BROWSER.other = other;
}

function _attachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if (obj.addEventListener) {
		obj.addEventListener(evt, func, false);
	} else if (eventobj.attachEvent) {
		obj.attachEvent('on' + evt, func);
	}
}

function _detachEvent(obj, evt, func, eventobj) {
	eventobj = !eventobj ? obj : eventobj;
	if (obj.removeEventListener) {
		obj.removeEventListener(evt, func, false);
	} else if (eventobj.detachEvent) {
		obj.detachEvent('on' + evt, func);
	}
}

function fetchOffset(obj, mode) {
	var left_offset = 0,
		top_offset = 0,
		mode = !mode ? 0 : mode;
	if (obj.getBoundingClientRect && !mode) {
		var rect = obj.getBoundingClientRect();
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		if (document.documentElement.dir == 'rtl') {
			scrollLeft = scrollLeft + document.documentElement.clientWidth - document.documentElement.scrollWidth;
		}
		left_offset = rect.left + scrollLeft - document.documentElement.clientLeft;
		top_offset = rect.top + scrollTop - document.documentElement.clientTop;
	}
	if (left_offset <= 0 || top_offset <= 0) {
		left_offset = obj.offsetLeft;
		top_offset = obj.offsetTop;
		while ((obj = obj.offsetParent) != null) {
			position = getCurrentStyle(obj, 'position', 'position');
			if (position == 'relative') {
				continue;
			}
			left_offset += obj.offsetLeft;
			top_offset += obj.offsetTop;
		}
	}
	return {
		'left': left_offset,
		'top': top_offset
	};
}

function trim(str) {
	return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
}

function strlen(str) {
	return (BROWSER.ie && str.indexOf('\n') != -1) ? str.replace(/\r?\n/g, '_').length : str.length;
}

function mb_strlen(str) {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
	}
	return len;
}

function mb_cutstr(str, maxlen, dot) {
	var len = 0;
	var ret = '';
	var dot = !dot ? '...' : dot;
	maxlen = maxlen - dot.length;
	for (var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
		if (len > maxlen) {
			ret += dot;
			break;
		}
		ret += str.substr(i, 1);
	}
	return ret;
}

function preg_replace(search, replace, str, regswitch) {
	var regswitch = !regswitch ? 'ig' : regswitch;
	var len = search.length;
	for (var i = 0; i < len; i++) {
		re = new RegExp(search[i], regswitch);
		str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
	}
	return str;
}

function hideMenu(attr, mtype) {
	attr = isUndefined(attr) ? '' : attr;
	mtype = isUndefined(mtype) ? 'menu' : mtype;
	if (attr == '') {
		for (var i = 1; i <= JSMENU['layer']; i++) {
			hideMenu(i, mtype);
		}
		return;
	} else if (typeof attr == 'number') {
		for (var j in JSMENU['active'][attr]) {
			hideMenu(JSMENU['active'][attr][j], mtype);
		}
		return;
	} else if (typeof attr == 'string') {
		var menuObj = $$(attr);
		if (!menuObj || (mtype && menuObj.mtype != mtype)) return;
		var ctrlObj = '',
			ctrlclass = '';
		if ((ctrlObj = $$(menuObj.getAttribute('ctrlid'))) && (ctrlclass = menuObj.getAttribute('ctrlclass'))) {
			var reg = new RegExp(' ' + ctrlclass);
			ctrlObj.className = ctrlObj.className.replace(reg, '');
		}
		clearTimeout(JSMENU['timer'][attr]);
		var hide = function() {
			if (menuObj.cache) {
				if (menuObj.style.visibility != 'hidden') {
					menuObj.style.display = 'none';
					if (menuObj.cover) $$(attr + '_cover').style.display = 'none';
				}
			} else {
				menuObj.parentNode.removeChild(menuObj);
				if (menuObj.cover) $$(attr + '_cover').parentNode.removeChild($$(attr + '_cover'));
			}
			var tmp = [];
			for (var k in JSMENU['active'][menuObj.layer]) {
				if (attr != JSMENU['active'][menuObj.layer][k]) tmp.push(JSMENU['active'][menuObj.layer][k]);
			}
			JSMENU['active'][menuObj.layer] = tmp;
		};
		if (menuObj.fade) {
			var O = 100;
			var fadeOut = function(O) {
				if (O == 0) {
					clearTimeout(fadeOutTimer);
					hide();
					return;
				}
				menuObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + O + ')';
				menuObj.style.opacity = O / 100;
				O -= 20;
				var fadeOutTimer = setTimeout(function() {
					fadeOut(O);
				}, 40);
			};
			fadeOut(O);
		} else {
			hide();
		}
	}
}


function setMenuPosition(showid, menuid, pos) {
	var showObj = $$(showid);
	var menuObj = menuid ? $$(menuid) : $$(showid + '_menu');
	if (isUndefined(pos) || !pos) pos = '43';
	var basePoint = parseInt(pos.substr(0, 1));
	var direction = parseInt(pos.substr(1, 1));
	var important = pos.indexOf('!') != -1 ? 1 : 0;
	var sxy = 0,
		sx = 0,
		sy = 0,
		sw = 0,
		sh = 0,
		ml = 0,
		mt = 0,
		mw = 0,
		mcw = 0,
		mh = 0,
		mch = 0,
		bpl = 0,
		bpt = 0;
	if (!menuObj || (basePoint > 0 && !showObj)) return;
	if (showObj) {
		sxy = fetchOffset(showObj);
		sx = sxy['left'];
		sy = sxy['top'];
		sw = showObj.offsetWidth;
		sh = showObj.offsetHeight;
	}
	mw = menuObj.offsetWidth;
	mcw = menuObj.clientWidth;
	mh = menuObj.offsetHeight;
	mch = menuObj.clientHeight;
	switch (basePoint) {
		case 1:
			bpl = sx;
			bpt = sy;
			break;
		case 2:
			bpl = sx + sw;
			bpt = sy;
			break;
		case 3:
			bpl = sx + sw;
			bpt = sy + sh;
			break;
		case 4:
			bpl = sx;
			bpt = sy + sh;
			break;
	}
	switch (direction) {
		case 0:
			menuObj.style.left = (document.body.clientWidth - menuObj.clientWidth) / 2 + 'px';
			mt = (document.documentElement.clientHeight - menuObj.clientHeight) / 2;
			break;
		case 1:
			ml = bpl - mw;
			mt = bpt - mh;
			break;
		case 2:
			ml = bpl;
			mt = bpt - mh;
			break;
		case 3:
			ml = bpl;
			mt = bpt;
			break;
		case 4:
			ml = bpl - mw;
			mt = bpt;
			break;
	}
	var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
	if (!important) {
		if (in_array(direction, [1, 4]) && ml < 0) {
			ml = bpl;
			if (in_array(basePoint, [1, 4])) ml += sw;
		} else if (ml + mw > scrollLeft + document.body.clientWidth && sx >= mw) {
			ml = bpl - mw;
			if (in_array(basePoint, [2, 3])) {
				ml -= sw;
			} else if (basePoint == 4) {
				ml += sw;
			}
		}
		if (in_array(direction, [1, 2]) && mt < 0) {
			mt = bpt;
			if (in_array(basePoint, [1, 2])) mt += sh;
		} else if (mt + mh > scrollTop + document.documentElement.clientHeight && sy >= mh) {
			mt = bpt - mh;
			if (in_array(basePoint, [3, 4])) mt -= sh;
		}
	}
	if (pos.substr(0, 3) == '210') {
		ml += 69 - sw / 2;
		mt -= 5;
		if (showObj.tagName == 'TEXTAREA') {
			ml -= sw / 2;
			mt += sh / 2;
		}
	}
	if (direction == 0 || menuObj.scrolly) {
		if (BROWSER.ie && BROWSER.ie < 7) {
			if (direction == 0) mt += scrollTop;
		} else {
			if (menuObj.scrolly) mt -= scrollTop;
			menuObj.style.position = 'fixed';
		}
	}
	if (ml) menuObj.style.left = ml + 'px';
	if (mt) menuObj.style.top = mt + 'px';
	if (direction == 0 && BROWSER.ie && !document.documentElement.clientHeight) {
		menuObj.style.position = 'absolute';
		menuObj.style.top = (document.body.clientHeight - menuObj.clientHeight) / 2 + 'px';
	}
	if (menuObj.style.clip && !BROWSER.opera) {
		menuObj.style.clip = 'rect(auto, auto, auto, auto)';
	}
}

function doane(event, preventDefault, stopPropagation) {
	var preventDefault = isUndefined(preventDefault) ? 1 : preventDefault;
	var stopPropagation = isUndefined(stopPropagation) ? 1 : stopPropagation;
	e = event ? event : window.event;
	if (!e) {
		e = getEvent();
	}
	if (!e) {
		return null;
	}
	if (preventDefault) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}
	if (stopPropagation) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	}
	return e;
}

function showMenu(v) {
	var ctrlid = isUndefined(v['ctrlid']) ? v : v['ctrlid'];
	var showid = isUndefined(v['showid']) ? ctrlid : v['showid'];
	var menuid = isUndefined(v['menuid']) ? showid + '_menu' : v['menuid'];
	var ctrlObj = $$(ctrlid);
	var menuObj = $$(menuid);
	if (!menuObj) return;
	var mtype = isUndefined(v['mtype']) ? 'menu' : v['mtype'];
	var evt = isUndefined(v['evt']) ? 'mouseover' : v['evt'];
	var pos = isUndefined(v['pos']) ? '43' : v['pos'];
	var layer = isUndefined(v['layer']) ? 1 : v['layer'];
	var duration = isUndefined(v['duration']) ? 2 : v['duration'];
	var timeout = isUndefined(v['timeout']) ? 250 : v['timeout'];
	var maxh = isUndefined(v['maxh']) ? 600 : v['maxh'];
	var cache = isUndefined(v['cache']) ? 1 : v['cache'];
	var drag = isUndefined(v['drag']) ? '' : v['drag'];
	var dragobj = drag && $$(drag) ? $$(drag) : menuObj;
	var fade = isUndefined(v['fade']) ? 0 : v['fade'];
	var cover = isUndefined(v['cover']) ? 0 : v['cover'];
	var zindex = isUndefined(v['zindex']) ? JSMENU['zIndex']['menu'] : v['zindex'];
	var ctrlclass = isUndefined(v['ctrlclass']) ? '' : v['ctrlclass'];
	var winhandlekey = isUndefined(v['win']) ? '' : v['win'];
	if (winhandlekey && ctrlObj && !ctrlObj.getAttribute('fwin')) {
		ctrlObj.setAttribute('fwin', winhandlekey);
	}
	zindex = cover ? zindex + 500 : zindex;
	if (typeof JSMENU['active'][layer] == 'undefined') {
		JSMENU['active'][layer] = [];
	}
	for (i in EXTRAFUNC['showmenu']) {
		try {
			eval(EXTRAFUNC['showmenu'][i] + '()');
		} catch (e) {}
	}
	if (evt == 'click' && in_array(menuid, JSMENU['active'][layer]) && mtype != 'win') {
		hideMenu(menuid, mtype);
		return;
	}
	if (mtype == 'menu') {
		hideMenu(layer, mtype);
	}
	if (ctrlObj) {
		if (!ctrlObj.getAttribute('initialized')) {
			ctrlObj.setAttribute('initialized', true);
			ctrlObj.unselectable = true;
			ctrlObj.outfunc = typeof ctrlObj.onmouseout == 'function' ? ctrlObj.onmouseout : null;
			ctrlObj.onmouseout = function() {
				if (this.outfunc) this.outfunc();
				if (duration < 3 && !JSMENU['timer'][menuid]) {
					JSMENU['timer'][menuid] = setTimeout(function() {
						hideMenu(menuid, mtype);
					}, timeout);
				}
			};
			ctrlObj.overfunc = typeof ctrlObj.onmouseover == 'function' ? ctrlObj.onmouseover : null;
			ctrlObj.onmouseover = function(e) {
				doane(e);
				if (this.overfunc) this.overfunc();
				if (evt == 'click') {
					clearTimeout(JSMENU['timer'][menuid]);
					JSMENU['timer'][menuid] = null;
				} else {
					for (var i in JSMENU['timer']) {
						if (JSMENU['timer'][i]) {
							clearTimeout(JSMENU['timer'][i]);
							JSMENU['timer'][i] = null;
						}
					}
				}
			};
		}
	}
	if (!menuObj.getAttribute('initialized')) {
		menuObj.setAttribute('initialized', true);
		menuObj.ctrlkey = ctrlid;
		menuObj.mtype = mtype;
		menuObj.layer = layer;
		menuObj.cover = cover;
		if (ctrlObj && ctrlObj.getAttribute('fwin')) {
			menuObj.scrolly = true;
		}
		menuObj.style.position = 'absolute';
		menuObj.style.zIndex = zindex + layer;
		menuObj.onclick = function(e) {
			return doane(e, 0, 1);
		};
		if (duration < 3) {
			if (duration > 1) {
				menuObj.onmouseover = function() {
					clearTimeout(JSMENU['timer'][menuid]);
					JSMENU['timer'][menuid] = null;
				};
			}
			if (duration != 1) {
				menuObj.onmouseout = function() {
					JSMENU['timer'][menuid] = setTimeout(function() {
						hideMenu(menuid, mtype);
					}, timeout);
				};
			}
		}
		if (cover) {
			var coverObj = document.createElement('div');
			coverObj.id = menuid + '_cover';
			coverObj.style.position = 'absolute';
			coverObj.style.zIndex = menuObj.style.zIndex - 1;
			coverObj.style.left = coverObj.style.top = '0px';
			coverObj.style.width = '100%';
			coverObj.style.height = Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + 'px';
			coverObj.style.backgroundColor = '#000';
			coverObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)';
			coverObj.style.opacity = 0.5;
			coverObj.onclick = function() {
				hideMenu();
			};
			$$('append_parent').appendChild(coverObj);
			_attachEvent(window, 'load', function() {
				coverObj.style.height = Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + 'px';
			}, document);
		}
	}
	if (drag) {
		dragobj.style.cursor = 'move';
		dragobj.onmousedown = function(event) {
			if(!event.altKey&&!event.ctrlKey&&!event.shiftKey){
				try {
					dragMenu(menuObj, event, 1);
				} catch (e) {}
			}
		};
	}
	if (cover) $$(menuid + '_cover').style.display = '';
	if (fade) {
		var O = 0;
		var fadeIn = function(O) {
			if (O > 100) {
				clearTimeout(fadeInTimer);
				return;
			}
			menuObj.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + O + ')';
			menuObj.style.opacity = O / 100;
			O += 20;
			var fadeInTimer = setTimeout(function() {
				fadeIn(O);
			}, 40);
		};
		fadeIn(O);
		menuObj.fade = true;
	} else {
		menuObj.fade = false;
	}
	menuObj.style.display = '';
	if (ctrlObj && ctrlclass) {
		ctrlObj.className += ' ' + ctrlclass;
		menuObj.setAttribute('ctrlid', ctrlid);
		menuObj.setAttribute('ctrlclass', ctrlclass);
	}
	if (pos != '*') {
		setMenuPosition(showid, menuid, pos);
	}
	if (BROWSER.ie && BROWSER.ie < 7 && winhandlekey && $$('fwin_' + winhandlekey)) {
		$$(menuid).style.left = (parseInt($$(menuid).style.left) - parseInt($$('fwin_' + winhandlekey).style.left)) + 'px';
		$$(menuid).style.top = (parseInt($$(menuid).style.top) - parseInt($$('fwin_' + winhandlekey).style.top)) + 'px';
	}
	if (maxh && menuObj.scrollHeight > maxh) {
		menuObj.style.height = maxh + 'px';
		if (BROWSER.opera) {
			menuObj.style.overflow = 'auto';
		} else {
			menuObj.style.overflowY = 'auto';
		}
	}
	if (!duration) {
		setTimeout('hideMenu(\'' + menuid + '\', \'' + mtype + '\')', timeout);
	}
	if (!in_array(menuid, JSMENU['active'][layer])) JSMENU['active'][layer].push(menuid);
	menuObj.cache = cache;
	if (layer > JSMENU['layer']) {
		JSMENU['layer'] = layer;
	}
	var hasshow = function(ele) {
		while (ele.parentNode && ((typeof(ele['currentStyle']) === 'undefined') ? window.getComputedStyle(ele, null) : ele['currentStyle'])['display'] !== 'none') {
			ele = ele.parentNode;
		}
		if (ele === document) {
			return true;
		} else {
			return false;
		}
	};
	if (!menuObj.getAttribute('disautofocus')) {
		try {
			var focused = false;
			var tags = ['input', 'select', 'textarea', 'button', 'a'];
			for (var i = 0; i < tags.length; i++) {
				var _all = menuObj.getElementsByTagName(tags[i]);
				if (_all.length) {
					for (j = 0; j < _all.length; j++) {
						if ((!_all[j]['type'] || _all[j]['type'] != 'hidden') && hasshow(_all[j])) {
							_all[j].className += ' hidefocus';
							_all[j].focus();
							focused = true;
							var cobj = _all[j];
							_attachEvent(_all[j], 'blur', function() {
								cobj.className = trim(cobj.className.replace(' hidefocus', ''));
							});
							break;
						}
					}
				}
				if (focused) {
					break;
				}
			}
		} catch (e) {}
	}
}



function getCurrentStyle(obj, cssproperty, csspropertyNS) {
	if (obj.style[cssproperty]) {
		return obj.style[cssproperty];
	}
	if (obj.currentStyle) {
		return obj.currentStyle[cssproperty];
	} else if (document.defaultView.getComputedStyle(obj, null)) {
		var currentStyle = document.defaultView.getComputedStyle(obj, null);
		var value = currentStyle.getPropertyValue(csspropertyNS);
		if (!value) {
			value = currentStyle[cssproperty];
		}
		return value;
	} else if (window.getComputedStyle) {
		var currentStyle = window.getComputedStyle(obj, "");
		return currentStyle.getPropertyValue(csspropertyNS);
	}
}

var delayShowST = null;

function delayShow(ctrlObj, call, time) {
	if (typeof ctrlObj == 'object') {
		var ctrlid = ctrlObj.id;
		call = call || function() {
			showMenu(ctrlid);
		};
	}
	var time = isUndefined(time) ? 500 : time;
	delayShowST = setTimeout(function() {
		if (typeof call == 'function') {
			call();
		} else {
			eval(call);
		}
	}, time);
	if (!ctrlObj.delayinit) {
		_attachEvent(ctrlObj, 'mouseout', function() {
			clearTimeout(delayShowST);
		});
		ctrlObj.delayinit = 1;
	}
}
var dragMenuDisabled = false;

function dragMenu(menuObj, e, op) {
	e = e ? e : window.event;
	if (op == 1) {
		if (dragMenuDisabled || in_array(e.target ? e.target.tagName : e.srcElement.tagName, ['TEXTAREA', 'INPUT', 'BUTTON', 'SELECT'])) {
			return;
		}
		JSMENU['drag'] = [e.clientX, e.clientY];
		JSMENU['drag'][2] = parseInt(menuObj.style.left);
		JSMENU['drag'][3] = parseInt(menuObj.style.top);
		document.onmousemove = function(e) {
			try {
				dragMenu(menuObj, e, 2);
			} catch (err) {}
		};
		document.onmouseup = function(e) {
			try {
				dragMenu(menuObj, e, 3);
			} catch (err) {}
		};
		doane(e);
	} else if (op == 2 && JSMENU['drag'][0]) {
		var menudragnow = [e.clientX, e.clientY];
		menuObj.style.left = (JSMENU['drag'][2] + menudragnow[0] - JSMENU['drag'][0]) + 'px';
		menuObj.style.top = (JSMENU['drag'][3] + menudragnow[1] - JSMENU['drag'][1]) + 'px';
		menuObj.removeAttribute('top_');
		menuObj.removeAttribute('left_');
		doane(e);
	} else if (op == 3) {
		JSMENU['drag'] = [];
		document.onmousemove = null;
		document.onmouseup = null;
	}
}

////////////

this.zoom=function (obj, zimg, nocover, pn, showexif) {
	if(!obj){
		this.hide();
		return;
	}
	zimg = !zimg ? obj.src : zimg;
	showexif = !parseInt(showexif) ? 0 : showexif;
	if (!zoomstatus) {
		window.open(zimg, '', '');
		return;
	}
	if (!obj.id) obj.id = 'aimg_' + new Date().valueOf();
	var faid = !obj.getAttribute('aid') ? 0 : obj.getAttribute('aid');
	var menuid = 'imgzoom';
	var menu = $$(menuid);
	var zoomid = menuid + '_zoom';
	var imgtitle = !nocover && obj.title ? '<div class="imgzoom_title">' + htmlspecialchars(obj.title) + '</div>' + (showexif ? '<div id="' + zoomid + '_exif" class="imgzoom_exif" onmouseover="this.className=\'imgzoom_exif imgzoom_exif_hover\'" onmouseout="this.className=\'imgzoom_exif\'"></div>' : '') : '';
	var cover = !nocover ? 1 : 0;
	var pn = !pn ? 0 : 1;
	var maxh = (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight) - 70;
	var loadCheck = function(obj) {
		if (obj.complete) {
			var imgw = loading.width;
			var imgh = loading.height;
			var r = imgw / imgh;
			var w = document.body.clientWidth * 0.95;
			w = imgw > w ? w : imgw;
			var h = w / r;
			if (w < 100 & h < 100) {
				$$(menuid + '_waiting').style.display = 'none';
				hideMenu();
				return;
			}
			if (h > maxh) {
				h = maxh;
				w = h * r;
			}
			if ($$(menuid)) {
				$$(menuid).removeAttribute('top_');
				$$(menuid).removeAttribute('left_');
				clearTimeout($$(menuid).getAttribute('timer'));
			}
			showimage(zimg, w, h, imgw, imgh);
			if (showexif && faid) {
				/*
				var x = new Ajax();
				x.get('forum.php?mod=ajax&action=exif&aid=' + faid + '&inajax=1', function(s, x) {
					if (s) {
						$$(zoomid + '_exif').style.display = '';
						$$(zoomid + '_exif').innerHTML = s;
					} else {
						$$(zoomid + '_exif').style.display = 'none';
					}
				});
*/
			}
		} else {
			setTimeout(function() {
				loadCheck(loading);
			}, 100);
		}
	};
	var showloading = function(zimg, pn) {
		if (!pn) {
			if (!$$(menuid + '_waiting')) {
				waiting = document.createElement('img');
				waiting.id = menuid + '_waiting';
				waiting.src = 'http://ww3.sinaimg.cn/large/600ba6eagw1eou01pr10ig2014014wed.gif';
				waiting.style.opacity = '0.8';
				waiting.style.filter = 'alpha(opacity=80)';
				waiting.style.position = 'absolute';
				waiting.style.zIndex = '100000';
				$$('append_parent').appendChild(waiting);
			}
		}
		$$(menuid + '_waiting').style.display = '';
		$$(menuid + '_waiting').style.left = (document.body.clientWidth - 42) / 2 + 'px';
		$$(menuid + '_waiting').style.top = ((document.documentElement.clientHeight - 42) / 2 + Math.max(document.documentElement.scrollTop, document.body.scrollTop)) + 'px';
		loading = new Image();
		setTimeout(function() {
			loadCheck(loading);
		}, 100);
		if (!pn) {
			$$(menuid + '_zoomlayer').style.display = 'none';
		}
		loading.src = zimg;
	};
	var adjustpn = function(w,h) {
		h = h < 90 ? 90 : h;
		w = w < 300 ? 100 : w/3;
		if ($$('zimg_prev')) {
			$$('zimg_prev').style.height = parseInt(h) + 'px';
			$$("zimg_prev").style.width = parseInt(w) + 'px';
		}
		if ($$('zimg_next')) {
			$$('zimg_next').style.height = parseInt(h) + 'px';
			$$("zimg_next").style.width = parseInt(w) + 'px';
		}
		var cover=$$(menuid + '_cover');
		if(cover){
			cover.style.height = Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + 'px';
		}
	};
	var showimage = function(zimg, w, h, imgw, imgh) {
		$$(menuid + '_waiting').style.display = 'none';
		$$(menuid + '_zoomlayer').style.display = '';
		$$(menuid + '_img').style.width = 'auto';
		$$(menuid + '_img').style.height = 'auto';
		$$(menuid).style.width = (w < 300 ? 320 : w + 20) + 'px';
		mheight = h + 63;
		menu.style.height = mheight + 'px';
		$$(menuid + '_zoomlayer').style.height = (mheight < 120 ? 120 : mheight) + 'px';
		$$(menuid + '_img').innerHTML = '<img id="' + zoomid + '" src="' + zimg + '" width="' + w + '" height="' + h + '" w="' + imgw + '" h="' + imgh + '" />' + imgtitle;
		if ($$(menuid + '_imglink')) {
			$$(menuid + '_imglink').href = zimg;
		}
		setMenuPosition('', menuid, '00');
		adjustpn(w,h);
	};
	var adjustTimer = 0;
	var adjustTimerCount = 0;
	var wheelDelta = 0;
	var clientX = 0;
	var clientY = 0;
	var adjust = function(e, a) {
		if (BROWSER.ie && BROWSER.ie < 7) {} else {
			if (adjustTimerCount) {
				adjustTimer = (function() {
					return setTimeout(function() {
						adjustTimerCount++;
						adjust(e);
					}, 20);
				})();
				$$(menuid).setAttribute('timer', adjustTimer);
				if (adjustTimerCount > 17) {
					clearTimeout(adjustTimer);
					adjustTimerCount = 0;
					doane();
				}
			} else if (!a) {
				adjustTimerCount = 1;
				if (adjustTimer) {
					clearTimeout(adjustTimer);
					adjust(e, a);
				} else {
					adjust(e, a);
				}
				doane();
			}
		}
		var ele = $$(zoomid);
		if (!ele) {
			return;
		}
		var imgw = ele.getAttribute('w');
		var imgh = ele.getAttribute('h');
		if (!a) {
			e = e || window.event;
			try {
				if (e.altKey || e.shiftKey || e.ctrlKey) return;
			} catch (e) {
				e = {
					'wheelDelta': wheelDelta,
					'clientX': clientX,
					'clientY': clientY
				};
			}
			var step = 0;
			if (e.wheelDelta <= 0 || e.detail > 0) {
				if (ele.width - 1 <= 200 || ele.height - 1 <= 200) {
					clearTimeout(adjustTimer);
					adjustTimerCount = 0;
					doane(e);
					return;
				}
				step = parseInt(imgw / ele.width) - 4;
				if(step >= 0){
					step=-1;
				}
			} else {
				if (ele.width + 1 >= imgw * 40) {
					clearTimeout(adjustTimer);
					adjustTimerCount = 0;
					doane(e);
					return;
				}
				step = 4 - parseInt(imgw / ele.width);
				if(step<=0){
					step=2;
				}
			}
			if (BROWSER.ie && BROWSER.ie < 7) {
				step *= 5;
			}
			wheelDelta = e.wheelDelta;
			clientX = e.clientX;
			clientY = e.clientY;
			var ratio = 0;
			if (imgw > imgh) {
				ratio = step / ele.height;
				ele.height += step;
				ele.width = imgw * (ele.height / imgh);
			} else if (imgw < imgh) {
				ratio = step / ele.width;
				ele.width += step;
				ele.height = imgh * (ele.width / imgw);
			}
			if (BROWSER.ie && BROWSER.ie < 7) {
				setMenuPosition('', menuid, '00');
			} else {
				var menutop = parseFloat(menu.getAttribute('top_') || menu.style.top);
				var menuleft = parseFloat(menu.getAttribute('left_') || menu.style.left);
				var imgY = clientY - menutop - 39;
				var imgX = clientX - menuleft - 10;
				var newTop = (menutop - imgY * ratio) + 'px';
				var newLeft = (menuleft - imgX * ratio) + 'px';
				menu.style.top = newTop;
				menu.style.left = newLeft;
				menu.setAttribute('top_', newTop);
				menu.setAttribute('left_', newLeft);
			}
		} else {
			ele.width = imgw;
			ele.height = imgh;
		}
		menu.style.width = (parseInt(ele.width < 300 ? 300 : parseInt(ele.width)) + 20) + 'px';
		var mheight = (parseInt(ele.height) + 50);
		menu.style.height = mheight + 'px';
		$$(menuid + '_zoomlayer').style.height = (mheight < 120 ? 120 : mheight) + 'px';
		adjustpn(ele.width,ele.height);
		doane(e);
	};
	if (!menu && !pn) {
		menu = document.createElement('div');
		menu.id = menuid;
		if (cover) {
			menu.innerHTML = '<div class="zoominner" id="' + menuid + '_zoomlayer" style="display:none"><p><span class="y"><a id="' + menuid + '_imglink" class="imglink" target="_blank" title="在新窗口打开">在新窗口打开</a><a id="' + menuid + '_adjust" href="javascipt:;" class="imgadjust" title="实际大小">实际大小</a>' + '<a href="javascript:;" id="diaClose" class="imgclose" title="关闭">关闭</a></span></p>' + '<div class="zimg_p" id="' + menuid + '_picpage"></div><div class="hm" id="' + menuid + '_img"></div></div>';
		} else {
			menu.innerHTML = '<div class="popupmenu_popup" id="' + menuid + '_zoomlayer" style="width:auto"><span class="right y"><a href="javascript:;" id="diaClose" class="flbc" style="width:20px;margin:0 0 2px 0">关闭</a></span><div class="zimg_p" id="' + menuid + '_picpage"></div><div class="hm" id="' + menuid + '_img"></div></div>';
		}
		if (BROWSER.ie || BROWSER.chrome) {
			menu.onmousewheel = adjust;
		} else {
			menu.addEventListener('DOMMouseScroll', adjust, false);
		}
		$$('append_parent').appendChild(menu);
		if ($$(menuid + '_adjust')) {
			$$(menuid + '_adjust').onclick = function(e) {
				adjust(e, 1)
			};
		}
	}
	showloading(zimg, pn);
	picpage = '';
	$$(menuid + '_picpage').innerHTML = '';
	if (aimgcount.length>0) {
		authorimgs = aimgcount;
		var aid = obj.id.substr(5),
			authorlength = authorimgs.length,
			authorcurrent = '';
		if (authorlength > 1) {
			for (i = 0; i < authorlength; i++) {
				if (aid == authorimgs[i]) {
					authorcurrent = i;
				}
			}
			if (authorcurrent !== '') {
				picpage += ' <div id="zimg_prev" class="zimg_prev"><strong>上一张</strong></div> ';
				picpage += ' <div id="zimg_next" class="zimg_next"><strong>下一张</strong></div> ';
			}
			if (picpage) {
				$$(menuid + '_picpage').innerHTML = picpage;
				_attachEvent($$("zimg_prev"),"mouseover",function(){
					dragMenuDisabled=true;
				});
				_attachEvent($$("zimg_prev"),"mouseout",function(){
					dragMenuDisabled=false;
				});
				_attachEvent($$("zimg_next"),"mouseover",function(){
					dragMenuDisabled=true;
				});
				_attachEvent($$("zimg_next"),"mouseout",function(){
					dragMenuDisabled=false;
				});

				_attachEvent($$("zimg_prev"),"click",function(){
					paid = _this.fetchPrevPicId(authorcurrent,authorimgs);
					_this._zoom_page(paid, (showexif ? 1 : 0));
				});
				_attachEvent($$("zimg_next"),"click",function(){
					paid = _this.fetchNextPicId(authorcurrent,authorimgs);
					_this._zoom_page(paid, (showexif ? 1 : 0));
				});
			}
		}
	}
	showMenu({
		'ctrlid': obj.id,
		'menuid': menuid,
		'duration': 3,
		'pos': '00',
		'cover': cover,
		'drag': menuid,
		'maxh': ''
	});
	_attachEvent($$("diaClose"),"click",function(){
		hideMenu();
	});
}

this.hide=hideMenu;

this._zoom_page=function (paid, showexif) {
	var imagesrc = _this.fetchZoomPic($$('aimg_' + paid));
	_this.zoom($$('aimg_' + paid), imagesrc, 0, 1, showexif ? 1 : 0);
}

this.fetchZoomPic=function(obj){
	return obj.getAttribute('zoomfile') ? obj.getAttribute('zoomfile') : obj.getAttribute('file');
}

this.fetchPrevPicId=function(currentIndex,imgIdList){
	return currentIndex > 0 ? imgIdList[currentIndex - 1] : imgIdList[imgIdList.length - 1];
}

this.fetchNextPicId=function(currentIndex,imgIdList){
	return currentIndex < imgIdList.length - 1 ? imgIdList[currentIndex + 1] : imgIdList[0];
}

this.setImgWidth=function (width){
	imagemaxwidth=width;
	return _this;
}

var styleText=':focus{outline:0}.hidefocus{outline:0}.zoom{cursor:pointer}#append_parent{outline:0;margin:0;padding:0;background:#fff;font:12px/1.5 Tahoma,"Microsoft Yahei","Simsun";color:#444;font-family:"Microsoft yahei","微软雅黑",Arial,Helvetica,sans-serif,"宋体"}.zoominner{padding:5px 10px 10px;background:#FFF;text-align:left}.zoominner .y{float:right}.zoominner p{margin:0;padding:8px 0;height:20px}.zoominner p a{float:left;margin-left:10px;width:17px;height:17px;background:url(http://ww1.sinaimg.cn/large/600ba6eagw1eou01qdbigg202p01k0cr.gif) no-repeat 0 0;line-height:100px;overflow:hidden}.zoominner p a:hover{background-position:0 -39px}.zoominner p a.imgadjust{background-position:-40px 0}.zoominner p a.imgadjust:hover{background-position:-40px -39px}.zoominner p a.imgclose{background-position:-80px 0}.zoominner p a.imgclose:hover{background-position:-80px -39px}.zoominner .hm {text-align: center;}.zimg_c{position:relative}.zimg_prev,.zimg_next{display:block;position:absolute;width:100px;height:100%;cursor:url(http://img.t.sinajs.cn/t6/style/images/common/pic_prev.cur),auto}.zimg_next{right:10px;cursor:url(http://img.t.sinajs.cn/t6/style/images/common/pic_next.cur),auto}.zimg_c img{margin:0 auto}.zimg_p strong{display:none}';

var styleAdded=false;
this.initImgList=function(objList){
	var seed=new Date().valueOf();
	var imgArray=new Array();
	if(objList&&objList.length>0){
		for(var i=0;i<objList.length;i++){
			objList[i].setAttribute("id","aimg_"+seed);
			imgArray.push(seed++);
			_attachEvent(objList[i],"click",function(){
				_this.zoom(this, _this.fetchZoomPic(this), 0, 0, 0);
			});
		}
		aimgcount=imgArray;
	}
	if(!styleAdded){
		var bodyStyle=document.createElement("style");
		bodyStyle.setAttribute("type","text/css");
		bodyStyle.innerHTML=styleText;
		document.body.appendChild(bodyStyle);
		styleAdded=true;
	}
}

}