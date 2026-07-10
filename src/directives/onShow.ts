export default {
    mounted(el: HTMLElement, binding: any) {
        const animationClass = binding.value || 'animate__fadeInUp';
        const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            el.classList.add('animate__animated', animationClass);
                observer.unobserve(el); // 只触发一次
            }
        });
        }, { threshold: 0.1 });

        observer.observe(el);
    }
};