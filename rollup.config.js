
import cleaner from 'rollup-plugin-cleaner'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import path from 'path';
import pkg from './package.json'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// 使用 lodash 实现友好的动态功能
import { cloneDeep, upperFirst } from 'lodash'
import alias from '@rollup/plugin-alias'

// umd 情况下，动态获取最终打包的文件名
// example: 打包 umd 文件名设为 dist/vue.js 时，我们动态获取到 "vue"
const filename = pkg.browser.slice(pkg.browser.indexOf('/') + 1, pkg.browser.indexOf('.'))
console.log(filename,'filename');
// 引入代码转换库
const buble = require('@rollup/plugin-buble');

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

const out = [
  {
    file: pkg.module,
    format: 'esm'
  }, {
    file: pkg.main,
    format: 'cjs'
  }, {
    file: pkg.browser,
    format: 'umd',
    // 对外导出名首字母友好的大写
    // example: 当 filename 为 vue 时，模块名即为 Vue
    name: upperFirst(filename)
  }
]

// 最小化版本文件头注释信息
const banner =
  `/*!
 * ${pkg.name} v${pkg.version}
 * (c) 2020-2021 ${pkg.author}
 * Released under the ${pkg.license} License.
 */
`;

// 最小化版本处理函数
const minimize = (obj) => {
  // 深拷贝
  const minObj = cloneDeep(obj)
  // 文件名添加 .min
  minObj.file = minObj.file.slice(0, minObj.file.lastIndexOf('.js')) + '.min.js'
  // 只对最小化版本去除 console，并压缩 js
  minObj.plugins = [terser({ compress: { drop_console: true } })]
  // 只对最小化版本添加文件头注释信息
  minObj.banner = banner
  return minObj
}

const config = {
  input: resolve('src/index.js'),
  plugins: [
    cleaner({
      targets: ['./dist']
    }),
    buble(),
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      babelHelpers: 'runtime',  // 当启用沙箱 polyfill 时，需要设定为 runtime
      // 使用预设
    //   presets: [['@babel/preset-env', {
    //     "modules": false,
    //     "useBuiltIns": "usage",
    //     // 目标浏览器
    //     "targets": {
    //       "edge": '17',
    //       "firefox": '60',
    //       "chrome": '67',
    //       "safari": '11.1',
    //       'ie': '10',
    //     },
    //   }]],
    //   plugins: [
    //     //  多次导入的文件，只导入一次
    //     ['@babel/plugin-transform-runtime']],
    }),
    alias({
      entries: [
        { find: '@', replacement: resolve('src') },
      ]
    })
  ],
  output: [
    ...out, ...out.map(type => {
      type.file = resolve(type.file)
      return minimize(type)
    })
  ]
};
export default config
