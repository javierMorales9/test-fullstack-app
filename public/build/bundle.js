(function (l, r) {
  if (!l || l.getElementById("livereloadscript")) return;
  r = l.createElement("script");
  r.async = 1;
  r.src =
    "//" +
    (self.location.host || "localhost").split(":")[0] +
    ":35729/livereload.js?snipver=1";
  r.id = "livereloadscript";
  l.getElementsByTagName("head")[0].appendChild(r);
})(self.document);
var sdk = (function () {
  "use strict";

  function noop() {}
  function assign(tar, src) {
    // @ts-ignore
    for (const k in src) tar[k] = src[k];
    return tar;
  }
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
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a
      ? b == b
      : a !== b || (a && typeof a === "object") || typeof a === "function";
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
      ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
      : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === undefined) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(
    slot,
    slot_definition,
    ctx,
    $$scope,
    slot_changes,
    get_slot_context_fn,
  ) {
    if (slot_changes) {
      const slot_context = get_slot_context(
        slot_definition,
        ctx,
        $$scope,
        get_slot_context_fn,
      );
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element) {
    return Array.from(element.childNodes);
  }
  function set_data(text, data) {
    data = "" + data;
    if (text.wholeText !== data) text.data = data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? "" : value;
  }
  function set_style(node, key, value, important) {
    if (value === null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function toggle_class(element, name, toggle) {
    element.classList[toggle ? "add" : "remove"](name);
  }

  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  /**
   * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
   * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
   * it can be called from an external module).
   *
   * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
   *
   * https://svelte.dev/docs#run-time-svelte-onmount
   */
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  /**
   * Associates an arbitrary `context` object with the current component and the specified `key`
   * and returns that object. The context is then available to children of the component
   * (including slotted content) with `getContext`.
   *
   * Like lifecycle functions, this must be called during component initialisation.
   *
   * https://svelte.dev/docs#run-time-svelte-setcontext
   */
  function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
    return context;
  }
  /**
   * Retrieves the context that belongs to the closest parent component with the specified `key`.
   * Must be called during component initialisation.
   *
   * https://svelte.dev/docs#run-time-svelte-getcontext
   */
  function getContext(key) {
    return get_current_component().$$.context.get(key);
  }

  const dirty_components = [];
  const binding_callbacks = [];
  let render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = /* @__PURE__ */ Promise.resolve();
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
   */
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) =>
      fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c),
    );
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  const outroing = new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros, // parent group
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
      if (outroing.has(block)) return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach) block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      // onMount happens before the initial afterUpdate
      add_render_callback(() => {
        const new_on_destroy = component.$$.on_mount
          .map(run)
          .filter(is_function);
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
    }
    after_update.forEach(add_render_callback);
  }
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
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
  }
  function init(
    component,
    options,
    instance,
    create_fragment,
    not_equal,
    props,
    append_styles,
    dirty = [-1],
  ) {
    const parent_component = current_component;
    set_current_component(component);
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
      context: new Map(
        options.context ||
          (parent_component ? parent_component.$$.context : []),
      ),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root,
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
        const nodes = children(options.target);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c();
      }
      if (options.intro) transition_in(component.$$.fragment);
      mount_component(
        component,
        options.target,
        options.anchor,
        options.customElement,
      );
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
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks =
        this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
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

  const Events = {
    SurveyShown: "survey_shown",
    SurveyClosed: "survey_closed",
    SurveyCompleted: "survey_completed",
    SurveyCancelled: "survey_cancelled",
    AnswerSubmitted: "answer_submitted",
  };

  const events = {
    init(targetId) {
      this.target = document.getElementById(targetId);
    },

    dispatchSurveyShown(data) {
      const _event = new CustomEvent(Events.SurveyShown, {
        bubbles: true,
        detail: { ...data },
      });
      this.target.dispatchEvent(_event);
    },

    dispatchSurveyClosed(data) {
      const _event = new CustomEvent(Events.SurveyClosed, {
        bubbles: true,
        detail: { ...data },
      });
      this.target.dispatchEvent(_event);
    },

    dispatchSurveyCompleted(data) {
      const _event = new CustomEvent(Events.SurveyCompleted, {
        bubbles: true,
        detail: { ...data },
      });
      this.target.dispatchEvent(_event);
    },

    dispatchSurveyCancelled(data) {
      const _event = new CustomEvent(Events.SurveyCancelled, {
        bubbles: true,
        detail: { ...data },
      });
      this.target.dispatchEvent(_event);
    },

    dispatchAnswerSubmitted(data) {
      const _event = new CustomEvent(Events.AnswerSubmitted, {
        bubbles: true,
        detail: { ...data },
      });
      this.target.dispatchEvent(_event);
    },

    onSurveyShown(callback) {
      this.target.addEventListener(Events.SurveyShown, (e) => {
        callback(e.detail);
      });
    },

    onSurveyClosed(callback) {
      this.target.addEventListener(Events.SurveyClosed, (e) => {
        callback(e.detail);
      });
    },
    onSurveyCompleted(callback) {
      this.target.addEventListener(Events.SurveyCompleted, (e) => {
        callback(e.detail);
      });
    },
    onSurveyCancelled(callback) {
      this.target.addEventListener(Events.SurveyCancelled, (e) => {
        callback(e.detail);
      });
    },
    onAnswerSubmitted(callback) {
      this.target.addEventListener(Events.AnswerSubmitted, (e) => {
        callback(e.detail);
      });
    },
  };

  /* library/components/NPSWidget.svelte generated by Svelte v3.57.0 */

  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[5] = list[i];
    return child_ctx;
  }

  // (7:2) {#if survey}
  function create_if_block$5(ctx) {
    let h2;
    let t0_value = /*survey*/ ctx[0].question + "";
    let t0;
    let t1;
    let p;
    let t2_value = /*survey*/ ctx[0].explanation + "";
    let t2;
    let t3;
    let div0;
    let t4;
    let div1;
    let each_value = /*ratings*/ ctx[3];
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block$1(
        get_each_context$1(ctx, each_value, i),
      );
    }

    return {
      c() {
        h2 = element("h2");
        t0 = text(t0_value);
        t1 = space();
        p = element("p");
        t2 = text(t2_value);
        t3 = space();
        div0 = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        t4 = space();
        div1 = element("div");

        div1.innerHTML = `<span>Not likely at all</span> 
      <span>Extremely Likely</span>`;

        toggle_class(
          h2,
          "text-white",
          /*surveyDesign*/ ctx[2].isBackgroundDark,
        );
        attr(p, "class", "mt-2 text-sm font-thin text-gray-400");
        attr(div0, "class", "mt-4 flex justify-between");
        attr(
          div1,
          "class",
          "mt-2 flex justify-between text-sm font-thin text-gray-400",
        );
      },
      m(target, anchor) {
        insert(target, h2, anchor);
        append(h2, t0);
        insert(target, t1, anchor);
        insert(target, p, anchor);
        append(p, t2);
        insert(target, t3, anchor);
        insert(target, div0, anchor);

        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div0, null);
          }
        }

        insert(target, t4, anchor);
        insert(target, div1, anchor);
      },
      p(ctx, dirty) {
        if (
          dirty & /*survey*/ 1 &&
          t0_value !== (t0_value = /*survey*/ ctx[0].question + "")
        )
          set_data(t0, t0_value);

        if (dirty & /*surveyDesign*/ 4) {
          toggle_class(
            h2,
            "text-white",
            /*surveyDesign*/ ctx[2].isBackgroundDark,
          );
        }

        if (
          dirty & /*survey*/ 1 &&
          t2_value !== (t2_value = /*survey*/ ctx[0].explanation + "")
        )
          set_data(t2, t2_value);

        if (dirty & /*ratings, save*/ 10) {
          each_value = /*ratings*/ ctx[3];
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context$1(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block$1(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(div0, null);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }
      },
      d(detaching) {
        if (detaching) detach(h2);
        if (detaching) detach(t1);
        if (detaching) detach(p);
        if (detaching) detach(t3);
        if (detaching) detach(div0);
        destroy_each(each_blocks, detaching);
        if (detaching) detach(t4);
        if (detaching) detach(div1);
      },
    };
  }

  // (15:6) {#each ratings as rating}
  function create_each_block$1(ctx) {
    let span;
    let t_value = /*rating*/ ctx[5] + "";
    let t;
    let mounted;
    let dispose;

    function click_handler() {
      return /*click_handler*/ ctx[4](/*rating*/ ctx[5]);
    }

    return {
      c() {
        span = element("span");
        t = text(t_value);
        attr(
          span,
          "class",
          "rounded-md py-2 px-2 font-thin hover:cursor-pointer",
        );
        toggle_class(span, "bg-green-200", /*rating*/ ctx[5] > 8);
        toggle_class(
          span,
          "bg-orange-100",
          /*rating*/ ctx[5] <= 8 && /*rating*/ ctx[5] > 6,
        );
        toggle_class(span, "bg-red-100", /*rating*/ ctx[5] <= 6);
      },
      m(target, anchor) {
        insert(target, span, anchor);
        append(span, t);

        if (!mounted) {
          dispose = listen(span, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
      },
      d(detaching) {
        if (detaching) detach(span);
        mounted = false;
        dispose();
      },
    };
  }

  function create_fragment$7(ctx) {
    let div;
    let if_block = /*survey*/ ctx[0] && create_if_block$5(ctx);

    return {
      c() {
        div = element("div");
        if (if_block) if_block.c();
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block) if_block.m(div, null);
      },
      p(ctx, [dirty]) {
        if (/*survey*/ ctx[0]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$5(ctx);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) detach(div);
        if (if_block) if_block.d();
      },
    };
  }

  function instance$7($$self, $$props, $$invalidate) {
    let { survey, save, surveyDesign } = $$props;
    const ratings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const click_handler = (rating) => save({ value: rating });

    $$self.$$set = ($$props) => {
      if ("survey" in $$props) $$invalidate(0, (survey = $$props.survey));
      if ("save" in $$props) $$invalidate(1, (save = $$props.save));
      if ("surveyDesign" in $$props)
        $$invalidate(2, (surveyDesign = $$props.surveyDesign));
    };

    return [survey, save, surveyDesign, ratings, click_handler];
  }

  class NPSWidget extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$7, create_fragment$7, safe_not_equal, {
        survey: 0,
        save: 1,
        surveyDesign: 2,
      });
    }
  }

  /* library/components/OpenText.svelte generated by Svelte v3.57.0 */

  function create_if_block$4(ctx) {
    let h2;
    let t0_value = /*survey*/ ctx[0].question + "";
    let t0;
    let t1;
    let p;
    let t2_value = /*survey*/ ctx[0].explanation + "";
    let t2;
    let t3;
    let textarea;
    let textarea_placeholder_value;
    let t4;
    let div;
    let button0;
    let t5;
    let t6;
    let button1;
    let t7;
    let mounted;
    let dispose;

    return {
      c() {
        h2 = element("h2");
        t0 = text(t0_value);
        t1 = space();
        p = element("p");
        t2 = text(t2_value);
        t3 = space();
        textarea = element("textarea");
        t4 = space();
        div = element("div");
        button0 = element("button");
        t5 = text("Skip");
        t6 = space();
        button1 = element("button");
        t7 = text("Submit");
        toggle_class(
          h2,
          "text-white",
          /*surveyDesign*/ ctx[2].isBackgroundDark,
        );
        attr(p, "class", "mt-2 mb-2 text-sm font-thin text-gray-400");
        attr(
          textarea,
          "class",
          "mt-2 w-full rounded border border-gray-300 p-2 font-thin",
        );
        attr(
          textarea,
          "placeholder",
          (textarea_placeholder_value = /*survey*/ ctx[0].placeholder),
        );
        attr(button0, "type", "button");
        attr(
          button0,
          "class",
          "flex-1 rounded border border-gray-300 p-2 font-thin",
        );
        set_style(
          button0,
          "background-color",
          /*surveyDesign*/ ctx[2].primaryColor,
        );
        toggle_class(
          button0,
          "text-white",
          /*surveyDesign*/ ctx[2].isPrimaryColorDark,
        );
        attr(button1, "type", "button");
        attr(
          button1,
          "class",
          "flex-1 rounded border border-gray-300 p-2 font-thin",
        );
        set_style(
          button1,
          "background-color",
          /*surveyDesign*/ ctx[2].primaryColor,
        );
        toggle_class(
          button1,
          "text-white",
          /*surveyDesign*/ ctx[2].isPrimaryColorDark,
        );
        attr(div, "class", "mt-4 flex justify-between gap-x-4");
      },
      m(target, anchor) {
        insert(target, h2, anchor);
        append(h2, t0);
        insert(target, t1, anchor);
        insert(target, p, anchor);
        append(p, t2);
        insert(target, t3, anchor);
        insert(target, textarea, anchor);
        set_input_value(textarea, /*userInput*/ ctx[3]);
        insert(target, t4, anchor);
        insert(target, div, anchor);
        append(div, button0);
        append(button0, t5);
        append(div, t6);
        append(div, button1);
        append(button1, t7);

        if (!mounted) {
          dispose = [
            listen(textarea, "input", /*textarea_input_handler*/ ctx[4]),
            listen(button0, "click", /*click_handler*/ ctx[5]),
            listen(button1, "click", /*click_handler_1*/ ctx[6]),
          ];

          mounted = true;
        }
      },
      p(ctx, dirty) {
        if (
          dirty & /*survey*/ 1 &&
          t0_value !== (t0_value = /*survey*/ ctx[0].question + "")
        )
          set_data(t0, t0_value);

        if (dirty & /*surveyDesign*/ 4) {
          toggle_class(
            h2,
            "text-white",
            /*surveyDesign*/ ctx[2].isBackgroundDark,
          );
        }

        if (
          dirty & /*survey*/ 1 &&
          t2_value !== (t2_value = /*survey*/ ctx[0].explanation + "")
        )
          set_data(t2, t2_value);

        if (
          dirty & /*survey*/ 1 &&
          textarea_placeholder_value !==
            (textarea_placeholder_value = /*survey*/ ctx[0].placeholder)
        ) {
          attr(textarea, "placeholder", textarea_placeholder_value);
        }

        if (dirty & /*userInput*/ 8) {
          set_input_value(textarea, /*userInput*/ ctx[3]);
        }

        if (dirty & /*surveyDesign*/ 4) {
          set_style(
            button0,
            "background-color",
            /*surveyDesign*/ ctx[2].primaryColor,
          );
        }

        if (dirty & /*surveyDesign*/ 4) {
          toggle_class(
            button0,
            "text-white",
            /*surveyDesign*/ ctx[2].isPrimaryColorDark,
          );
        }

        if (dirty & /*surveyDesign*/ 4) {
          set_style(
            button1,
            "background-color",
            /*surveyDesign*/ ctx[2].primaryColor,
          );
        }

        if (dirty & /*surveyDesign*/ 4) {
          toggle_class(
            button1,
            "text-white",
            /*surveyDesign*/ ctx[2].isPrimaryColorDark,
          );
        }
      },
      d(detaching) {
        if (detaching) detach(h2);
        if (detaching) detach(t1);
        if (detaching) detach(p);
        if (detaching) detach(t3);
        if (detaching) detach(textarea);
        if (detaching) detach(t4);
        if (detaching) detach(div);
        mounted = false;
        run_all(dispose);
      },
    };
  }

  function create_fragment$6(ctx) {
    let div;
    let if_block = /*survey*/ ctx[0] && create_if_block$4(ctx);

    return {
      c() {
        div = element("div");
        if (if_block) if_block.c();
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block) if_block.m(div, null);
      },
      p(ctx, [dirty]) {
        if (/*survey*/ ctx[0]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$4(ctx);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) detach(div);
        if (if_block) if_block.d();
      },
    };
  }

  function instance$6($$self, $$props, $$invalidate) {
    let { survey, save, surveyDesign } = $$props;
    let userInput;

    function textarea_input_handler() {
      userInput = this.value;
      $$invalidate(3, userInput);
    }

    const click_handler = () => save({ value: "" });
    const click_handler_1 = () => save({ value: userInput });

    $$self.$$set = ($$props) => {
      if ("survey" in $$props) $$invalidate(0, (survey = $$props.survey));
      if ("save" in $$props) $$invalidate(1, (save = $$props.save));
      if ("surveyDesign" in $$props)
        $$invalidate(2, (surveyDesign = $$props.surveyDesign));
    };

    return [
      survey,
      save,
      surveyDesign,
      userInput,
      textarea_input_handler,
      click_handler,
      click_handler_1,
    ];
  }

  class OpenText extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$6, create_fragment$6, safe_not_equal, {
        survey: 0,
        save: 1,
        surveyDesign: 2,
      });
    }
  }

  /* library/components/CTAWidget.svelte generated by Svelte v3.57.0 */

  function create_if_block$3(ctx) {
    let h2;
    let t0_value = /*survey*/ ctx[0].headline + "";
    let t0;
    let t1;
    let p;
    let t2_value = /*survey*/ ctx[0].explanation + "";
    let t2;
    let t3;
    let a;
    let t4_value = /*survey*/ ctx[0].linkText + "";
    let t4;
    let a_href_value;
    let mounted;
    let dispose;

    return {
      c() {
        h2 = element("h2");
        t0 = text(t0_value);
        t1 = space();
        p = element("p");
        t2 = text(t2_value);
        t3 = space();
        a = element("a");
        t4 = text(t4_value);
        toggle_class(
          h2,
          "text-white",
          /*surveyDesign*/ ctx[2].isBackgroundDark,
        );
        attr(p, "class", "mt-4 text-sm font-thin text-gray-400");
        attr(a, "href", (a_href_value = /*survey*/ ctx[0].linkUrl));
        attr(a, "target", "_blank");
        attr(
          a,
          "class",
          "relative mt-4 w-full overflow-hidden rounded py-2 text-center font-thin hover:cursor-pointer",
        );
        set_style(a, "background-color", /*surveyDesign*/ ctx[2].primaryColor);
        attr(a, "type", "button");
        toggle_class(
          a,
          "text-white",
          /*surveyDesign*/ ctx[2].isPrimaryColorDark,
        );
      },
      m(target, anchor) {
        insert(target, h2, anchor);
        append(h2, t0);
        insert(target, t1, anchor);
        insert(target, p, anchor);
        append(p, t2);
        insert(target, t3, anchor);
        insert(target, a, anchor);
        append(a, t4);

        if (!mounted) {
          dispose = listen(a, "click", function () {
            if (is_function(/*save*/ ctx[1]({})))
              /*save*/ ctx[1]({}).apply(this, arguments);
          });

          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (
          dirty & /*survey*/ 1 &&
          t0_value !== (t0_value = /*survey*/ ctx[0].headline + "")
        )
          set_data(t0, t0_value);

        if (dirty & /*surveyDesign*/ 4) {
          toggle_class(
            h2,
            "text-white",
            /*surveyDesign*/ ctx[2].isBackgroundDark,
          );
        }

        if (
          dirty & /*survey*/ 1 &&
          t2_value !== (t2_value = /*survey*/ ctx[0].explanation + "")
        )
          set_data(t2, t2_value);
        if (
          dirty & /*survey*/ 1 &&
          t4_value !== (t4_value = /*survey*/ ctx[0].linkText + "")
        )
          set_data(t4, t4_value);

        if (
          dirty & /*survey*/ 1 &&
          a_href_value !== (a_href_value = /*survey*/ ctx[0].linkUrl)
        ) {
          attr(a, "href", a_href_value);
        }

        if (dirty & /*surveyDesign*/ 4) {
          set_style(
            a,
            "background-color",
            /*surveyDesign*/ ctx[2].primaryColor,
          );
        }

        if (dirty & /*surveyDesign*/ 4) {
          toggle_class(
            a,
            "text-white",
            /*surveyDesign*/ ctx[2].isPrimaryColorDark,
          );
        }
      },
      d(detaching) {
        if (detaching) detach(h2);
        if (detaching) detach(t1);
        if (detaching) detach(p);
        if (detaching) detach(t3);
        if (detaching) detach(a);
        mounted = false;
        dispose();
      },
    };
  }

  function create_fragment$5(ctx) {
    let div;
    let if_block = /*survey*/ ctx[0] && create_if_block$3(ctx);

    return {
      c() {
        div = element("div");
        if (if_block) if_block.c();
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block) if_block.m(div, null);
      },
      p(ctx, [dirty]) {
        if (/*survey*/ ctx[0]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$3(ctx);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) detach(div);
        if (if_block) if_block.d();
      },
    };
  }

  function instance$5($$self, $$props, $$invalidate) {
    let { survey, save, surveyDesign } = $$props;

    $$self.$$set = ($$props) => {
      if ("survey" in $$props) $$invalidate(0, (survey = $$props.survey));
      if ("save" in $$props) $$invalidate(1, (save = $$props.save));
      if ("surveyDesign" in $$props)
        $$invalidate(2, (surveyDesign = $$props.surveyDesign));
    };

    return [survey, save, surveyDesign];
  }

  class CTAWidget extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$5, create_fragment$5, safe_not_equal, {
        survey: 0,
        save: 1,
        surveyDesign: 2,
      });
    }
  }

  /* library/components/Card.svelte generated by Svelte v3.57.0 */

  const get_header_slot_changes = (dirty) => ({});
  const get_header_slot_context = (ctx) => ({});

  function create_fragment$4(ctx) {
    let div2;
    let div0;
    let t0;
    let button;
    let t1;
    let div1;
    let current;
    let mounted;
    let dispose;
    const header_slot_template = /*#slots*/ ctx[3].header;
    const header_slot = create_slot(
      header_slot_template,
      ctx,
      /*$$scope*/ ctx[2],
      get_header_slot_context,
    );
    const default_slot_template = /*#slots*/ ctx[3].default;
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/ ctx[2],
      null,
    );

    return {
      c() {
        div2 = element("div");
        div0 = element("div");
        if (header_slot) header_slot.c();
        t0 = space();
        button = element("button");
        button.innerHTML = `<span><svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#9CA3AF"></path></svg></span>`;
        t1 = space();
        div1 = element("div");
        if (default_slot) default_slot.c();
        attr(button, "type", "button");
        attr(button, "class", "ml-auto");
        attr(div0, "class", "mt-4 mr-4 flex");
        attr(div1, "class", "px-6 pb-6");
        attr(
          div2,
          "class",
          "block max-w-sm border border-gray-200 font-bold shadow",
        );
        set_style(
          div2,
          "background-color",
          /*surveyDesign*/ ctx[1].backgroundColor,
        );
        toggle_class(div2, "rounded-xl", /*surveyDesign*/ ctx[1].roundedCorner);
      },
      m(target, anchor) {
        insert(target, div2, anchor);
        append(div2, div0);

        if (header_slot) {
          header_slot.m(div0, null);
        }

        append(div0, t0);
        append(div0, button);
        append(div2, t1);
        append(div2, div1);

        if (default_slot) {
          default_slot.m(div1, null);
        }

        current = true;

        if (!mounted) {
          dispose = listen(button, "click", function () {
            if (is_function(/*onClose*/ ctx[0]))
              /*onClose*/ ctx[0].apply(this, arguments);
          });

          mounted = true;
        }
      },
      p(new_ctx, [dirty]) {
        ctx = new_ctx;

        if (header_slot) {
          if (header_slot.p && (!current || dirty & /*$$scope*/ 4)) {
            update_slot_base(
              header_slot,
              header_slot_template,
              ctx,
              /*$$scope*/ ctx[2],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
                : get_slot_changes(
                    header_slot_template,
                    /*$$scope*/ ctx[2],
                    dirty,
                    get_header_slot_changes,
                  ),
              get_header_slot_context,
            );
          }
        }

        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[2],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
                : get_slot_changes(
                    default_slot_template,
                    /*$$scope*/ ctx[2],
                    dirty,
                    null,
                  ),
              null,
            );
          }
        }

        if (!current || dirty & /*surveyDesign*/ 2) {
          set_style(
            div2,
            "background-color",
            /*surveyDesign*/ ctx[1].backgroundColor,
          );
        }

        if (!current || dirty & /*surveyDesign*/ 2) {
          toggle_class(
            div2,
            "rounded-xl",
            /*surveyDesign*/ ctx[1].roundedCorner,
          );
        }
      },
      i(local) {
        if (current) return;
        transition_in(header_slot, local);
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(header_slot, local);
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching) detach(div2);
        if (header_slot) header_slot.d(detaching);
        if (default_slot) default_slot.d(detaching);
        mounted = false;
        dispose();
      },
    };
  }

  function instance$4($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let { onClose, surveyDesign } = $$props;

    $$self.$$set = ($$props) => {
      if ("onClose" in $$props) $$invalidate(0, (onClose = $$props.onClose));
      if ("surveyDesign" in $$props)
        $$invalidate(1, (surveyDesign = $$props.surveyDesign));
      if ("$$scope" in $$props) $$invalidate(2, ($$scope = $$props.$$scope));
    };

    return [onClose, surveyDesign, $$scope, slots];
  }

  class Card extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$4, create_fragment$4, safe_not_equal, {
        onClose: 0,
        surveyDesign: 1,
      });
    }
  }

  /* library/components/MultipleChoices.svelte generated by Svelte v3.57.0 */

  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i];
    return child_ctx;
  }

  // (6:2) {#if survey}
  function create_if_block$2(ctx) {
    let h2;
    let t0_value = /*survey*/ ctx[0].question + "";
    let t0;
    let t1;
    let p;
    let t2_value = /*survey*/ ctx[0].explanation + "";
    let t2;
    let t3;
    let each_1_anchor;
    let each_value = /*survey*/ ctx[0].options;
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }

    return {
      c() {
        h2 = element("h2");
        t0 = text(t0_value);
        t1 = space();
        p = element("p");
        t2 = text(t2_value);
        t3 = space();

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        each_1_anchor = empty();
        toggle_class(
          h2,
          "text-white",
          /*surveyDesign*/ ctx[2].isBackgroundDark,
        );
        attr(p, "class", "mt-2 mb-2 text-sm font-thin text-gray-400");
      },
      m(target, anchor) {
        insert(target, h2, anchor);
        append(h2, t0);
        insert(target, t1, anchor);
        insert(target, p, anchor);
        append(p, t2);
        insert(target, t3, anchor);

        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }

        insert(target, each_1_anchor, anchor);
      },
      p(ctx, dirty) {
        if (
          dirty & /*survey*/ 1 &&
          t0_value !== (t0_value = /*survey*/ ctx[0].question + "")
        )
          set_data(t0, t0_value);

        if (dirty & /*surveyDesign*/ 4) {
          toggle_class(
            h2,
            "text-white",
            /*surveyDesign*/ ctx[2].isBackgroundDark,
          );
        }

        if (
          dirty & /*survey*/ 1 &&
          t2_value !== (t2_value = /*survey*/ ctx[0].explanation + "")
        )
          set_data(t2, t2_value);

        if (dirty & /*surveyDesign, save, survey*/ 7) {
          each_value = /*survey*/ ctx[0].options;
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }

          for (; i < each_blocks.length; i += 1) {
            each_blocks[i].d(1);
          }

          each_blocks.length = each_value.length;
        }
      },
      d(detaching) {
        if (detaching) detach(h2);
        if (detaching) detach(t1);
        if (detaching) detach(p);
        if (detaching) detach(t3);
        destroy_each(each_blocks, detaching);
        if (detaching) detach(each_1_anchor);
      },
    };
  }

  // (11:4) {#each survey.options as response}
  function create_each_block(ctx) {
    let div;
    let input;
    let t0;
    let label;
    let t1_value =
      /*response*/ (ctx[4].valuePublic || /*response*/ ctx[4]) + "";
    let t1;
    let t2;
    let mounted;
    let dispose;

    function click_handler() {
      return /*click_handler*/ ctx[3](/*response*/ ctx[4]);
    }

    return {
      c() {
        div = element("div");
        input = element("input");
        t0 = space();
        label = element("label");
        t1 = text(t1_value);
        t2 = space();
        attr(input, "type", "checkbox");
        attr(label, "class", "ml-4 font-thin");
        attr(
          div,
          "class",
          "mt-2 flex items-center rounded-lg border px-4 py-2 hover:cursor-pointer",
        );
        toggle_class(
          div,
          "text-white",
          /*surveyDesign*/ ctx[2].isBackgroundDark,
        );
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, input);
        append(div, t0);
        append(div, label);
        append(label, t1);
        append(div, t2);

        if (!mounted) {
          dispose = listen(div, "click", click_handler);
          mounted = true;
        }
      },
      p(new_ctx, dirty) {
        ctx = new_ctx;
        if (
          dirty & /*survey*/ 1 &&
          t1_value !==
            (t1_value =
              /*response*/ (ctx[4].valuePublic || /*response*/ ctx[4]) + "")
        )
          set_data(t1, t1_value);

        if (dirty & /*surveyDesign*/ 4) {
          toggle_class(
            div,
            "text-white",
            /*surveyDesign*/ ctx[2].isBackgroundDark,
          );
        }
      },
      d(detaching) {
        if (detaching) detach(div);
        mounted = false;
        dispose();
      },
    };
  }

  function create_fragment$3(ctx) {
    let div;
    let if_block = /*survey*/ ctx[0] && create_if_block$2(ctx);

    return {
      c() {
        div = element("div");
        if (if_block) if_block.c();
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block) if_block.m(div, null);
      },
      p(ctx, [dirty]) {
        if (/*survey*/ ctx[0]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$2(ctx);
            if_block.c();
            if_block.m(div, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching) detach(div);
        if (if_block) if_block.d();
      },
    };
  }

  function instance$3($$self, $$props, $$invalidate) {
    let { survey, save, surveyDesign } = $$props;
    const click_handler = (response) =>
      save({ value: response.valuePublic || response });

    $$self.$$set = ($$props) => {
      if ("survey" in $$props) $$invalidate(0, (survey = $$props.survey));
      if ("save" in $$props) $$invalidate(1, (save = $$props.save));
      if ("surveyDesign" in $$props)
        $$invalidate(2, (surveyDesign = $$props.surveyDesign));
    };

    return [survey, save, surveyDesign, click_handler];
  }

  class MultipleChoices extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$3, create_fragment$3, safe_not_equal, {
        survey: 0,
        save: 1,
        surveyDesign: 2,
      });
    }
  }

  /* library/components/Question.svelte generated by Svelte v3.57.0 */

  function create_if_block$1(ctx) {
    let card;
    let current;

    card = new Card({
      props: {
        onClose: /*closeSurvey*/ ctx[0],
        surveyDesign: /*surveyDesign*/ ctx[2],
        $$slots: {
          header: [create_header_slot],
          default: [create_default_slot],
        },
        $$scope: { ctx },
      },
    });

    return {
      c() {
        create_component(card.$$.fragment);
      },
      m(target, anchor) {
        mount_component(card, target, anchor);
        current = true;
      },
      p(ctx, dirty) {
        const card_changes = {};
        if (dirty & /*closeSurvey*/ 1)
          card_changes.onClose = /*closeSurvey*/ ctx[0];
        if (dirty & /*surveyDesign*/ 4)
          card_changes.surveyDesign = /*surveyDesign*/ ctx[2];

        if (
          dirty &
          /*$$scope, totalSteps, step, question, saveResponse, surveyDesign*/ 126
        ) {
          card_changes.$$scope = { dirty, ctx };
        }

        card.$set(card_changes);
      },
      i(local) {
        if (current) return;
        transition_in(card.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(card.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(card, detaching);
      },
    };
  }

  // (28:6) {#if question.type === 'nps'}
  function create_if_block_4(ctx) {
    let npswidget;
    let current;

    npswidget = new NPSWidget({
      props: {
        survey: /*question*/ ctx[3],
        save: /*saveResponse*/ ctx[1],
        surveyDesign: /*surveyDesign*/ ctx[2],
      },
    });

    return {
      c() {
        create_component(npswidget.$$.fragment);
      },
      m(target, anchor) {
        mount_component(npswidget, target, anchor);
        current = true;
      },
      p(ctx, dirty) {
        const npswidget_changes = {};
        if (dirty & /*question*/ 8)
          npswidget_changes.survey = /*question*/ ctx[3];
        if (dirty & /*saveResponse*/ 2)
          npswidget_changes.save = /*saveResponse*/ ctx[1];
        if (dirty & /*surveyDesign*/ 4)
          npswidget_changes.surveyDesign = /*surveyDesign*/ ctx[2];
        npswidget.$set(npswidget_changes);
      },
      i(local) {
        if (current) return;
        transition_in(npswidget.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(npswidget.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(npswidget, detaching);
      },
    };
  }

  // (34:6) {#if question.type === 'cta'}
  function create_if_block_3(ctx) {
    let ctawidget;
    let current;

    ctawidget = new CTAWidget({
      props: {
        survey: /*question*/ ctx[3],
        save: /*saveResponse*/ ctx[1],
        surveyDesign: /*surveyDesign*/ ctx[2],
      },
    });

    return {
      c() {
        create_component(ctawidget.$$.fragment);
      },
      m(target, anchor) {
        mount_component(ctawidget, target, anchor);
        current = true;
      },
      p(ctx, dirty) {
        const ctawidget_changes = {};
        if (dirty & /*question*/ 8)
          ctawidget_changes.survey = /*question*/ ctx[3];
        if (dirty & /*saveResponse*/ 2)
          ctawidget_changes.save = /*saveResponse*/ ctx[1];
        if (dirty & /*surveyDesign*/ 4)
          ctawidget_changes.surveyDesign = /*surveyDesign*/ ctx[2];
        ctawidget.$set(ctawidget_changes);
      },
      i(local) {
        if (current) return;
        transition_in(ctawidget.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(ctawidget.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(ctawidget, detaching);
      },
    };
  }

  // (40:6) {#if question.type === 'select'}
  function create_if_block_2(ctx) {
    let multiplechoices;
    let current;

    multiplechoices = new MultipleChoices({
      props: {
        survey: /*question*/ ctx[3],
        save: /*saveResponse*/ ctx[1],
        surveyDesign: /*surveyDesign*/ ctx[2],
      },
    });

    return {
      c() {
        create_component(multiplechoices.$$.fragment);
      },
      m(target, anchor) {
        mount_component(multiplechoices, target, anchor);
        current = true;
      },
      p(ctx, dirty) {
        const multiplechoices_changes = {};
        if (dirty & /*question*/ 8)
          multiplechoices_changes.survey = /*question*/ ctx[3];
        if (dirty & /*saveResponse*/ 2)
          multiplechoices_changes.save = /*saveResponse*/ ctx[1];
        if (dirty & /*surveyDesign*/ 4)
          multiplechoices_changes.surveyDesign = /*surveyDesign*/ ctx[2];
        multiplechoices.$set(multiplechoices_changes);
      },
      i(local) {
        if (current) return;
        transition_in(multiplechoices.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(multiplechoices.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(multiplechoices, detaching);
      },
    };
  }

  // (46:6) {#if question.type === 'opentext'}
  function create_if_block_1(ctx) {
    let opentext;
    let current;

    opentext = new OpenText({
      props: {
        survey: /*question*/ ctx[3],
        save: /*saveResponse*/ ctx[1],
        surveyDesign: /*surveyDesign*/ ctx[2],
      },
    });

    return {
      c() {
        create_component(opentext.$$.fragment);
      },
      m(target, anchor) {
        mount_component(opentext, target, anchor);
        current = true;
      },
      p(ctx, dirty) {
        const opentext_changes = {};
        if (dirty & /*question*/ 8)
          opentext_changes.survey = /*question*/ ctx[3];
        if (dirty & /*saveResponse*/ 2)
          opentext_changes.save = /*saveResponse*/ ctx[1];
        if (dirty & /*surveyDesign*/ 4)
          opentext_changes.surveyDesign = /*surveyDesign*/ ctx[2];
        opentext.$set(opentext_changes);
      },
      i(local) {
        if (current) return;
        transition_in(opentext.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(opentext.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(opentext, detaching);
      },
    };
  }

  // (24:4) <Card onClose={closeSurvey} surveyDesign={surveyDesign}>
  function create_default_slot(ctx) {
    let t0;
    let t1;
    let t2;
    let if_block3_anchor;
    let current;
    let if_block0 =
      /*question*/ ctx[3].type === "nps" && create_if_block_4(ctx);
    let if_block1 =
      /*question*/ ctx[3].type === "cta" && create_if_block_3(ctx);
    let if_block2 =
      /*question*/ ctx[3].type === "select" && create_if_block_2(ctx);
    let if_block3 =
      /*question*/ ctx[3].type === "opentext" && create_if_block_1(ctx);

    return {
      c() {
        if (if_block0) if_block0.c();
        t0 = space();
        if (if_block1) if_block1.c();
        t1 = space();
        if (if_block2) if_block2.c();
        t2 = space();
        if (if_block3) if_block3.c();
        if_block3_anchor = empty();
      },
      m(target, anchor) {
        if (if_block0) if_block0.m(target, anchor);
        insert(target, t0, anchor);
        if (if_block1) if_block1.m(target, anchor);
        insert(target, t1, anchor);
        if (if_block2) if_block2.m(target, anchor);
        insert(target, t2, anchor);
        if (if_block3) if_block3.m(target, anchor);
        insert(target, if_block3_anchor, anchor);
        current = true;
      },
      p(ctx, dirty) {
        if (/*question*/ ctx[3].type === "nps") {
          if (if_block0) {
            if_block0.p(ctx, dirty);

            if (dirty & /*question*/ 8) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_4(ctx);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(t0.parentNode, t0);
          }
        } else if (if_block0) {
          group_outros();

          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });

          check_outros();
        }

        if (/*question*/ ctx[3].type === "cta") {
          if (if_block1) {
            if_block1.p(ctx, dirty);

            if (dirty & /*question*/ 8) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_3(ctx);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(t1.parentNode, t1);
          }
        } else if (if_block1) {
          group_outros();

          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });

          check_outros();
        }

        if (/*question*/ ctx[3].type === "select") {
          if (if_block2) {
            if_block2.p(ctx, dirty);

            if (dirty & /*question*/ 8) {
              transition_in(if_block2, 1);
            }
          } else {
            if_block2 = create_if_block_2(ctx);
            if_block2.c();
            transition_in(if_block2, 1);
            if_block2.m(t2.parentNode, t2);
          }
        } else if (if_block2) {
          group_outros();

          transition_out(if_block2, 1, 1, () => {
            if_block2 = null;
          });

          check_outros();
        }

        if (/*question*/ ctx[3].type === "opentext") {
          if (if_block3) {
            if_block3.p(ctx, dirty);

            if (dirty & /*question*/ 8) {
              transition_in(if_block3, 1);
            }
          } else {
            if_block3 = create_if_block_1(ctx);
            if_block3.c();
            transition_in(if_block3, 1);
            if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
          }
        } else if (if_block3) {
          group_outros();

          transition_out(if_block3, 1, 1, () => {
            if_block3 = null;
          });

          check_outros();
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block0);
        transition_in(if_block1);
        transition_in(if_block2);
        transition_in(if_block3);
        current = true;
      },
      o(local) {
        transition_out(if_block0);
        transition_out(if_block1);
        transition_out(if_block2);
        transition_out(if_block3);
        current = false;
      },
      d(detaching) {
        if (if_block0) if_block0.d(detaching);
        if (detaching) detach(t0);
        if (if_block1) if_block1.d(detaching);
        if (detaching) detach(t1);
        if (if_block2) if_block2.d(detaching);
        if (detaching) detach(t2);
        if (if_block3) if_block3.d(detaching);
        if (detaching) detach(if_block3_anchor);
      },
    };
  }

  // (25:6)
  function create_header_slot(ctx) {
    let h2;
    let t0;
    let t1;
    let t2;

    return {
      c() {
        h2 = element("h2");
        t0 = text(/*step*/ ctx[4]);
        t1 = text("/");
        t2 = text(/*totalSteps*/ ctx[5]);
        attr(h2, "slot", "header");
        attr(h2, "class", "ml-6 font-thin text-gray-400");
      },
      m(target, anchor) {
        insert(target, h2, anchor);
        append(h2, t0);
        append(h2, t1);
        append(h2, t2);
      },
      p(ctx, dirty) {
        if (dirty & /*step*/ 16) set_data(t0, /*step*/ ctx[4]);
        if (dirty & /*totalSteps*/ 32) set_data(t2, /*totalSteps*/ ctx[5]);
      },
      d(detaching) {
        if (detaching) detach(h2);
      },
    };
  }

  function create_fragment$2(ctx) {
    let div;
    let current;
    let if_block = /*question*/ ctx[3] && create_if_block$1(ctx);

    return {
      c() {
        div = element("div");
        if (if_block) if_block.c();
        attr(div, "class", "absolute");
        set_style(div, "width", "384px");
        toggle_class(div, "bottom-6", /*surveyDesign*/ ctx[2].bottom);
        toggle_class(div, "top-6", /*surveyDesign*/ ctx[2].top);
        toggle_class(div, "left-6", /*surveyDesign*/ ctx[2].left);
        toggle_class(div, "right-6", /*surveyDesign*/ ctx[2].right);
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block) if_block.m(div, null);
        current = true;
      },
      p(ctx, [dirty]) {
        if (/*question*/ ctx[3]) {
          if (if_block) {
            if_block.p(ctx, dirty);

            if (dirty & /*question*/ 8) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$1(ctx);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(div, null);
          }
        } else if (if_block) {
          group_outros();

          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });

          check_outros();
        }

        if (!current || dirty & /*surveyDesign*/ 4) {
          toggle_class(div, "bottom-6", /*surveyDesign*/ ctx[2].bottom);
        }

        if (!current || dirty & /*surveyDesign*/ 4) {
          toggle_class(div, "top-6", /*surveyDesign*/ ctx[2].top);
        }

        if (!current || dirty & /*surveyDesign*/ 4) {
          toggle_class(div, "left-6", /*surveyDesign*/ ctx[2].left);
        }

        if (!current || dirty & /*surveyDesign*/ 4) {
          toggle_class(div, "right-6", /*surveyDesign*/ ctx[2].right);
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) detach(div);
        if (if_block) if_block.d();
      },
    };
  }

  function instance$2($$self, $$props, $$invalidate) {
    let {
      closeSurvey,
      saveResponse,
      surveyDesign,
      question,
      step,
      totalSteps,
    } = $$props;

    $$self.$$set = ($$props) => {
      if ("closeSurvey" in $$props)
        $$invalidate(0, (closeSurvey = $$props.closeSurvey));
      if ("saveResponse" in $$props)
        $$invalidate(1, (saveResponse = $$props.saveResponse));
      if ("surveyDesign" in $$props)
        $$invalidate(2, (surveyDesign = $$props.surveyDesign));
      if ("question" in $$props) $$invalidate(3, (question = $$props.question));
      if ("step" in $$props) $$invalidate(4, (step = $$props.step));
      if ("totalSteps" in $$props)
        $$invalidate(5, (totalSteps = $$props.totalSteps));
    };

    return [
      closeSurvey,
      saveResponse,
      surveyDesign,
      question,
      step,
      totalSteps,
    ];
  }

  class Question extends SvelteComponent {
    constructor(options) {
      super();

      init(this, options, instance$2, create_fragment$2, safe_not_equal, {
        closeSurvey: 0,
        saveResponse: 1,
        surveyDesign: 2,
        question: 3,
        step: 4,
        totalSteps: 5,
      });
    }
  }

  function hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function isDarkColor(hexColor) {
    const { r, g, b } = hexToRGB(hexColor);

    let colorArray = [r / 255, g / 255, b / 255].map((v) => {
      if (v <= 0.03928) {
        return v / 12.92;
      }

      return Math.pow((v + 0.055) / 1.055, 2.4);
    });

    const luminance =
      0.2126 * colorArray[0] + 0.7152 * colorArray[1] + 0.0722 * colorArray[2];

    return luminance <= 0.179;
  }

  function parseTheme(survey) {
    const surveyDesign = survey.design;
    if (!surveyDesign) return {};
    const theme = {
      primaryColor:
        surveyDesign.colorTheme && surveyDesign.colorTheme.length
          ? surveyDesign.colorTheme[0]
          : "",
      backgroundColor:
        surveyDesign.colorTheme && surveyDesign.colorTheme.length > 1
          ? surveyDesign.colorTheme[1]
          : "",
      roundedCorner: surveyDesign.cornerStyle === "rounded",
      corner: surveyDesign.cornerStyle,
      position: surveyDesign.widgetPosition,
      left: surveyDesign.widgetPosition.includes("left"),
      bottom: surveyDesign.widgetPosition.includes("bottom"),
      top: surveyDesign.widgetPosition.includes("top"),
      right: surveyDesign.widgetPosition.includes("right"),
    };

    theme.isPrimaryColorDark = isDarkColor(theme.primaryColor);
    theme.isBackgroundDark = isDarkColor(theme.backgroundColor);

    return theme;
  }

  const backendURL$1 = "http://localhost:3001";
  const baseURL$1 = `${backendURL$1}/responses`;

  async function saveResponseData(responseId, userResponse, credentials) {
    return await fetch(`${baseURL$1}/${responseId}`, {
      method: "POST",
      body: JSON.stringify(userResponse),
      headers: {
        "Content-Type": "application/json",
        account_id: credentials.accountId,
        api_key: credentials.apiKey,
      },
    });
  }

  /* library/components/Survey.svelte generated by Svelte v3.57.0 */

  function create_fragment$1(ctx) {
    let question_1;
    let current;

    question_1 = new Question({
      props: {
        closeSurvey: /*closeSurvey*/ ctx[3],
        saveResponse: /*saveResponse*/ ctx[5],
        surveyDesign: /*surveyDesign*/ ctx[4],
        question: /*question*/ ctx[0],
        step: /*step*/ ctx[1],
        totalSteps: /*totalSteps*/ ctx[2],
      },
    });

    return {
      c() {
        create_component(question_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(question_1, target, anchor);
        current = true;
      },
      p(ctx, [dirty]) {
        const question_1_changes = {};
        if (dirty & /*question*/ 1)
          question_1_changes.question = /*question*/ ctx[0];
        if (dirty & /*step*/ 2) question_1_changes.step = /*step*/ ctx[1];
        if (dirty & /*totalSteps*/ 4)
          question_1_changes.totalSteps = /*totalSteps*/ ctx[2];
        question_1.$set(question_1_changes);
      },
      i(local) {
        if (current) return;
        transition_in(question_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(question_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(question_1, detaching);
      },
    };
  }

  function instance$1($$self, $$props, $$invalidate) {
    const SurveyStates = {
      InProgress: "in_progress",
      Completed: "completed",
    };

    // TODO: Split this component into two, one to control the survey flow and other to render the questions
    const userData = getContext("userData");

    let { survey } = $$props;
    let surveyState = SurveyStates.InProgress;

    function completeSurvey(value) {
      surveyState = SurveyStates.Completed;

      events.dispatchSurveyCompleted({
        ...userData,
        value,
        completedSurvey: surveyState === SurveyStates.Completed,
      });

      closeSurvey();
    }

    function closeSurvey() {
      // If survey is not completed, dispatch Survey Cancelled event
      if (surveyState !== SurveyStates.Completed)
        events.dispatchSurveyCancelled({
          ...userData,
          completeSurvey: surveyState === SurveyStates.Completed,
        });

      events.dispatchSurveyClosed({
        ...userData,
        completedSurvey: surveyState === SurveyStates.Completed,
      });
    }

    const surveyDesign = parseTheme(survey);
    setContext("surveyDesign", surveyDesign);
    setContext("completeSurvey", completeSurvey);
    setContext("closeSurvey", closeSurvey);
    const credentials = getContext("credentials");
    let question;
    let step;
    let totalSteps;
    let answers = [];

    onMount(() => {
      $$invalidate(0, (question = survey.questions[0]));
      $$invalidate(1, (step = 1));
      $$invalidate(2, (totalSteps = survey.questions.length));
    });

    function saveResponse(data) {
      answers.push({ question, answer: data });
      events.dispatchAnswerSubmitted({ question, answer: data });
      saveResponseData(survey.response, data, credentials).then(() =>
        nextStep(),
      );
    }

    function nextStep() {
      if (step < totalSteps) {
        $$invalidate(1, (step += 1));
        $$invalidate(0, (question = survey.questions[step - 1]));
      } else {
        completeSurvey(answers);
      }
    }

    $$self.$$set = ($$props) => {
      if ("survey" in $$props) $$invalidate(6, (survey = $$props.survey));
    };

    return [
      question,
      step,
      totalSteps,
      closeSurvey,
      surveyDesign,
      saveResponse,
      survey,
    ];
  }

  class Survey extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$1, safe_not_equal, {
        survey: 6,
      });
    }
  }

  /* library/App.svelte generated by Svelte v3.57.0 */

  function create_if_block(ctx) {
    let survey_1;
    let current;
    survey_1 = new Survey({ props: { survey: /*survey*/ ctx[0] } });

    return {
      c() {
        create_component(survey_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(survey_1, target, anchor);
        current = true;
      },
      p(ctx, dirty) {
        const survey_1_changes = {};
        if (dirty & /*survey*/ 1) survey_1_changes.survey = /*survey*/ ctx[0];
        survey_1.$set(survey_1_changes);
      },
      i(local) {
        if (current) return;
        transition_in(survey_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(survey_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(survey_1, detaching);
      },
    };
  }

  function create_fragment(ctx) {
    let div;
    let current;
    let if_block = /*show*/ ctx[1] && create_if_block(ctx);

    return {
      c() {
        div = element("div");
        if (if_block) if_block.c();
      },
      m(target, anchor) {
        insert(target, div, anchor);
        if (if_block) if_block.m(div, null);
        current = true;
      },
      p(ctx, [dirty]) {
        if (/*show*/ ctx[1]) {
          if (if_block) {
            if_block.p(ctx, dirty);

            if (dirty & /*show*/ 2) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block(ctx);
            if_block.c();
            transition_in(if_block, 1);
            if_block.m(div, null);
          }
        } else if (if_block) {
          group_outros();

          transition_out(if_block, 1, 1, () => {
            if_block = null;
          });

          check_outros();
        }
      },
      i(local) {
        if (current) return;
        transition_in(if_block);
        current = true;
      },
      o(local) {
        transition_out(if_block);
        current = false;
      },
      d(detaching) {
        if (detaching) detach(div);
        if (if_block) if_block.d();
      },
    };
  }

  function instance($$self, $$props, $$invalidate) {
    let { survey } = $$props;
    let { userData } = $$props;
    let { credentials } = $$props;
    setContext("userData", userData);
    setContext("survey", survey);
    setContext("credentials", credentials);
    let show = true;
    events.onSurveyClosed(() => $$invalidate(1, (show = false)));

    $$self.$$set = ($$props) => {
      if ("survey" in $$props) $$invalidate(0, (survey = $$props.survey));
      if ("userData" in $$props) $$invalidate(2, (userData = $$props.userData));
      if ("credentials" in $$props)
        $$invalidate(3, (credentials = $$props.credentials));
    };

    return [survey, show, userData, credentials];
  }

  class App extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {
        survey: 0,
        userData: 2,
        credentials: 3,
      });
    }
  }

  function getDeviceType() {
    const ua = window.navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua,
      )
    ) {
      return "mobile";
    }
    return "desktop";
  }

  function getDeviceOS() {
    let userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
      windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
      iosPlatforms = ["iPhone", "iPad", "iPod"],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = "Mac OS";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = "iOS";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = "Windows";
    } else if (/Android/.test(userAgent)) {
      os = "Android";
    } else if (!os && /Linux/.test(platform)) {
      os = "Linux";
    }

    return os;
  }

  function getBrowser() {
    // TODO: Look for better methods

    let userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "edge";
    } else {
      browserName = "No browser detection";
    }
    return browserName;
  }

  function getUserLanguage() {
    return window.navigator.language;
  }

  function getCurrentURL() {
    return window.location.href;
  }

  function getUserCountry() {
    // Sending timezone instead as it would be parsed in backend
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  const backendURL = "http://localhost:3001";
  const baseURL = `${backendURL}`;
  async function identifyUserAPI(userData, credentials) {
    return await fetch(`${baseURL}/responses?whole`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
        account_id: credentials.accountId,
        api_key: credentials.apiKey,
      },
    });
  }

  // eslint-disable-next-line no-unused-vars
  let app;

  const sdk = {
    setAPIKey(key) {
      this.apiKey = key;
    },

    setAccountId(id) {
      this.accountId = id;
    },

    setSurvey(response) {
      this.survey = response;
    },

    getResponseId() {
      return this.survey.responseId;
    },

    getSurvey() {
      return this.survey;
    },

    getAPIKey() {
      return this.apiKey;
    },

    getAccountId() {
      return this.accountId;
    },

    getCredentials() {
      return {
        apiKey: sdk.getAPIKey(),
        accountId: sdk.getAccountId(),
      };
    },

    init(apiKey, accountId) {
      if (!apiKey) throw new Error("Please enter api key");
      if (!accountId) throw new Error("Please enter account id");

      this.setAPIKey(apiKey);
      this.setAccountId(accountId);
      events.init("clickout_library");
    },

    startFlow(survey, userData) {
      if (app) return;
      app = new App({
        target: document.getElementById("clickout_library"),
        props: {
          survey: survey,
          userData: userData,
          credentials: this.getCredentials(),
        },
      });
      events.dispatchSurveyShown(userData);
    },

    onShow(callback) {
      events.onSurveyShown(callback);
    },
    onClose(callback) {
      events.onSurveyClosed(callback);
    },
    onAnswer(callback) {
      events.onAnswerSubmitted(callback);
    },
    onComplete(callback) {
      events.onSurveyCompleted(callback);
    },
    onCancel(callback) {
      events.onSurveyCancelled(callback);
    },
    identifyUser(userData, userMetaData) {
      if (app) return;
      if (!userData)
        throw new Error("Please provide the user data for identification");
      if (!(userData.id || userData.email)) {
        throw new Error("Either id or email is required");
      }

      const userDataPayload = {
        ...userData,
      };

      userDataPayload.device = userMetaData?.device || getDeviceType();
      userDataPayload.device_os = userMetaData?.device_os || getDeviceOS();
      userDataPayload.locale = userMetaData?.locale || getUserLanguage();
      userDataPayload.browser = userMetaData?.browser || getBrowser();
      userDataPayload.current_url =
        userMetaData?.current_url || getCurrentURL();
      userDataPayload.country = userMetaData?.country || getUserCountry();
      identifyUserAPI(userDataPayload, this.getCredentials())
        .then((res) => {
          res.json().then((data) => {
            sdk.startFlow(data, userDataPayload);
          });
        })
        .catch((err) => {
          // TODO: Clarify error handling
          console.log(err);
        });
    },
  };

  return sdk;
})();
