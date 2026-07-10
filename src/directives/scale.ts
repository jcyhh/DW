interface RippleHTMLElement extends HTMLElement {
  _rippleHandlers?: {
    handleTouchStart: () => void
  }
}

export default {
    beforeMount(el:RippleHTMLElement) {
      el.style.transition = 'transform 0.2s ease-in-out';
  
      // 添加按下效果
      const handleTouchStart = () => {
        el.style.transform = 'scale(0.95)';
        el.style.filter = 'brightness(0.9)';
        setTimeout(() => {
          el.style.transform = 'scale(1)';
          el.style.filter = 'brightness(1)';
        }, 200);
      };
  
      // 监听 touchstart 事件
      el.addEventListener('touchstart', handleTouchStart);
  
      // 在元素上保存事件处理函数，以便在 unmounted 时移除
      el._rippleHandlers = {
        handleTouchStart
      };
    },
  
    unmounted(el:RippleHTMLElement) {
      // 移除事件监听
      const { handleTouchStart } = el._rippleHandlers || {};
      if (handleTouchStart) {
        el.removeEventListener('touchstart', handleTouchStart);
      }
    }
  }