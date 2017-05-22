LeanCloud Installation
====
Installation manage plugin for LeanCloud JavaScript SDK.

### 安装与使用
`leancloud-installation` 依赖 LeanCloud JavaScript SDK v3.0.0。

```
npm install leancloud-installation --save
```

然后在 js 入口进行初始化：

```javascript
var AV = require('leancloud-storage');
AV.initialize('appId', 'appKey');
var LeancloudInstallation = require('leancloud-installation')(AV);
```

接下来我们来更新 installation：首先获取当前设备的 installation，设置对应的 deviceToken 等字段，然后保存。为了保证 installation 得到及时的更新，我们应该保证这段代码在每次 app 启动时都会执行。
```javascript
LeancloudInstallation.getCurrent()
  .then(installation => {
    installation.set('deviceType', 'ios');
    installation.set('deviceToken', 'xxxxxxxx');
    return installation.save();
  });
```

### Demo
[LeanCloud Installation Demo](https://github.com/leancloud/react-native-installation-demo) 演示了如何在 React Native 中使用 installation plugin 来更新维护设备的 installation。

### API
#### Class LeancloudInstallation
##### &lt;static&gt; {AV.Promise} getCurrent()
获取当前设备对应的 installation 对象，installation 是 Installation 类的实例。如果是第一次调用，会生成一个新的 installation，否则会从本地缓存中获取。

#### &lt;private&gt; Class Installation
`Installation` 继承自 `AV.Object`，其实例方法参见 [`AV.Object` 文档](https://leancloud.github.io/javascript-sdk/docs/AV.Object.html)。每一个 installation 实例对应控制台 _Installation 表中的一条数据。Installation 类的主要属性参见 [消息推送开发指南](https://leancloud.cn/docs/push_guide.html#Installation)。
