# al-request

Network request library for labrador and alaska.

Labrador 网络库，适用于 [Alaska](https://github.com/maichong/alaska) Restful 格式的服务器接口。

如果服务器发生错误，返回的对象中 `error` 属性应当为字符串类型的错误信息，如果没有发生错误，`error` 属性留空。

本库对微信小程序 `wx.request` 进行了二次封装，尤其是内置了对自定义Session的支持。

## 简单应用

```js

import request from 'al-request';

async function test(){
  let res=request('my/api');
  console.log('res',res);
}

```

> 要让上述代码正确运行，我们需要在Labrador配置文件`.labrador`中增加常量 `API_ROOT` 定义所有请求默认的API根路径，否则调用 `request` 方法时必须提供完整URL地址。

```json
{
  "define":{
    "API_ROOT": "https://maichong.it/"
  }
}
```

在上边的代码中，我们使用了 `al-request` 导出的默认网络客户端，有些时候我们可能需要自定义网络客户端，例如我们需要调用多个域名下的接口。使用 `create` 函数创建一个自定义客户端：

```js
import { create } from 'al-request';

const request = create({ apiRoot:'https://your.domain/' });

request.post('user/login',{ username:'liang' });
```

如果我们需要更新默认客户端的配置，只需要调用其 `setOptions` 方法：

```js
import request from 'al-request';
request.setOptions({ apiRoot:'https://your.domain/' });
```

> `setOptions` 方法的参数和 `create` 方法的参数一致。
> 通过 `create` 方法创建的自定义网络客户端也有 `setOptions` 方法。


## API

### Options

属性 | 类型 | 默认 | 说明
--------- | -------- | -------- | ---------
apiRoot   | string   | ''       | 服务器API根路径，如果不设置，调用API必须提供完整URL
session   | boolean  | true     | 是否打开自定义Session支持
updateKey | string   | '_session'| 当服务器返回的JSON对象有此属性时，更新当前SessionID
headerKey | string   | 'Session' | HTTP请求Session header名称
getSession| Function |          | 获取当前的SessionID，默认获取 `wx.app.sessionId`
setSession| Function |          | 设置新的SessionID，默认保存到 `wx.app.sessionId`
defaultHeader| Object |         | 默认Header

### 方法

##### create(options): request

##### request([method], apiName, [data], [header]): Promise

##### request.get(apiName, [data], [header]): Promise

##### request.post(apiName, [data], [header]): Promise

##### request.put(apiName, [data], [header]): Promise

##### request.delete(apiName, [data], [header]): Promise

##### request.head(apiName, [data], [header]): Promise

##### request.options(apiName, [data], [header]): Promise

##### request.trace(apiName, [data], [header]): Promise

##### request.connect(apiName, [data], [header]): Promise

##### request.setOptions(options)

request 的第一个参数指定请求的方法，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT，可以省略，默认为 GET

`request('my/api')` 等价于 `request('GET', 'my/api')` 等价于 `request.get('my/api')`

`request.post('my/api')` 等价于 `request('POST', 'my/api')`

`data` 参数为提交的KV数据对象，可以省略，如果请求方法为 `POST` 或 `PUT` 时，数据作为HTTP请求BODY，否则将转换为URL Query。

例如 `request('my/api',{foo:'bar'})` 将请求 GET http://your.domain/my/api?foo=bar


