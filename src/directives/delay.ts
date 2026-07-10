// v-delay:1000="{fun:submit,data:{id:1}}"

interface RippleHTMLElement extends HTMLElement {
  _debounceClickHandler: any;
}

export default {
  beforeMount(el: RippleHTMLElement, binding: any) {
    const delay = binding.arg || 300; // 默认延迟300毫秒
    let timeout: any;

    const debounceHandler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        binding.value.fun(binding.value?.data ?? "");
      }, delay);
    };

    el.addEventListener("click", () => {
      debounceHandler();
    });
    el._debounceClickHandler = debounceHandler;
  },
  unmounted(el: RippleHTMLElement) {
    el.removeEventListener("click", el._debounceClickHandler);
    el._debounceClickHandler = null;
  },
};
