####  uniapp-to-group

`uniapp-to-group` 是 `uni-app` 开发字节小程序的时候，使用抖音团购模板的 `webpack` 转换插件

`HBuilder X` 同样适用，编辑器需要在 *3.2.3.20210825* 及以上

##### 示例

`HBuilder X` 在项目跟目录添加一个 `vue.config.js` 文件


```javascript
  npm i uniapp-to-group -D
  or
  yarn add uniapp-to-group -D
```

```javascript
  // vue.config.js
  const UniappToGroup = require('uniapp-to-group')

  module.exports = {
  configureWebpack: {
    plugins: [
      new UniappToGroup({
        // 对应 package.json 中引入插件步骤
        package: {
          'ttPlugins': {
            'dependencies': {
              'poi-group-buy-plugin': {
                'version': '1.0.0',
                'isDynamic': true
              }
            }
          }
        },
        app: {
          'pages': [
            // 手动配置商品插件中的商品详情页面
            'ext://poi-group-buy-plugin/detail'
          ],
          'fallbackPluginPages': {
            // 这里的 key 是小程序原来的商品详情页（下面只是示意），value 可以就用这个值
            'product/detail/index': 'ext://poi-group-buy-plugin/detail'
          }
        }
      })
    ]
  }
}
```
