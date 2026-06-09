/**
 * Component lifecycle management with cleanup tracking
 */
export class ComponentLifecycle {
  #cleanupFns = [];
  #isDestroyed = false;

  /**
   * Register a cleanup function to be called when component is destroyed
   * @param {Function} fn - Cleanup function
   * @returns {Function} - Unregister function
   */
  onDestroy(fn) {
    if (this.#isDestroyed) {
      console.warn('Cannot register cleanup on destroyed component');
      return () => { };
    }

    this.#cleanupFns.push(fn);

    // Return unregister function
    return () => {
      const index = this.#cleanupFns.indexOf(fn);
      if (index > -1) {
        this.#cleanupFns.splice(index, 1);
      }
    };
  }

  /**
   * Destroy component and run all cleanup functions
   */
  destroy() {
    if (this.#isDestroyed) {
      return;
    }

    this.#isDestroyed = true;
    this.#cleanupFns.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Error in cleanup function:', error);
      }
    });
    this.#cleanupFns = [];
  }

  get isDestroyed() {
    return this.#isDestroyed;
  }
}
