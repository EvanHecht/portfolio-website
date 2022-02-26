
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

    /* src\svelte-components\NavBar.svelte generated by Svelte v3.46.4 */

    function add_css$2(target) {
    	append_styles(target, "svelte-1wdsr9t", "@keyframes svelte-1wdsr9t-appear-from-top{from{opacity:0%;transform:translateY(-5rem)}to{opacity:100%;transform:translateY(0rem)}}@keyframes svelte-1wdsr9t-appear-from-left{from{opacity:0%;transform:translateX(-10rem)}to{opacity:100%;transform:translateX(0rem)}}#container.svelte-1wdsr9t{width:100%;position:fixed;z-index:10}ul.svelte-1wdsr9t{list-style-type:none;overflow:hidden;text-align:right;height:4rem;line-height:4rem;padding:0.5rem 0 0.5rem 0}li.svelte-1wdsr9t{display:inline-block;height:100%;padding:0rem 1rem;opacity:0}a.svelte-1wdsr9t{color:var(--palette-color-2);display:inline-block;font-size:x-large;font-family:'Rubik';text-decoration:none;height:100%;padding:0 1rem;border-radius:1rem;border:1rem;transition:0.5s;opacity:1}a.svelte-1wdsr9t:hover{background-color:var(--palette-color-4);color:var(--palette-color-1);transform:translateX(-1rem)}img.svelte-1wdsr9t{display:inline-block;height:100%}#logo.svelte-1wdsr9t{float:left;padding-left:1rem;animation:svelte-1wdsr9t-appear-from-left 0.5s 0s forwards}#link_1.svelte-1wdsr9t{animation:svelte-1wdsr9t-appear-from-top 0.5s 0s forwards}#link_2.svelte-1wdsr9t{animation:svelte-1wdsr9t-appear-from-top 0.5s 0.1s forwards}#link_3.svelte-1wdsr9t{animation:svelte-1wdsr9t-appear-from-top 0.5s 0.2s forwards}");
    }

    function create_fragment$3(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");

    			div.innerHTML = `<ul class="svelte-1wdsr9t"><li id="logo" class="svelte-1wdsr9t"><img src="resources/images/greeb_games_logo.png" alt="Greeb Games logo" class="svelte-1wdsr9t"/></li> 
    <li id="link_1" class="svelte-1wdsr9t"><a href="dfd" class="svelte-1wdsr9t">HOME</a></li> 
    <li id="link_2" class="svelte-1wdsr9t"><a href="dfd" class="svelte-1wdsr9t">PROJECTS</a></li> 
    <li id="link_3" class="svelte-1wdsr9t"><a href="dfd" class="svelte-1wdsr9t">ABOUT</a></li></ul>`;

    			attr(div, "id", "container");
    			attr(div, "class", "svelte-1wdsr9t");
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

    class NavBar extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$3, safe_not_equal, {}, add_css$2);
    	}
    }

    /* src\svelte-components\TitleSequence.svelte generated by Svelte v3.46.4 */

    function add_css$1(target) {
    	append_styles(target, "svelte-rj4wlr", "@keyframes svelte-rj4wlr-appear-from-top{from{opacity:0%;transform:translateY(-10rem)}to{opacity:100%;transform:translateY(0rem)}}@keyframes svelte-rj4wlr-appear-from-bottom{from{opacity:0%;transform:translateY(10rem)}to{opacity:100%;transform:translateY(0rem)}}@keyframes svelte-rj4wlr-arrow-animation{0%{opacity:0%}10%{opacity:100%;transform:translateY(0rem)}20%{opacity:100%;transform:translateY(2rem)}30%{transform:translateY(0rem);opacity:100%\r\n        }40%{transform:translateY(2rem);opacity:100%\r\n        }50%{transform:translateY(0rem);opacity:100%\r\n        }60%{transform:translateY(2rem);opacity:100%\r\n        }70%{transform:translateY(0rem);opacity:100%\r\n        }80%{transform:translateY(2rem);opacity:100%\r\n        }90%{transform:translateY(0rem);opacity:100%\r\n        }100%{transform:translateY(2rem);opacity:0%\r\n        }}h1.svelte-rj4wlr{text-align:center;color:silver;font-family:\"Rubik\";font-weight:1;font-size:80px;margin:8rem 0 0 0;opacity:0;animation:svelte-rj4wlr-appear-from-top 1s 1s forwards}h2.svelte-rj4wlr{text-align:center;color:grey;font-family:\"Rubik\";font-weight:1;font-size:40px;margin:0 0 2rem;opacity:0;animation:svelte-rj4wlr-appear-from-bottom 1s 2s forwards}#arrow.svelte-rj4wlr{width:3%;image-rendering:crisp-edges;margin:3rem 48.5%;opacity:0;animation:svelte-rj4wlr-arrow-animation 5s 3s forwards}");
    }

    function create_fragment$2(ctx) {
    	let h1;
    	let t1;
    	let h2;
    	let t3;
    	let img;
    	let img_src_value;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = "Hi, I'm Evan";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Thanks for stopping by";
    			t3 = space();
    			img = element("img");
    			attr(h1, "id", "title");
    			attr(h1, "class", "svelte-rj4wlr");
    			attr(h2, "class", "svelte-rj4wlr");
    			attr(img, "id", "arrow");
    			if (!src_url_equal(img.src, img_src_value = "resources/images/arrow.png")) attr(img, "src", img_src_value);
    			attr(img, "alt", "arrow");
    			attr(img, "class", "svelte-rj4wlr");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			insert(target, h2, anchor);
    			insert(target, t3, anchor);
    			insert(target, img, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(h2);
    			if (detaching) detach(t3);
    			if (detaching) detach(img);
    		}
    	};
    }

    class TitleSequence extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$2, safe_not_equal, {}, add_css$1);
    	}
    }

    /* src\svelte-components\InfoCard.svelte generated by Svelte v3.46.4 */

    function add_css(target) {
    	append_styles(target, "svelte-1ypllwl", "#container.svelte-1ypllwl{display:grid;grid-template-rows:fit-content(6rem) auto;grid-template-columns:fit-content(25%) fit-content(75%);background-color:var(--palette-color-2);gap:1rem;padding:1rem;width:80%;margin:0 10% 8rem 10%;border-radius:3rem;opacity:0%;transform:translateX(-10rem);transition:0.75s;box-shadow:0 1.5rem 1rem #000000c0;border-style:outset;border-radius:3rem;border-width:.5rem;border-color:var(--palette-color-4);font-size:100%;overflow:hidden}#header.svelte-1ypllwl{grid-row-start:1;grid-row-end:2;grid-column-start:2;grid-column-end:3;min-width:100%;height:fit-content;overflow:hidden;font-family:\"Secular One\";text-align:center;font-size:500%;margin:0;color:var(--palette-color-1);font-weight:lighter}#image_area.svelte-1ypllwl{grid-row-start:1;grid-row-end:3;grid-column-start:1;grid-column-end:2;width:100%}#text_area.svelte-1ypllwl{grid-row-start:2;grid-row-end:3;grid-column-start:2;grid-column-end:3;font-family:\"Rubik\";text-align:left;width:100%;font-size:2.4rem;color:var(--palette-color-1);line-height:3.25rem;margin:0;vertical-align:top}");
    }

    function create_fragment$1(ctx) {
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
    			attr(h1, "class", "svelte-1ypllwl");
    			attr(div0, "id", "image_area");
    			attr(div0, "class", "svelte-1ypllwl");
    			attr(div1, "id", "text_area");
    			attr(div1, "class", "svelte-1ypllwl");
    			attr(div2, "id", "container");
    			attr(div2, "class", "svelte-1ypllwl");
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
    	const rect = element.getBoundingClientRect();
    	return rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    }

    function instance($$self, $$props, $$invalidate) {
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
    		console.log(paths_list);

    		if (paths_list.length == 0) {
    			$$invalidate(6, text_area.style.gridColumnStart = '1', text_area);
    			$$invalidate(4, header_ref.style.gridColumnStart = '1', header_ref);
    			$$invalidate(6, text_area.style.textAlign = 'center', text_area);
    			console.log("bruh");
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
    		} else {
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
    			instance,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				image_paths: 7,
    				header: 0,
    				header_color: 1,
    				text: 2
    			},
    			add_css
    		);
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */

    function create_fragment(ctx) {
    	let navbar;
    	let t0;
    	let div0;
    	let t1;
    	let titlesequence;
    	let t2;
    	let div1;
    	let t3;
    	let infocard0;
    	let t4;
    	let infocard1;
    	let t5;
    	let infocard2;
    	let t6;
    	let infocard3;
    	let current;
    	navbar = new NavBar({});
    	titlesequence = new TitleSequence({});

    	infocard0 = new InfoCard({
    			props: {
    				image_paths: "resources/images/picture_of_me.jpg",
    				header: "Welcome to my Site!",
    				text: "My name is Evan Hecht. I am a senior at the Milwaukee School of Engineering where I am currently pursing\r\na bachelor's degree in Software Engineering. I built this site using Node.js and the Svelte framework, and intend to use it as a hub to display all\r\nof my work. I enjoy programming both inside and outside of school, and you can take a look at what I've been up to under the\r\n<a style='" + in_text_link_style + "' href=''><b>Projects</b></a>\r\ntab. Alternatively, continue scrolling down to learn more about me."
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
    				text: "High school is where I really began pursuing computer science in a more serious way. I took all of the available computer science and programming courses, and even attended programming competitions.\r\nThe instructor for these classes really encouraged us to pursue what we were interested in and gave us the class periods to do whatever we wanted, granted it was CS related. I chose to learn more\r\nabout game development, and began messing with the GameMaker: Studio game engine. I would make small projects that would focus on a specific area of game dev that I wanted to learn about.\r\nOne of these projects was a 2d wave-based shooter game I called 'Grompula'. During my senior year I would revisit this project and begin to expand upon it. I ended up working on it through the summer between high school\r\nand college, often for 12+ hours a day. I eventually published it to Steam, where it is currently available to play for free. While its nothing groundbreaking, its humbling to look back upon and see\r\nhow much I've learned since, and is one of my favorite projects made to this date. You can check it out under the \r\n<a style='" + in_text_link_style + "' href=''><b>Projects</b></a>\r\ntab if you are interested.\r\n"
    			}
    		});

    	infocard3 = new InfoCard({
    			props: {
    				header: "College (Present day)",
    				text: "After my exposure to programming in high school, I was confident that I wanted to pursue programming as a career. At the time, my brother was attending a nearby university called\r\nThe Milwaukee School of Engineering, or MSOE for short. I decided I would apply to their Software Engineering program, and I was accepted. I shared a dorm with a friend from high school until\r\nCovid hit, and since then have been living off campus near the school.Throughout my time here, I've learned more about software engineering that I ever expected to, and I believe it has more\r\nthan adequately prepared for my future career. I continue to work on projects (mostly games) in my free time, and I am as eagar to continue as I was when I first began."
    			}
    		});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			create_component(titlesequence.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			t3 = space();
    			create_component(infocard0.$$.fragment);
    			t4 = space();
    			create_component(infocard1.$$.fragment);
    			t5 = space();
    			create_component(infocard2.$$.fragment);
    			t6 = space();
    			create_component(infocard3.$$.fragment);
    			set_style(div0, "height", "20rem");
    			set_style(div1, "height", "10rem");
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			insert(target, div0, anchor);
    			insert(target, t1, anchor);
    			mount_component(titlesequence, target, anchor);
    			insert(target, t2, anchor);
    			insert(target, div1, anchor);
    			insert(target, t3, anchor);
    			mount_component(infocard0, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(infocard1, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(infocard2, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(infocard3, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(titlesequence.$$.fragment, local);
    			transition_in(infocard0.$$.fragment, local);
    			transition_in(infocard1.$$.fragment, local);
    			transition_in(infocard2.$$.fragment, local);
    			transition_in(infocard3.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(titlesequence.$$.fragment, local);
    			transition_out(infocard0.$$.fragment, local);
    			transition_out(infocard1.$$.fragment, local);
    			transition_out(infocard2.$$.fragment, local);
    			transition_out(infocard3.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			if (detaching) detach(div0);
    			if (detaching) detach(t1);
    			destroy_component(titlesequence, detaching);
    			if (detaching) detach(t2);
    			if (detaching) detach(div1);
    			if (detaching) detach(t3);
    			destroy_component(infocard0, detaching);
    			if (detaching) detach(t4);
    			destroy_component(infocard1, detaching);
    			if (detaching) detach(t5);
    			destroy_component(infocard2, detaching);
    			if (detaching) detach(t6);
    			destroy_component(infocard3, detaching);
    		}
    	};
    }

    let in_text_link_style = 'text-decoration: none; color: var(--palette-color-1); transition: 1s; background-color: var(--palette-color-4); border-radius: 1rem; padding: .25rem';

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment, safe_not_equal, {});
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
