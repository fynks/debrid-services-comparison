/**
 * Tiny reactive store. No Proxy, no signals — just a setter that
 * notifies subscribers. Components subscribe in `mount()` and call
 * `update()` to re-render.
 *
 *   const store = createStore({ count: 0 });
 *   const off = store.subscribe((s) => console.log(s.count));
 *   store.set({ count: 1 }); // → logs 1
 *   store.set((s) => ({ ...s, count: s.count + 1 })); // updater form
 *   off();
 */
export function createStore(initial) {
  let state = initial;
  const subs = new Set();
  let scheduled = false;

  function flush() {
    scheduled = false;
    for (const fn of subs) fn(state);
  }

  return {
    get() {
      return state;
    },
    /**
     * Set the next state. Accepts a value or an updater function.
     * No-op if the next state is shallowly equal to the current state
     * (same reference or same JSON).
     */
    set(updater) {
      const next =
        typeof updater === 'function' ? updater(state) : updater;
      if (Object.is(next, state)) return;
      state = next;
      if (!scheduled) {
        scheduled = true;
        queueMicrotask(flush);
      }
    },
    subscribe(fn) {
      subs.add(fn);
      // Fire once with the current state so subscribers can sync.
      queueMicrotask(() => fn(state));
      return () => subs.delete(fn);
    },
    /**
     * Read current state inside an updater without subscribing.
     * Useful inside `set(updater)` for derived state.
     */
    read() {
      return state;
    },
  };
}

/**
 * Convenience: bind a render function to a store. Re-renders are
 * debounced via microtask so multiple `set()` calls in the same tick
 * produce a single render.
 */
export function bind(store, render) {
  return store.subscribe(render);
}