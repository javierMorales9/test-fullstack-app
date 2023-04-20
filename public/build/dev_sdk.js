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
    ShowSurvey: "show_survey",
    HideSurvey: "hide_survey",

    SetQuestion: "set_question",

    SetSteps: "set_steps",

    SetTotalSteps: "set_total_steps",

    SetSurveyDesign: "set_survey_design",
  };

  function eventBuilder(event, options) {
    return new CustomEvent(event, options);
  }

  const events = {
    init(targetId) {
      this.target = document.getElementById(targetId);
    },
    dispatchEvent(event) {
      this.target.dispatchEvent(event);
    },
    dispatchShowSurvey() {
      this.dispatchEvent(
        eventBuilder(Events.ShowSurvey, {
          bubbles: true,
          detail: {
            show: true,
          },
        }),
      );
    },
    dispatchHideSurvey() {
      this.dispatchEvent(
        eventBuilder(Events.HideSurvey, {
          bubbles: true,
          detail: {
            show: false,
          },
        }),
      );
    },
    dispatchSetQuestion(question) {
      this.dispatchEvent(
        eventBuilder(Events.SetQuestion, {
          bubbles: true,
          detail: {
            question: question,
          },
        }),
      );
    },
    dispatchSetSurveyDesign(surveyDesign) {
      this.dispatchEvent(
        eventBuilder(Events.SetSurveyDesign, {
          bubbles: true,
          detail: {
            surveyDesign: surveyDesign,
          },
        }),
      );
    },
    dispatchSetSteps(steps) {
      this.dispatchEvent(
        eventBuilder(Events.SetSteps, {
          bubbles: true,
          detail: {
            steps: steps,
          },
        }),
      );
    },
    dispatchSetTotalSteps(steps) {
      this.dispatchEvent(
        eventBuilder(Events.SetTotalSteps, {
          bubbles: true,
          detail: { steps: steps },
        }),
      );
    },
    onShowSurvey(callback) {
      this.target.addEventListener(Events.ShowSurvey, (e) => {
        callback(e.detail);
      });
    },
    onHideSurvey(callback) {
      this.target.addEventListener(Events.HideSurvey, (e) => {
        callback(e.detail);
      });
    },
    onSetQuestion(callback) {
      this.target.addEventListener(Events.SetQuestion, (e) => {
        callback(e.detail);
      });
    },
    onSetSteps(callback) {
      this.target.addEventListener(Events.SetSteps, (e) => {
        callback(e.detail);
      });
    },
    onSetTotalSteps(callback) {
      this.target.addEventListener(Events.SetTotalSteps, (e) => {
        callback(e.detail);
      });
    },
    onSetSurveyDesign(callback) {
      this.target.addEventListener(Events.SetSurveyDesign, (e) => {
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

  function create_fragment$6(ctx) {
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

  function instance$6($$self, $$props, $$invalidate) {
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
      init(this, options, instance$6, create_fragment$6, safe_not_equal, {
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

  function create_fragment$5(ctx) {
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

  function instance$5($$self, $$props, $$invalidate) {
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
      init(this, options, instance$5, create_fragment$5, safe_not_equal, {
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

  function create_fragment$4(ctx) {
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

  function instance$4($$self, $$props, $$invalidate) {
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
      init(this, options, instance$4, create_fragment$4, safe_not_equal, {
        survey: 0,
        save: 1,
        surveyDesign: 2,
      });
    }
  }

  /* library/components/Card.svelte generated by Svelte v3.57.0 */

  const get_header_slot_changes = (dirty) => ({});
  const get_header_slot_context = (ctx) => ({});

  function create_fragment$3(ctx) {
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

  function instance$3($$self, $$props, $$invalidate) {
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
      init(this, options, instance$3, create_fragment$3, safe_not_equal, {
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

  function create_fragment$2(ctx) {
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

  function instance$2($$self, $$props, $$invalidate) {
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
      init(this, options, instance$2, create_fragment$2, safe_not_equal, {
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

  function create_fragment$1(ctx) {
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

  function instance$1($$self, $$props, $$invalidate) {
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

      init(this, options, instance$1, create_fragment$1, safe_not_equal, {
        closeSurvey: 0,
        saveResponse: 1,
        surveyDesign: 2,
        question: 3,
        step: 4,
        totalSteps: 5,
      });
    }
  }

  /* library/DevSDK.svelte generated by Svelte v3.57.0 */

  function create_if_block(ctx) {
    let question_1;
    let current;

    question_1 = new Question({
      props: {
        question: /*question*/ ctx[1],
        surveyDesign: /*surveyDesign*/ ctx[2],
        step: /*step*/ ctx[3],
        totalSteps: /*totalSteps*/ ctx[4],
        closeSurvey: func,
        saveResponse: func_1,
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
      p(ctx, dirty) {
        const question_1_changes = {};
        if (dirty & /*question*/ 2)
          question_1_changes.question = /*question*/ ctx[1];
        if (dirty & /*surveyDesign*/ 4)
          question_1_changes.surveyDesign = /*surveyDesign*/ ctx[2];
        if (dirty & /*step*/ 8) question_1_changes.step = /*step*/ ctx[3];
        if (dirty & /*totalSteps*/ 16)
          question_1_changes.totalSteps = /*totalSteps*/ ctx[4];
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

  function create_fragment(ctx) {
    let div;
    let current;
    let if_block = /*show*/ ctx[0] && create_if_block(ctx);

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
        if (/*show*/ ctx[0]) {
          if (if_block) {
            if_block.p(ctx, dirty);

            if (dirty & /*show*/ 1) {
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

  const func = () => {};

  const func_1 = () => {};

  function instance($$self, $$props, $$invalidate) {
    let show = false;
    let question, surveyDesign, step, totalSteps;

    function showSurvey() {
      $$invalidate(0, (show = true));
    }

    function hideSurvey() {
      $$invalidate(0, (show = false));
    }

    function setQuestion({ question: _question }) {
      $$invalidate(1, (question = _question));
    }

    function setSteps({ steps: _steps }) {
      $$invalidate(3, (step = _steps));
    }

    function setTotalSteps({ steps: _steps }) {
      $$invalidate(4, (totalSteps = _steps));
    }

    function setSurveyDesign({ surveyDesign: _surveyDesign }) {
      $$invalidate(2, (surveyDesign = _surveyDesign));
    }

    events.onShowSurvey(showSurvey);
    events.onHideSurvey(hideSurvey);
    events.onSetQuestion(setQuestion);
    events.onSetSteps(setSteps);
    events.onSetTotalSteps(setTotalSteps);
    events.onSetSurveyDesign(setSurveyDesign);
    return [show, question, surveyDesign, step, totalSteps];
  }

  class DevSDK extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  }

  const sdk = {
    init() {
      events.init("clickout_library");
      new DevSDK({
        target: document.getElementById("clickout_library"),
      });
    },
    setSurveyDesign(surveyDesign) {
      events.dispatchSetSurveyDesign(surveyDesign);
    },
    setQuestion(question) {
      events.dispatchSetQuestion(question);
    },
    setSteps(steps) {
      events.dispatchSetSteps(steps);
    },
    setTotalSteps(steps) {
      events.dispatchSetTotalSteps(steps);
    },
    hideSurvey() {
      events.dispatchHideSurvey();
    },
    showSurvey() {
      events.dispatchShowSurvey();
    },
  };

  window.sdk = sdk;

  return sdk;
})();
