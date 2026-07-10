module.exports = {
    plugins: {
      'postcss-px-to-viewport': {
        unitToConvert: 'px',     // 需要转换的单位
        viewportWidth: 750,      // 设计稿宽度（与你的设计稿一致）
        unitPrecision: 5,        // 转换后的精度（小数位数）
        propList: ['*'],         // 需要转换的属性列表（*表示全部）
        viewportUnit: 'vw',      // 转换后的单位
        fontViewportUnit: 'vw',  // 字体转换后的单位
        selectorBlackList: [],   // 不转换的选择器（如 .ignore-*）
        minPixelValue: 2,        // 最小转换像素值（小于此值不转换）
        mediaQuery: false,       // 是否转换媒体查询中的 px
        replace: true,           // 是否直接替换原始值
        exclude: [/node_modules/], // 排除 node_modules 中的文件
        landscape: false,        // 是否处理横屏模式
      },
    },
  };