
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function append_styles(target, style_sheet_id, styles) {
        const append_styles_to = get_root_for_style(target);
        if (!append_styles_to.getElementById(style_sheet_id)) {
            const style = element('style');
            style.id = style_sheet_id;
            style.textContent = styles;
            append_stylesheet(append_styles_to, style);
        }
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
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
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
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
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* src\svelte-components\TitleSequence.svelte generated by Svelte v3.46.4 */

    function add_css$5(target) {
    	append_styles(target, "svelte-1pk1t17", "@keyframes svelte-1pk1t17-appear-from-top{from{opacity:0%;transform:translateY(-10rem)}to{opacity:100%;transform:translateY(0rem)}}@keyframes svelte-1pk1t17-appear-from-bottom{from{opacity:0%;transform:translateY(10rem)}to{opacity:100%;transform:translateY(0rem)}}@keyframes svelte-1pk1t17-arrow-animation{0%{opacity:0%}10%{opacity:100%;transform:translateY(0vw)}20%{opacity:100%;transform:translateY(3vw)}30%{transform:translateY(0vw);opacity:100%\r\n        }40%{transform:translateY(3vw);opacity:100%\r\n        }50%{transform:translateY(0vw);opacity:100%\r\n        }60%{transform:translateY(3vw);opacity:100%\r\n        }70%{transform:translateY(0vw);opacity:100%\r\n        }80%{transform:translateY(3vw);opacity:100%\r\n        }90%{transform:translateY(0vw);opacity:100%\r\n        }100%{transform:translateY(3vw);opacity:0%\r\n        }}h1.svelte-1pk1t17{text-align:center;color:silver;font-family:\"Rubik\";font-weight:1;font-size:calc(12px + 3.5vw);margin:8rem 0 0 0;opacity:0;animation:svelte-1pk1t17-appear-from-top 1s .5s forwards}h2.svelte-1pk1t17{text-align:center;color:grey;font-family:\"Rubik\";font-weight:1;font-size:calc(12px + 1.5vw);margin:0 0 2rem;opacity:0;animation:svelte-1pk1t17-appear-from-bottom 1s 1.5s forwards}#arrow_container.svelte-1pk1t17{width:4vw;margin:0 auto;padding:0}#arrow.svelte-1pk1t17{width:100%;image-rendering:crisp-edges;opacity:0;animation:svelte-1pk1t17-arrow-animation 5s 2.5s forwards;margin:0;padding:0}");
    }

    function create_fragment$7(ctx) {
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let div;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = "Hi, I'm Evan";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Thanks for stopping by";
    			t3 = space();
    			div = element("div");
    			div.innerHTML = `<img id="arrow" src="resources/images/arrow.png" alt="arrow" class="svelte-1pk1t17"/>`;
    			attr(h1, "id", "title");
    			attr(h1, "class", "svelte-1pk1t17");
    			attr(h2, "class", "svelte-1pk1t17");
    			attr(div, "id", "arrow_container");
    			attr(div, "class", "svelte-1pk1t17");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			insert(target, h2, anchor);
    			insert(target, t3, anchor);
    			insert(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(h2);
    			if (detaching) detach(t3);
    			if (detaching) detach(div);
    		}
    	};
    }

    class TitleSequence extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$7, safe_not_equal, {}, add_css$5);
    	}
    }

    /* src\svelte-components\InfoCard.svelte generated by Svelte v3.46.4 */

    function add_css$4(target) {
    	append_styles(target, "svelte-tlf7oz", "#container.svelte-tlf7oz{display:grid;grid-template-rows:min-content auto;grid-template-columns:fit-content(25%) fit-content(75%);background-color:var(--palette-color-3);gap:1vw;padding:1vw;width:80%;margin:0 10% 8vw 10%;border-radius:3vw;opacity:0%;transform:translateX(-10rem);transition:0.75s;box-shadow:0 1.5vw 1vw #000000c0;border-style:outset;border-radius:3vw;border-width:.5vw;border-color:var(--palette-color-4);overflow:hidden}#header.svelte-tlf7oz{grid-row-start:1;grid-row-end:2;grid-column-start:2;grid-column-end:3;min-width:100%;height:fit-content;overflow:hidden;font-family:\"Secular One\";text-align:center;font-size:3vw;margin:0;color:var(--palette-color-2);font-weight:lighter}#image_area.svelte-tlf7oz{grid-row-start:1;grid-row-end:3;grid-column-start:1;grid-column-end:2;width:100%;margin:auto}#text_area.svelte-tlf7oz{display:inline;grid-row-start:2;grid-row-end:3;grid-column-start:2;grid-column-end:3;font-family:\"Rubik\";text-align:left;width:100%;font-size:1.75vw;color:var(--palette-color-2);margin:0;vertical-align:top;line-height:2vw}");
    }

    function create_fragment$6(ctx) {
    	let div2;
    	let h1;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let div1;

    	return {
    		c() {
    			div2 = element("div");
    			h1 = element("h1");
    			t0 = text(/*header*/ ctx[0]);
    			t1 = space();
    			div0 = element("div");
    			t2 = space();
    			div1 = element("div");
    			attr(h1, "id", "header");
    			set_style(h1, "color", /*header_color*/ ctx[1]);
    			attr(h1, "class", "svelte-tlf7oz");
    			attr(div0, "id", "image_area");
    			attr(div0, "class", "svelte-tlf7oz");
    			attr(div1, "id", "text_area");
    			attr(div1, "class", "svelte-tlf7oz");
    			attr(div2, "id", "container");
    			attr(div2, "class", "svelte-tlf7oz");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, h1);
    			append(h1, t0);
    			/*h1_binding*/ ctx[8](h1);
    			append(div2, t1);
    			append(div2, div0);
    			/*div0_binding*/ ctx[9](div0);
    			append(div2, t2);
    			append(div2, div1);
    			div1.innerHTML = /*text*/ ctx[2];
    			/*div1_binding*/ ctx[10](div1);
    			/*div2_binding*/ ctx[11](div2);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*header*/ 1) set_data(t0, /*header*/ ctx[0]);

    			if (dirty & /*header_color*/ 2) {
    				set_style(h1, "color", /*header_color*/ ctx[1]);
    			}

    			if (dirty & /*text*/ 4) div1.innerHTML = /*text*/ ctx[2];		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div2);
    			/*h1_binding*/ ctx[8](null);
    			/*div0_binding*/ ctx[9](null);
    			/*div1_binding*/ ctx[10](null);
    			/*div2_binding*/ ctx[11](null);
    		}
    	};
    }

    function ShouldReveal(element) {
    	if (element == null) return null;
    	const rect = element.getBoundingClientRect();
    	return rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { image_paths } = $$props;
    	let { header } = $$props;
    	let { header_color } = $$props;
    	let { text } = $$props;
    	let container;
    	let header_ref;
    	let image_area;
    	let text_area;
    	let paths_list = [];

    	if (typeof image_paths != "undefined") {
    		paths_list = image_paths.split(" ");
    	}

    	onMount(async () => {
    		if (paths_list.length == 0) {
    			$$invalidate(6, text_area.style.gridColumnStart = '1', text_area);
    			$$invalidate(4, header_ref.style.gridColumnStart = '1', header_ref);
    			$$invalidate(6, text_area.style.textAlign = 'center', text_area);
    		}

    		// Add images
    		let i = 1;

    		paths_list.forEach(element => {
    			// If there is at least 1 image, resize the image area
    			let img = document.createElement('img');

    			img.src = element;
    			img.classList.add('image');
    			if (i < paths_list.length) img.style.marginBottom = '1rem';
    			image_area.appendChild(img);
    			i++;
    		});
    	});

    	document.addEventListener('scroll', function (e) {
    		if (ShouldReveal(container)) {
    			$$invalidate(3, container.style.opacity = '100%', container);
    			$$invalidate(3, container.style.transform = 'translateX(0rem)', container);
    		} else if (container !== null) {
    			$$invalidate(3, container.style.opacity = '0%', container);
    			$$invalidate(3, container.style.transform = 'translateX(-10rem)', container);
    		}
    	});

    	function h1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			header_ref = $$value;
    			$$invalidate(4, header_ref);
    		});
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			image_area = $$value;
    			$$invalidate(5, image_area);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			text_area = $$value;
    			$$invalidate(6, text_area);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(3, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('image_paths' in $$props) $$invalidate(7, image_paths = $$props.image_paths);
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    		if ('header_color' in $$props) $$invalidate(1, header_color = $$props.header_color);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	return [
    		header,
    		header_color,
    		text,
    		container,
    		header_ref,
    		image_area,
    		text_area,
    		image_paths,
    		h1_binding,
    		div0_binding,
    		div1_binding,
    		div2_binding
    	];
    }

    class InfoCard extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(
    			this,
    			options,
    			instance$3,
    			create_fragment$6,
    			safe_not_equal,
    			{
    				image_paths: 7,
    				header: 0,
    				header_color: 1,
    				text: 2
    			},
    			add_css$4
    		);
    	}
    }

    /* src\svelte-components\HomePage.svelte generated by Svelte v3.46.4 */

    function create_fragment$5(ctx) {
    	let titlesequence;
    	let t0;
    	let div;
    	let t1;
    	let infocard0;
    	let t2;
    	let infocard1;
    	let t3;
    	let infocard2;
    	let t4;
    	let infocard3;
    	let current;
    	titlesequence = new TitleSequence({});

    	infocard0 = new InfoCard({
    			props: {
    				image_paths: "resources/images/picture_of_me.jpg",
    				header: "Welcome to my Site!",
    				text: "My name is Evan Hecht. I am a senior at the Milwaukee School of Engineering where I am currently pursing\r\na bachelor's degree in Software Engineering. I built this site using Node.js and the Svelte framework, and intend to use it as a hub to display all\r\nof my work. I enjoy programming both inside and outside of school, and you can take a look at what I've been up to under the Projects\r\ntab. Alternatively, continue scrolling down to learn more about me."
    			}
    		});

    	infocard1 = new InfoCard({
    			props: {
    				image_paths: "resources/images/young_me.jpg",
    				header: "As a Kid",
    				text: "As a kid, when I wasn't rocking those sweet shades, I was most likely playing video games. For equally as long, I've been intrigued with how they worked. This curiosity is what\r\ninitially steered me towards computer science. My parents got me my first laptop when I was 10 and for better or worse, I've had unrestricted access to the\r\ninternet since. Right away I wanted to learn about programming, but it was a bit daunting of a task for 10 year old me. Lucky for me, a small game called Minecraft came out around the same time.\r\nIt allowed for the creation of custom maps within the game which I utilized extensively."
    			}
    		});

    	infocard2 = new InfoCard({
    			props: {
    				header: "High School",
    				image_paths: "resources/images/faze_crew.jpg resources/images/grompula_art.jpg",
    				text: "High school is where I really began pursuing computer science in a more serious way. I took all of the available computer science and programming courses, and even attended programming competitions.\r\nThe instructor for these classes really encouraged us to pursue what we were interested in and gave us the class periods to do whatever we wanted, granted it was CS related. I chose to learn more\r\nabout game development, and began messing with the GameMaker: Studio game engine. I would make small projects that would focus on a specific area of game dev that I wanted to learn about.\r\nOne of these projects was a 2d wave-based shooter game I called 'Grompula'. During my senior year I would revisit this project and begin to expand upon it. I ended up working on it through the summer between high school\r\nand college, often for 12+ hours a day. I eventually published it to Steam, where it is currently available to play for free. While its nothing groundbreaking, its humbling to look back upon and see\r\nhow much I've learned since, and is one of my favorite projects made to this date. You can check it out under the projects tab if you are interested."
    			}
    		});

    	infocard3 = new InfoCard({
    			props: {
    				header: "College (Present Day)",
    				image_paths: "resources/images/msoe_logo.jpg",
    				text: "After my exposure to programming in high school, I was confident that I wanted to pursue programming as a career. At the time, my brother was attending a nearby university called\r\nThe Milwaukee School of Engineering, or MSOE for short. I decided I would apply to their Software Engineering program, and I was accepted. I shared a dorm with a friend from high school until\r\nCovid hit, and since then have been living off campus near the school. Throughout my time here, I've learned more about software engineering that I ever expected to, and I believe it has more\r\nthan adequately prepared for my future career. I continue to work on software projects in my free time, and I am as eagar to continue as I was when I first began."
    			}
    		});

    	return {
    		c() {
    			create_component(titlesequence.$$.fragment);
    			t0 = space();
    			div = element("div");
    			t1 = space();
    			create_component(infocard0.$$.fragment);
    			t2 = space();
    			create_component(infocard1.$$.fragment);
    			t3 = space();
    			create_component(infocard2.$$.fragment);
    			t4 = space();
    			create_component(infocard3.$$.fragment);
    			set_style(div, "height", "12vw");
    		},
    		m(target, anchor) {
    			mount_component(titlesequence, target, anchor);
    			insert(target, t0, anchor);
    			insert(target, div, anchor);
    			insert(target, t1, anchor);
    			mount_component(infocard0, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(infocard1, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(infocard2, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(infocard3, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(titlesequence.$$.fragment, local);
    			transition_in(infocard0.$$.fragment, local);
    			transition_in(infocard1.$$.fragment, local);
    			transition_in(infocard2.$$.fragment, local);
    			transition_in(infocard3.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(titlesequence.$$.fragment, local);
    			transition_out(infocard0.$$.fragment, local);
    			transition_out(infocard1.$$.fragment, local);
    			transition_out(infocard2.$$.fragment, local);
    			transition_out(infocard3.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(titlesequence, detaching);
    			if (detaching) detach(t0);
    			if (detaching) detach(div);
    			if (detaching) detach(t1);
    			destroy_component(infocard0, detaching);
    			if (detaching) detach(t2);
    			destroy_component(infocard1, detaching);
    			if (detaching) detach(t3);
    			destroy_component(infocard2, detaching);
    			if (detaching) detach(t4);
    			destroy_component(infocard3, detaching);
    		}
    	};
    }

    class HomePage extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$5, safe_not_equal, {});
    	}
    }

    /* src\svelte-components\ProjectCard.svelte generated by Svelte v3.46.4 */

    function add_css$3(target) {
    	append_styles(target, "svelte-1hqd0z2", "@keyframes svelte-1hqd0z2-intro_animation{0%{opacity:0%;transform:translateY(10rem)}100%{opacity:100%;transform:translateY(0rem)}}#Container.svelte-1hqd0z2{background-color:var(--palette-color-3);height:fit-content;max-height:55vw;margin:0;display:grid;grid-template-columns:auto;grid-template-rows:.25fr 2fr fit-content 1.25fr;border-radius:3vw 3vw;padding:2.5%;box-shadow:0 1.5vw 1vw;border-style:outset;border-radius:3vw;border-width:.25vw;border-color:var(--palette-color-4);animation:forwards svelte-1hqd0z2-intro_animation .5s;padding-bottom:2vw;min-height:100%}#Header.svelte-1hqd0z2{text-align:center;font-family:'Rubik';color:var(--palette-color-2);font-weight:bold;font-size:3vw;grid-row:1;margin:auto}#Image.svelte-1hqd0z2{grid-row:2;grid-column:1;max-width:100%;width:auto;height:auto;margin:auto;padding-bottom:5%;padding-top:5%;border-radius:3vw}#Text.svelte-1hqd0z2{grid-row:3;grid-column:1;text-align:center;font-family:'Rubik';color:var(--palette-color-2);font-size:1.25vw;margin:auto;line-height:1.5vw}#Button.svelte-1hqd0z2{grid-row:4;grid-column:1;height:90%;width:90%;margin:auto;border-radius:2vw;background-color:var(--palette-color-4);font-size:1.5vw;font-family:'Rubik';transition:.35s;border-style:solid;border-color:var(--palette-color-3)}#Button.svelte-1hqd0z2:hover{color:var(--palette-color-2);border-style:solid;border-color:var(--palette-color-3);width:80%;cursor:pointer}");
    }

    function create_fragment$4(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let button_1;

    	return {
    		c() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			p = element("p");
    			t3 = text(/*project_description*/ ctx[2]);
    			t4 = space();
    			button_1 = element("button");
    			attr(h1, "id", "Header");
    			attr(h1, "class", "svelte-1hqd0z2");
    			attr(img, "id", "Image");
    			if (!src_url_equal(img.src, img_src_value = /*image_path*/ ctx[1])) attr(img, "src", img_src_value);
    			attr(img, "alt", "Project Art");
    			attr(img, "class", "svelte-1hqd0z2");
    			attr(p, "id", "Text");
    			attr(p, "class", "svelte-1hqd0z2");
    			attr(button_1, "id", "Button");
    			attr(button_1, "class", "svelte-1hqd0z2");
    			attr(div, "id", "Container");
    			attr(div, "class", "svelte-1hqd0z2");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h1);
    			append(h1, t0);
    			append(div, t1);
    			append(div, img);
    			append(div, t2);
    			append(div, p);
    			append(p, t3);
    			append(div, t4);
    			append(div, button_1);
    			/*button_1_binding*/ ctx[6](button_1);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data(t0, /*title*/ ctx[0]);

    			if (dirty & /*image_path*/ 2 && !src_url_equal(img.src, img_src_value = /*image_path*/ ctx[1])) {
    				attr(img, "src", img_src_value);
    			}

    			if (dirty & /*project_description*/ 4) set_data(t3, /*project_description*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			/*button_1_binding*/ ctx[6](null);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { title = "PROJECT TITLE" } = $$props;
    	let { image_path = "./resources/images/octo_tower.png" } = $$props;
    	let { project_description = "This is the project description, its super long and im just trying to take up space with all of these words " } = $$props;
    	let { button_text = "DOWNLOAD" } = $$props;
    	let { button_path = "https://www.google.com/" } = $$props; //"../resources/downloads/carrots_app.zip"
    	let button;

    	onMount(async () => {
    		$$invalidate(3, button.innerHTML = button_text, button);

    		$$invalidate(
    			3,
    			button.onclick = () => {
    				window.location.href = button_path;
    			},
    			button
    		);
    	});

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(3, button);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('image_path' in $$props) $$invalidate(1, image_path = $$props.image_path);
    		if ('project_description' in $$props) $$invalidate(2, project_description = $$props.project_description);
    		if ('button_text' in $$props) $$invalidate(4, button_text = $$props.button_text);
    		if ('button_path' in $$props) $$invalidate(5, button_path = $$props.button_path);
    	};

    	return [
    		title,
    		image_path,
    		project_description,
    		button,
    		button_text,
    		button_path,
    		button_1_binding
    	];
    }

    class ProjectCard extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				title: 0,
    				image_path: 1,
    				project_description: 2,
    				button_text: 4,
    				button_path: 5
    			},
    			add_css$3
    		);
    	}
    }

    /* src\svelte-components\Projects.svelte generated by Svelte v3.46.4 */

    function add_css$2(target) {
    	append_styles(target, "svelte-11t83j3", "@keyframes svelte-11t83j3-intro_animation{0%{opacity:0%;transform:translateY(-10rem)}100%{opacity:100%;transform:translateY(0rem)}}h1.svelte-11t83j3{text-align:center;font-family:'Secular One';font-size:4vw;color:var(--palette-color-2);text-shadow:0.50vw 0.50vw black;margin-bottom:7vw;animation:forwards svelte-11t83j3-intro_animation .5s\r\n    }#ProjectGrid.svelte-11t83j3{width:75%;height:fit-content;margin:0 12.5% 50vw 12.5%;display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:max-content max-content max-content;gap:7%}.green.svelte-11t83j3{color:var(--palette-color-4)\r\n    }");
    }

    function create_fragment$3(ctx) {
    	let h1;
    	let t3;
    	let div;
    	let projectcard0;
    	let t4;
    	let projectcard1;
    	let t5;
    	let projectcard2;
    	let t6;
    	let projectcard3;
    	let t7;
    	let projectcard4;
    	let t8;
    	let projectcard5;
    	let t9;
    	let projectcard6;
    	let t10;
    	let projectcard7;
    	let current;

    	projectcard0 = new ProjectCard({
    			props: {
    				title: "GROMPULA",
    				image_path: "../resources/images/grompula_art.jpg",
    				button_text: "STEAM PAGE",
    				button_path: "https://store.steampowered.com/app/904500/Grompula/",
    				project_description: "A game I independently developed and published in 2018.\r\n    I used the GameMaker: Studio 2 engine in tandum with their custom language, GML (similar to JavaScript).\r\n    It is currently available for free on Steam."
    			}
    		});

    	projectcard1 = new ProjectCard({
    			props: {
    				title: "PORTFOLIO SITE",
    				image_path: "../resources/images/portfolio_icon.png",
    				button_text: "GO TO REPO",
    				button_path: "https://github.com/EvanHecht/portfolio-website",
    				project_description: "The very website you are currently on! I made it using Node.js and the Svelte framework. This was my first\r\n    project using Svelte and I am really enjoying it! You can take a look at this site's source code below."
    			}
    		});

    	projectcard2 = new ProjectCard({
    			props: {
    				title: "TETRAGUN",
    				image_path: "../resources/images/tetragun_art.jpg",
    				button_text: "WATCH VIDEO",
    				button_path: "https://www.youtube.com/watch?v=Ck9jCnDNaOE",
    				project_description: "A top down shooter game where you play as a stationary turret. Each wave you survive you gain upgrades but so do your enemies. I've\r\n    currently paused it's development but I intend to resume in the next few months."
    			}
    		});

    	projectcard3 = new ProjectCard({
    			props: {
    				title: "OCTO TOWER",
    				image_path: "../resources/images/octo_tower.png",
    				button_text: "GO TO REPO",
    				button_path: "https://github.com/EvanHecht/Octo-Tower",
    				project_description: "A 'Rogue-Like' game I made inspired by Asteroids. Each level is randomly generated and contains randomized enemies and power-ups.\r\n    It is more of a prototype than a finished game, but I am proud with how it turned out! I made this in 2019 using GameMaker: Studio 2 and GML."
    			}
    		});

    	projectcard4 = new ProjectCard({
    			props: {
    				title: "FIGHT STYLE",
    				image_path: "../resources/images/skinny_genius.png",
    				button_text: "GO TO REPO",
    				button_path: "https://github.com/EvanHecht/Fight-Style",
    				project_description: "A small fighting game prototype I made in 2018. Two players fight each other using your character's four abilities. You can download\r\n    and play it by visiting the repo."
    			}
    		});

    	projectcard5 = new ProjectCard({
    			props: {
    				title: "CHIX 4 A CAUSE IOS APP",
    				image_path: "../resources/images/chix4acause_logo.png",
    				button_text: "VISIT",
    				button_path: "https://www.chix4acause.org/",
    				project_description: "An iOS app I worked on with my SDL team for school. Users can purchase gift boxes for loved ones struggling with cancer, or apply to be sent one. Was\r\n    inherited by the next SDL team to continue development. You can visit the Chix 4 a Cause site below."
    			}
    		});

    	projectcard6 = new ProjectCard({
    			props: {
    				title: "RAIDER RUMBLE",
    				image_path: "../resources/images/raider_rumble_logo.png",
    				button_text: "PLAY",
    				button_path: "../resources/pages/raider_rumble_web/raider_rumble.html",
    				project_description: "My Senior Thesis project for my Software Engineering degree. It is an MSOE themed platform fighter and arcade cabinet.\r\n    I served as the lead gameplay programmer on a team of 4 other students. Click the button to play in the browser!"
    			}
    		});

    	projectcard7 = new ProjectCard({
    			props: {
    				title: "CARROTS",
    				image_path: "../resources/images/carrot.png",
    				button_text: "GODOT GAME ENGINE",
    				button_path: "https://godotengine.org/",
    				project_description: "An investment simulator app I am currently developing using the Godot game engine. Players will be able to buy and sell simulated stocks.\r\n    I would not like to reveal the source code as I plan to publish the game in the near future,\r\n    and would not like to compromise the security of it's networking features."
    			}
    		});

    	return {
    		c() {
    			h1 = element("h1");
    			h1.innerHTML = `<span class="green svelte-11t83j3">[ </span>P R O J E C T S <span class="green svelte-11t83j3">]</span>`;
    			t3 = space();
    			div = element("div");
    			create_component(projectcard0.$$.fragment);
    			t4 = space();
    			create_component(projectcard1.$$.fragment);
    			t5 = space();
    			create_component(projectcard2.$$.fragment);
    			t6 = space();
    			create_component(projectcard3.$$.fragment);
    			t7 = space();
    			create_component(projectcard4.$$.fragment);
    			t8 = space();
    			create_component(projectcard5.$$.fragment);
    			t9 = space();
    			create_component(projectcard6.$$.fragment);
    			t10 = space();
    			create_component(projectcard7.$$.fragment);
    			attr(h1, "class", "svelte-11t83j3");
    			attr(div, "id", "ProjectGrid");
    			attr(div, "class", "svelte-11t83j3");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, div, anchor);
    			mount_component(projectcard0, div, null);
    			append(div, t4);
    			mount_component(projectcard1, div, null);
    			append(div, t5);
    			mount_component(projectcard2, div, null);
    			append(div, t6);
    			mount_component(projectcard3, div, null);
    			append(div, t7);
    			mount_component(projectcard4, div, null);
    			append(div, t8);
    			mount_component(projectcard5, div, null);
    			append(div, t9);
    			mount_component(projectcard6, div, null);
    			append(div, t10);
    			mount_component(projectcard7, div, null);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(projectcard0.$$.fragment, local);
    			transition_in(projectcard1.$$.fragment, local);
    			transition_in(projectcard2.$$.fragment, local);
    			transition_in(projectcard3.$$.fragment, local);
    			transition_in(projectcard4.$$.fragment, local);
    			transition_in(projectcard5.$$.fragment, local);
    			transition_in(projectcard6.$$.fragment, local);
    			transition_in(projectcard7.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(projectcard0.$$.fragment, local);
    			transition_out(projectcard1.$$.fragment, local);
    			transition_out(projectcard2.$$.fragment, local);
    			transition_out(projectcard3.$$.fragment, local);
    			transition_out(projectcard4.$$.fragment, local);
    			transition_out(projectcard5.$$.fragment, local);
    			transition_out(projectcard6.$$.fragment, local);
    			transition_out(projectcard7.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(div);
    			destroy_component(projectcard0);
    			destroy_component(projectcard1);
    			destroy_component(projectcard2);
    			destroy_component(projectcard3);
    			destroy_component(projectcard4);
    			destroy_component(projectcard5);
    			destroy_component(projectcard6);
    			destroy_component(projectcard7);
    		}
    	};
    }

    class Projects extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$3, safe_not_equal, {}, add_css$2);
    	}
    }

    const current_page = writable(HomePage);

    /* src\svelte-components\Contact.svelte generated by Svelte v3.46.4 */

    function add_css$1(target) {
    	append_styles(target, "svelte-5x3n0o", "@keyframes svelte-5x3n0o-intro_animation{0%{opacity:0%;transform:translateY(-10vw)}100%{opacity:100%;transform:translateY(0vw)}}h1.svelte-5x3n0o{text-align:center;font-family:'Secular One';font-size:3.5vw;color:var(--palette-color-2);text-shadow:0.5vw 0.5vw black;margin-bottom:5vw;animation:forwards svelte-5x3n0o-intro_animation .5s\r\n    }h2.svelte-5x3n0o{text-align:center;font-family:'Rubik';font-size:2vw;color:var(--palette-color-2);text-shadow:0.5vw 0.5vw black;margin-bottom:5vw}.green.svelte-5x3n0o{color:var(--palette-color-4)\r\n    }#contact_area.svelte-5x3n0o{display:block;width:70%;height:100%;margin:5vw auto;animation:forwards svelte-5x3n0o-intro_animation .5s\r\n    }h3.svelte-5x3n0o{font-size:2vw;text-align:center;color:var(--palette-color-2);font-family:'Rubik'}a.svelte-5x3n0o{color:var(--palette-color-2)}");
    }

    function create_fragment$2(ctx) {
    	let h1;
    	let t3;
    	let div;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.innerHTML = `<span class="green svelte-5x3n0o">[</span> C O N T A C T <span class="green svelte-5x3n0o">]</span>`;
    			t3 = space();
    			div = element("div");

    			div.innerHTML = `<h2 class="svelte-5x3n0o">Feel free to contact me at any of the following:</h2> 
    <h3 class="svelte-5x3n0o"><span class="green svelte-5x3n0o">EMAIL:</span> evanhecht01@gmail.com</h3> 
    <h3 class="svelte-5x3n0o"><span class="green svelte-5x3n0o">PHONE:</span> (414)-336-8237</h3> 
    <h3 class="svelte-5x3n0o"><span class="green svelte-5x3n0o">LINKEDIN: </span><a href="https://www.linkedin.com/in/hechtevan/" class="svelte-5x3n0o">linkedin.com/in/hechtevan/</a></h3>`;

    			attr(h1, "class", "svelte-5x3n0o");
    			attr(div, "id", "contact_area");
    			attr(div, "class", "svelte-5x3n0o");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(div);
    		}
    	};
    }

    class Contact extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$2, safe_not_equal, {}, add_css$1);
    	}
    }

    /* src\svelte-components\NavBar.svelte generated by Svelte v3.46.4 */

    function add_css(target) {
    	append_styles(target, "svelte-aajw2d", "@keyframes svelte-aajw2d-appear-from-top{from{opacity:0%;transform:translateY(-5rem)}to{opacity:100%;transform:translateY(0rem)}}@keyframes svelte-aajw2d-appear-from-left{from{opacity:0%;transform:translateX(-10rem)}to{opacity:100%;transform:translateX(0rem)}}#container.svelte-aajw2d{width:100%;position:fixed;z-index:10;transition:.5s;height:10%;max-height:9%;min-height:9%;overflow:hidden}ul.svelte-aajw2d{list-style-type:none;width:100%;height:100%;text-align:right;margin:0;padding:0}li.svelte-aajw2d{display:inline-flex;align-items:center;width:fit-content;height:100%;line-height:100%;opacity:0;margin:auto;padding:0 .75vw 0 1vw}a.svelte-aajw2d{color:var(--palette-color-2);display:inline-block;font-size:1.5vw;font-family:'Rubik';text-decoration:none;border-radius:3vw;border:1vw;transition:0.5s;opacity:1;width:100%;line-height:100%;padding:1vw}a.svelte-aajw2d:hover{background-color:var(--palette-color-4);color:var(--palette-color-1);transform:translateX(-1vw)}img.svelte-aajw2d{max-height:3vw;margin:auto}#logo.svelte-aajw2d{margin-left:0;float:left;padding-left:1vw;animation:svelte-aajw2d-appear-from-left 0.5s 0s forwards}#link_1.svelte-aajw2d{animation:svelte-aajw2d-appear-from-top 0.5s 0s forwards}#link_2.svelte-aajw2d{animation:svelte-aajw2d-appear-from-top 0.5s 0.1s forwards}#link_3.svelte-aajw2d{animation:svelte-aajw2d-appear-from-top 0.5s 0.2s forwards}");
    }

    function create_fragment$1(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");

    			div.innerHTML = `<ul class="svelte-aajw2d"><li id="logo" class="svelte-aajw2d"><img src="resources/images/EvanHecht.png" alt="Greeb Games logo" class="svelte-aajw2d"/></li> 
    <li id="link_1" class="svelte-aajw2d"><a id="HomeLink" href="#" class="svelte-aajw2d">HOME</a></li> 
    <li id="link_2" class="svelte-aajw2d"><a id="ProjectsLink" href="#" class="svelte-aajw2d">PROJECTS</a></li> 
    <li id="link_3" class="svelte-aajw2d"><a id="ContactLink" href="#" class="svelte-aajw2d">CONTACT</a></li></ul>`;

    			attr(div, "id", "container");
    			attr(div, "class", "svelte-aajw2d");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    function instance$1($$self) {
    	onMount(async () => {
    		document.getElementById("HomeLink").onclick = () => {
    			window.scrollTo(0, 0);
    			current_page.set(HomePage);
    			return false;
    		};

    		document.getElementById("ProjectsLink").onclick = () => {
    			window.scrollTo(0, 0);
    			current_page.set(Projects);
    			return false;
    		};

    		document.getElementById("ContactLink").onclick = () => {
    			window.scrollTo(0, 0);
    			current_page.set(Contact);
    			return false;
    		};
    	});

    	document.addEventListener('scroll', function (e) {
    		if (window.scrollY > 0) {
    			document.getElementById("container").style.backgroundColor = "var(--palette-color-3)";
    		} else if (window.scrollY == 0) {
    			document.getElementById("container").style.backgroundColor = "transparent";
    		}
    	});

    	return [];
    }

    class NavBar extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css);
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */

    function create_fragment(ctx) {
    	let navbar;
    	let updating_page;
    	let t0;
    	let div;
    	let t1;
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	function navbar_page_binding(value) {
    		/*navbar_page_binding*/ ctx[1](value);
    	}

    	let navbar_props = {};

    	if (/*page*/ ctx[0] !== void 0) {
    		navbar_props.page = /*page*/ ctx[0];
    	}

    	navbar = new NavBar({ props: navbar_props });
    	binding_callbacks.push(() => bind(navbar, 'page', navbar_page_binding));
    	var switch_value = /*page*/ ctx[0];

    	function switch_props(ctx) {
    		return { props: { id: "PageComponent" } };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div = element("div");
    			t1 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    			set_style(div, "height", "8vh");
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			insert(target, div, anchor);
    			insert(target, t1, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (!updating_page && dirty & /*page*/ 1) {
    				updating_page = true;
    				navbar_changes.page = /*page*/ ctx[0];
    				add_flush_callback(() => updating_page = false);
    			}

    			navbar.$set(navbar_changes);

    			if (switch_value !== (switch_value = /*page*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			if (detaching) detach(div);
    			if (detaching) detach(t1);
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let page = current_page;

    	current_page.subscribe(value => {
    		$$invalidate(0, page = value);
    	});

    	function navbar_page_binding(value) {
    		page = value;
    		$$invalidate(0, page);
    	}

    	return [page, navbar_page_binding];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, {});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		//name: 'world'
    	}
    });

    return app;

})();
