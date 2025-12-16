const __pluginConfig =  {
  "name": "windy-plugin-foreflight-import",
  "version": "1.0.0",
  "icon": "✈️",
  "title": "ForeFlight Import",
  "description": "Import ForeFlight .fpl flight plans and visualize routes with weather",
  "author": "Nicolas",
  "desktopUI": "rhpane",
  "mobileUI": "small",
  "desktopWidth": 280,
  "routerPath": "/foreflight-import",
  "built": 1765917188771,
  "builtReadable": "2025-12-16T20:33:08.771Z",
  "screenshot": "screenshot.jpg"
};

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @returns {(event: any) => any} */
function prevent_default(fn) {
	return function (event) {
		event.preventDefault();
		// @ts-ignore
		return fn.call(this, event);
	};
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	{
		node.style.setProperty(key, value, '');
	}
}

/**
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const config = {
    title: 'ForeFlight Import'};

function parseWaypointType(typeStr) {
    const normalized = typeStr.toUpperCase().trim();
    if (normalized === 'AIRPORT') return 'airport';
    if (normalized === 'VOR' || normalized === 'NDB' || normalized === 'NAVAID') return 'navaid';
    if (normalized === 'INT' || normalized === 'FIX' || normalized === 'INTERSECTION') return 'fix';
    if (normalized.includes('USER') || normalized.includes('WAYPOINT')) return 'user';
    return 'unknown';
}
function getTextContent(element, tagName) {
    const child = element.getElementsByTagName(tagName)[0];
    return child?.textContent?.trim() ?? '';
}
function haversineDistanceNm(lat1, lon1, lat2, lon2) {
    const R = 3440.065; // Earth radius in nautical miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function calculateTotalDistance(routePoints) {
    let total = 0;
    for(let i = 1; i < routePoints.length; i++){
        const prev = routePoints[i - 1].waypoint;
        const curr = routePoints[i].waypoint;
        total += haversineDistanceNm(prev.lat, prev.lon, curr.lat, curr.lon);
    }
    return Math.round(total);
}
function parseFplFile(content) {
    // Handle UTF-16 encoding (ForeFlight exports as UTF-16)
    // Remove BOM and null characters that appear between each character in UTF-16
    let cleanedContent = content;
    if (content.charCodeAt(0) === 0xFFFE || content.charCodeAt(0) === 0xFEFF) {
        cleanedContent = content.substring(1);
    }
    // Remove null bytes (appears in UTF-16 when read as UTF-8)
    cleanedContent = cleanedContent.replace(/\x00/g, '');
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanedContent, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        throw new Error('Invalid FPL file: ' + parseError.textContent);
    }
    // Build waypoint lookup table
    const waypointTable = new Map();
    const waypointElements = doc.getElementsByTagName('waypoint');
    for (const wpEl of waypointElements){
        const identifier = getTextContent(wpEl, 'identifier');
        if (!identifier) continue;
        const waypoint = {
            identifier,
            type: parseWaypointType(getTextContent(wpEl, 'type')),
            lat: parseFloat(getTextContent(wpEl, 'lat')) || 0,
            lon: parseFloat(getTextContent(wpEl, 'lon')) || 0
        };
        waypointTable.set(identifier, waypoint);
    }
    // Get cruise altitude from flight-data
    let cruiseAltitudeFeet = null;
    const flightDataEl = doc.getElementsByTagName('flight-data')[0];
    if (flightDataEl) {
        const altStr = getTextContent(flightDataEl, 'altitude-ft');
        if (altStr) {
            cruiseAltitudeFeet = parseInt(altStr, 10) || null;
        }
    }
    // Parse route points
    const routePoints = [];
    const routePointElements = doc.getElementsByTagName('route-point');
    for (const rpEl of routePointElements){
        const identifier = getTextContent(rpEl, 'waypoint-identifier');
        const waypoint = waypointTable.get(identifier);
        if (!waypoint) {
            console.warn(`Waypoint not found in table: ${identifier}`);
            continue;
        }
        routePoints.push({
            waypoint,
            altitudeFeet: cruiseAltitudeFeet
        });
    }
    if (routePoints.length === 0) {
        throw new Error('No route points found in FPL file');
    }
    // Get route name or generate from departure/destination
    const routeNameEl = doc.getElementsByTagName('route-name')[0];
    let name = routeNameEl?.textContent?.trim() ?? '';
    const departure = routePoints[0].waypoint.identifier;
    const destination = routePoints[routePoints.length - 1].waypoint.identifier;
    if (!name) {
        name = `${departure} → ${destination}`;
    }
    return {
        name,
        departure,
        destination,
        routePoints,
        totalDistanceNm: calculateTotalDistance(routePoints),
        cruiseAltitudeFeet
    };
}

class RouteRenderer {
    map;
    polyline = null;
    markers = [];
    routeColor;
    routeWeight;
    constructor(options){
        this.map = options.map;
        this.routeColor = options.routeColor ?? '#0066ff';
        this.routeWeight = options.routeWeight ?? 3;
    }
    render(flightPlan) {
        this.clear();
        const latLngs = flightPlan.routePoints.map((rp)=>L.latLng(rp.waypoint.lat, rp.waypoint.lon));
        // Draw route polyline
        this.polyline = L.polyline(latLngs, {
            color: this.routeColor,
            weight: this.routeWeight,
            opacity: 0.8
        }).addTo(this.map);
        // Draw waypoint markers
        flightPlan.routePoints.forEach((rp, index)=>{
            const marker = this.createMarker(rp, index, flightPlan.routePoints.length);
            this.markers.push(marker);
            marker.addTo(this.map);
        });
        // Fit map bounds to show entire route
        if (this.polyline) {
            this.map.fitBounds(this.polyline.getBounds(), {
                padding: [
                    50,
                    50
                ]
            });
        }
    }
    createMarker(routePoint, index, total) {
        const { waypoint } = routePoint;
        const isAirport = waypoint.type === 'airport';
        const isEndpoint = index === 0 || index === total - 1;
        // Style based on waypoint type
        const markerOptions = {
            radius: isAirport ? 7 : 5,
            fillColor: isAirport ? '#00cc00' : '#ffaa00',
            color: isEndpoint ? '#ff0000' : '#ffffff',
            weight: isEndpoint ? 3 : 2,
            fillOpacity: 1
        };
        const marker = L.circleMarker([
            waypoint.lat,
            waypoint.lon
        ], markerOptions);
        // Add tooltip with identifier
        marker.bindTooltip(waypoint.identifier, {
            permanent: true,
            direction: 'top',
            offset: [
                0,
                -8
            ],
            className: 'waypoint-label'
        });
        return marker;
    }
    clear() {
        if (this.polyline) {
            this.polyline.remove();
            this.polyline = null;
        }
        this.markers.forEach((marker)=>marker.remove());
        this.markers = [];
    }
}

/* src/plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-hvh21y", ".drop-zone.svelte-hvh21y.svelte-hvh21y{border:2px dashed rgba(255, 255, 255, 0.3);border-radius:8px;padding:24px 16px;text-align:center;cursor:pointer;transition:all 0.2s ease;margin-bottom:16px}.drop-zone.svelte-hvh21y.svelte-hvh21y:hover{border-color:rgba(255, 255, 255, 0.5);background:rgba(255, 255, 255, 0.05)}.drop-zone.drag-over.svelte-hvh21y.svelte-hvh21y{border-color:#0066ff;background:rgba(0, 102, 255, 0.1)}.drop-zone__text.svelte-hvh21y.svelte-hvh21y{color:rgba(255, 255, 255, 0.7);font-size:14px;line-height:1.5}.error-message.svelte-hvh21y.svelte-hvh21y{background:rgba(255, 0, 0, 0.2);border:1px solid rgba(255, 0, 0, 0.4);border-radius:4px;padding:8px 12px;margin-bottom:16px;color:#ff6b6b;font-size:13px}.route-info.svelte-hvh21y.svelte-hvh21y{margin-bottom:12px}.route-header.svelte-hvh21y.svelte-hvh21y{font-size:15px;margin-bottom:8px}.route-stats.svelte-hvh21y.svelte-hvh21y{display:flex;flex-direction:column;gap:4px;font-size:13px;color:rgba(255, 255, 255, 0.7)}.waypoint-list.svelte-hvh21y.svelte-hvh21y{max-height:300px;overflow-y:auto}.waypoint-item.svelte-hvh21y.svelte-hvh21y{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255, 255, 255, 0.1);font-size:13px}.waypoint-item.airport.svelte-hvh21y .waypoint-id.svelte-hvh21y{color:#00cc00}.waypoint-id.svelte-hvh21y.svelte-hvh21y{font-weight:600;min-width:60px}.waypoint-coords.svelte-hvh21y.svelte-hvh21y{color:rgba(255, 255, 255, 0.6);font-family:monospace;font-size:12px}.primary-btn.svelte-hvh21y.svelte-hvh21y{width:100%;padding:12px;background:#0066ff;border:none;border-radius:4px;color:white;cursor:pointer;font-size:14px;font-weight:600;transition:background 0.2s ease;margin-bottom:8px}.primary-btn.svelte-hvh21y.svelte-hvh21y:hover{background:#0052cc}.clear-btn.svelte-hvh21y.svelte-hvh21y{width:100%;padding:10px;background:rgba(255, 255, 255, 0.1);border:1px solid rgba(255, 255, 255, 0.2);border-radius:4px;color:white;cursor:pointer;font-size:14px;transition:background 0.2s ease}.clear-btn.svelte-hvh21y.svelte-hvh21y:hover{background:rgba(255, 255, 255, 0.2)}hr.svelte-hvh21y.svelte-hvh21y{border:none;border-top:1px solid rgba(255, 255, 255, 0.1);margin:12px 0}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[17] = list[i];
	child_ctx[19] = i;
	return child_ctx;
}

// (23:8) {:else}
function create_else_block(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.innerHTML = `Drop .fpl file here<br/>or click to browse`;
			attr(span, "class", "drop-zone__text svelte-hvh21y");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (21:8) {#if isDragging}
function create_if_block_3(ctx) {
	let span;

	return {
		c() {
			span = element("span");
			span.textContent = "Drop .fpl file here";
			attr(span, "class", "drop-zone__text svelte-hvh21y");
		},
		m(target, anchor) {
			insert(target, span, anchor);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (36:4) {#if errorMessage}
function create_if_block_2(ctx) {
	let div;
	let t;

	return {
		c() {
			div = element("div");
			t = text(/*errorMessage*/ ctx[2]);
			attr(div, "class", "error-message svelte-hvh21y");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);
		},
		p(ctx, dirty) {
			if (dirty & /*errorMessage*/ 4) set_data(t, /*errorMessage*/ ctx[2]);
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

// (41:4) {#if flightPlan}
function create_if_block(ctx) {
	let div2;
	let div0;
	let strong;
	let t1;
	let t2_value = /*flightPlan*/ ctx[3].departure + "";
	let t2;
	let t3;
	let t4_value = /*flightPlan*/ ctx[3].destination + "";
	let t4;
	let t5;
	let div1;
	let span0;
	let t6;
	let t7_value = /*flightPlan*/ ctx[3].totalDistanceNm + "";
	let t7;
	let t8;
	let t9;
	let span1;
	let t10;
	let t11_value = /*flightPlan*/ ctx[3].routePoints.length + "";
	let t11;
	let t12;
	let t13;
	let hr0;
	let t14;
	let div3;
	let t15;
	let hr1;
	let t16;
	let button0;
	let t18;
	let button1;
	let mounted;
	let dispose;
	let if_block = /*flightPlan*/ ctx[3].cruiseAltitudeFeet && create_if_block_1(ctx);
	let each_value = ensure_array_like(/*flightPlan*/ ctx[3].routePoints);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			strong = element("strong");
			strong.textContent = "Route:";
			t1 = space();
			t2 = text(t2_value);
			t3 = text(" → ");
			t4 = text(t4_value);
			t5 = space();
			div1 = element("div");
			span0 = element("span");
			t6 = text("Distance: ");
			t7 = text(t7_value);
			t8 = text(" nm");
			t9 = space();
			span1 = element("span");
			t10 = text("Waypoints: ");
			t11 = text(t11_value);
			t12 = space();
			if (if_block) if_block.c();
			t13 = space();
			hr0 = element("hr");
			t14 = space();
			div3 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t15 = space();
			hr1 = element("hr");
			t16 = space();
			button0 = element("button");
			button0.textContent = "Open in Distance & Planning";
			t18 = space();
			button1 = element("button");
			button1.textContent = "Clear Route";
			attr(div0, "class", "route-header svelte-hvh21y");
			attr(div1, "class", "route-stats svelte-hvh21y");
			attr(div2, "class", "route-info svelte-hvh21y");
			attr(hr0, "class", "svelte-hvh21y");
			attr(div3, "class", "waypoint-list svelte-hvh21y");
			attr(hr1, "class", "svelte-hvh21y");
			attr(button0, "class", "primary-btn svelte-hvh21y");
			attr(button1, "class", "clear-btn svelte-hvh21y");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, strong);
			append(div0, t1);
			append(div0, t2);
			append(div0, t3);
			append(div0, t4);
			append(div2, t5);
			append(div2, div1);
			append(div1, span0);
			append(span0, t6);
			append(span0, t7);
			append(span0, t8);
			append(div1, t9);
			append(div1, span1);
			append(span1, t10);
			append(span1, t11);
			append(div1, t12);
			if (if_block) if_block.m(div1, null);
			insert(target, t13, anchor);
			insert(target, hr0, anchor);
			insert(target, t14, anchor);
			insert(target, div3, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div3, null);
				}
			}

			insert(target, t15, anchor);
			insert(target, hr1, anchor);
			insert(target, t16, anchor);
			insert(target, button0, anchor);
			insert(target, t18, anchor);
			insert(target, button1, anchor);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*openInDistance*/ ctx[8]),
					listen(button1, "click", /*clearRoute*/ ctx[7])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*flightPlan*/ 8 && t2_value !== (t2_value = /*flightPlan*/ ctx[3].departure + "")) set_data(t2, t2_value);
			if (dirty & /*flightPlan*/ 8 && t4_value !== (t4_value = /*flightPlan*/ ctx[3].destination + "")) set_data(t4, t4_value);
			if (dirty & /*flightPlan*/ 8 && t7_value !== (t7_value = /*flightPlan*/ ctx[3].totalDistanceNm + "")) set_data(t7, t7_value);
			if (dirty & /*flightPlan*/ 8 && t11_value !== (t11_value = /*flightPlan*/ ctx[3].routePoints.length + "")) set_data(t11, t11_value);

			if (/*flightPlan*/ ctx[3].cruiseAltitudeFeet) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(div1, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*flightPlan, formatCoord*/ 8) {
				each_value = ensure_array_like(/*flightPlan*/ ctx[3].routePoints);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div3, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div2);
				detach(t13);
				detach(hr0);
				detach(t14);
				detach(div3);
				detach(t15);
				detach(hr1);
				detach(t16);
				detach(button0);
				detach(t18);
				detach(button1);
			}

			if (if_block) if_block.d();
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (49:16) {#if flightPlan.cruiseAltitudeFeet}
function create_if_block_1(ctx) {
	let span;
	let t0;
	let t1_value = /*flightPlan*/ ctx[3].cruiseAltitudeFeet + "";
	let t1;
	let t2;

	return {
		c() {
			span = element("span");
			t0 = text("Altitude: ");
			t1 = text(t1_value);
			t2 = text(" ft");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t0);
			append(span, t1);
			append(span, t2);
		},
		p(ctx, dirty) {
			if (dirty & /*flightPlan*/ 8 && t1_value !== (t1_value = /*flightPlan*/ ctx[3].cruiseAltitudeFeet + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (59:12) {#each flightPlan.routePoints as rp, index}
function create_each_block(ctx) {
	let div;
	let span0;
	let t0_value = /*rp*/ ctx[17].waypoint.identifier + "";
	let t0;
	let t1;
	let span1;
	let t2_value = formatCoord(/*rp*/ ctx[17].waypoint.lat, 'lat') + "";
	let t2;
	let t3;
	let t4_value = formatCoord(/*rp*/ ctx[17].waypoint.lon, 'lon') + "";
	let t4;
	let t5;

	return {
		c() {
			div = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			span1 = element("span");
			t2 = text(t2_value);
			t3 = space();
			t4 = text(t4_value);
			t5 = space();
			attr(span0, "class", "waypoint-id svelte-hvh21y");
			attr(span1, "class", "waypoint-coords svelte-hvh21y");
			attr(div, "class", "waypoint-item svelte-hvh21y");
			toggle_class(div, "airport", /*rp*/ ctx[17].waypoint.type === 'airport');
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span0);
			append(span0, t0);
			append(div, t1);
			append(div, span1);
			append(span1, t2);
			append(span1, t3);
			append(span1, t4);
			append(div, t5);
		},
		p(ctx, dirty) {
			if (dirty & /*flightPlan*/ 8 && t0_value !== (t0_value = /*rp*/ ctx[17].waypoint.identifier + "")) set_data(t0, t0_value);
			if (dirty & /*flightPlan*/ 8 && t2_value !== (t2_value = formatCoord(/*rp*/ ctx[17].waypoint.lat, 'lat') + "")) set_data(t2, t2_value);
			if (dirty & /*flightPlan*/ 8 && t4_value !== (t4_value = formatCoord(/*rp*/ ctx[17].waypoint.lon, 'lon') + "")) set_data(t4, t4_value);

			if (dirty & /*flightPlan*/ 8) {
				toggle_class(div, "airport", /*rp*/ ctx[17].waypoint.type === 'airport');
			}
		},
		d(detaching) {
			if (detaching) {
				detach(div);
			}
		}
	};
}

function create_fragment(ctx) {
	let div0;
	let t1;
	let section;
	let div1;
	let t3;
	let div2;
	let t4;
	let input;
	let t5;
	let t6;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*isDragging*/ ctx[1]) return create_if_block_3;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*errorMessage*/ ctx[2] && create_if_block_2(ctx);
	let if_block2 = /*flightPlan*/ ctx[3] && create_if_block(ctx);

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${/*title*/ ctx[4]}`;
			t1 = space();
			section = element("section");
			div1 = element("div");
			div1.textContent = `${/*title*/ ctx[4]}`;
			t3 = space();
			div2 = element("div");
			if_block0.c();
			t4 = space();
			input = element("input");
			t5 = space();
			if (if_block1) if_block1.c();
			t6 = space();
			if (if_block2) if_block2.c();
			attr(div0, "class", "plugin__mobile-header");
			attr(div1, "class", "plugin__title plugin__title--chevron-back");
			attr(div2, "class", "drop-zone svelte-hvh21y");
			toggle_class(div2, "drag-over", /*isDragging*/ ctx[1]);
			attr(input, "type", "file");
			attr(input, "accept", ".fpl");
			set_style(input, "display", "none");
			attr(section, "class", "plugin__content");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div1);
			append(section, t3);
			append(section, div2);
			if_block0.m(div2, null);
			append(section, t4);
			append(section, input);
			/*input_binding*/ ctx[14](input);
			append(section, t5);
			if (if_block1) if_block1.m(section, null);
			append(section, t6);
			if (if_block2) if_block2.m(section, null);

			if (!mounted) {
				dispose = [
					listen(div1, "click", /*click_handler*/ ctx[10]),
					listen(div2, "dragover", prevent_default(/*dragover_handler*/ ctx[11])),
					listen(div2, "dragleave", /*dragleave_handler*/ ctx[12]),
					listen(div2, "drop", prevent_default(/*handleDrop*/ ctx[5])),
					listen(div2, "click", /*click_handler_1*/ ctx[13]),
					listen(input, "change", /*handleFileSelect*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div2, null);
				}
			}

			if (dirty & /*isDragging*/ 2) {
				toggle_class(div2, "drag-over", /*isDragging*/ ctx[1]);
			}

			if (/*errorMessage*/ ctx[2]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_2(ctx);
					if_block1.c();
					if_block1.m(section, t6);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*flightPlan*/ ctx[3]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block(ctx);
					if_block2.c();
					if_block2.m(section, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(section);
			}

			if_block0.d();
			/*input_binding*/ ctx[14](null);
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

function formatCoord(value, type) {
	const abs = Math.abs(value);
	const deg = abs.toFixed(2);

	if (type === 'lat') {
		return `${deg}°${value >= 0 ? 'N' : 'S'}`;
	}

	return `${deg}°${value >= 0 ? 'E' : 'W'}`;
}

function generateDistanceUrl(plan) {
	const waypoints = plan.routePoints.map(rp => `${rp.waypoint.lat.toFixed(4)},${rp.waypoint.lon.toFixed(4)}`).join(';');
	return `https://www.windy.com/distance/${waypoints}`;
}

function instance($$self, $$props, $$invalidate) {
	const { title } = config;
	let fileInput;
	let isDragging = false;
	let errorMessage = '';
	let flightPlan = null;
	let renderer = null;

	async function handleFile(file) {
		$$invalidate(2, errorMessage = '');

		if (!file.name.toLowerCase().endsWith('.fpl')) {
			$$invalidate(2, errorMessage = 'Please select a .fpl file');
			return;
		}

		try {
			const content = await file.text();
			$$invalidate(3, flightPlan = parseFplFile(content));

			if (!renderer) {
				renderer = new RouteRenderer({ map });
			}

			renderer.render(flightPlan);
		} catch(err) {
			$$invalidate(2, errorMessage = err instanceof Error
			? err.message
			: 'Failed to parse file');

			$$invalidate(3, flightPlan = null);
		}
	}

	function handleDrop(event) {
		$$invalidate(1, isDragging = false);
		const file = event.dataTransfer?.files[0];

		if (file) {
			handleFile(file);
		}
	}

	function handleFileSelect(event) {
		const input = event.target;
		const file = input.files?.[0];

		if (file) {
			handleFile(file);
		}

		input.value = '';
	}

	function clearRoute() {
		renderer?.clear();
		$$invalidate(3, flightPlan = null);
		$$invalidate(2, errorMessage = '');
	}

	function openInDistance() {
		if (!flightPlan) return;
		const url = generateDistanceUrl(flightPlan);
		window.open(url, '_blank');
	}

	const onopen = _params => {
		
	};

	onMount(() => {
		renderer = new RouteRenderer({ map });
	});

	onDestroy(() => {
		renderer?.clear();
	});

	const click_handler = () => bcast.emit('rqstOpen', 'menu');
	const dragover_handler = () => $$invalidate(1, isDragging = true);
	const dragleave_handler = () => $$invalidate(1, isDragging = false);
	const click_handler_1 = () => fileInput.click();

	function input_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			fileInput = $$value;
			$$invalidate(0, fileInput);
		});
	}

	return [
		fileInput,
		isDragging,
		errorMessage,
		flightPlan,
		title,
		handleDrop,
		handleFileSelect,
		clearRoute,
		openInDistance,
		onopen,
		click_handler,
		dragover_handler,
		dragleave_handler,
		click_handler_1,
		input_binding
	];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 9 }, add_css);
	}

	get onopen() {
		return this.$$.ctx[9];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
