---
layout:     post
title:      "Angular PhoneCat的实现3"
subtitle:   "更多模板"
date:       2015-08-10 12:00:00
author:     "wangxu"
header-img: "img/post-bg-2015.jpg"
tags:
    - Angular
---

#### 更多模板

修改controller.js。
* 路由`'/phones/:phoneId'`中的参数`phoneId`通过`$routeParams`获得。即`$routeParams.phoneId`
* 注入`$http`服务，从服务端get数据并赋值给数据模型`phone`

```javascript
// 定义控制器PhoneDetailCtrl，控制器的$scope为phone-detail.html
phoneModule.controller('PhoneDetailCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    // 根据参数phoneId的不同，从服务端获取对应的json文件取得数据。
    $http.get('phones/' + $routeParams.phoneId + '.json').success(function(data) {
        // 给$scope中的数据模型phone赋值
        $scope.phone = data;
    });
}]);
```
json文件格式：以`nexus-s.json`为例：

```json
{
    "additionalFeatures": "Contour Display, Near Field Communications (NFC), Three-axis gyroscope, Anti-fingerprint display coating, Internet Calling support (VoIP/SIP)",
    "android": {
        "os": "Android 2.3",
        "ui": "Android"
    },
    "availability": [
        "M1,",
        "O2,",
        "Orange,",
        "Singtel,",
        "StarHub,",
        "T-Mobile,",
        "Vodafone"
    ],
    "battery": {
        "standbyTime": "428 hours",
        "talkTime": "6 hours",
        "type": "Lithium Ion (Li-Ion) (1500 mAH)"
    },
    "camera": {
        "features": [
            "Flash",
            "Video"
        ],
        "primary": "5.0 megapixels"
    },
    "connectivity": {
        "bluetooth": "Bluetooth 2.1",
        "cell": "Quad-band GSM: 850, 900, 1800, 1900\r\nTri-band HSPA: 900, 2100, 1700\r\nHSPA type: HSDPA (7.2Mbps) HSUPA (5.76Mbps)",
        "gps": true,
        "infrared": false,
        "wifi": "802.11 b/g/n"
    },
    "description": "Nexus S is the next generation of Nexus devices, co-developed by Google and Samsung. The latest Android platform (Gingerbread), paired with a 1 GHz Hummingbird processor and 16GB of memory, makes Nexus S one of the fastest phones on the market. It comes pre-installed with the best of Google apps and enabled with new and popular features like true multi-tasking, Wi-Fi hotspot, Internet Calling, NFC support, and full web browsing. With this device, users will also be the first to receive software upgrades and new Google mobile apps as soon as they become available. For more details, visit http://www.google.com/nexus.",
    "display": {
        "screenResolution": "WVGA (800 x 480)",
        "screenSize": "4.0 inches",
        "touchScreen": true
    },
    "hardware": {
        "accelerometer": true,
        "audioJack": "3.5mm",
        "cpu": "1GHz Cortex A8 (Hummingbird) processor",
        "fmRadio": false,
        "physicalKeyboard": false,
        "usb": "USB 2.0"
    },
    "id": "nexus-s",
    "images": [
        "img/phones/nexus-s.0.jpg",
        "img/phones/nexus-s.1.jpg",
        "img/phones/nexus-s.2.jpg",
        "img/phones/nexus-s.3.jpg"
    ],
    "name": "Nexus S",
    "sizeAndWeight": {
        "dimensions": [
            "63.0 mm (w)",
            "123.9 mm (h)",
            "10.88 mm (d)"
        ],
        "weight": "129.0 grams"
    },
    "storage": {
        "flash": "16384MB",
        "ram": "512MB"
    }
}
```

修改phone-detail.html，通过`{% raw %}{{}}{% endraw %}`取得数据模型`phone`中的属性值

```html
{% raw %}
<img ng-src="{{phone.images[0]}}" class="phone">

<h1>{{phone.name}}</h1>

<p>{{phone.description}}</p>

<ul class="phone-thumbs">
    <li ng-repeat="img in phone.images">
        <img ng-src="{{img}}">
    </li>
</ul>

<ul class="specs">
    <li>
        <span>Availability and Networks</span>
        <dl>
            <dt>Availability</dt>
            <dd ng-repeat="availability in phone.availability">{{availability}}</dd>
        </dl>
    </li>
    <li>
        <span>Battery</span>
        <dl>
            <dt>Type</dt>
            <dd>{{phone.battery.type}}</dd>
            <dt>Talk Time</dt>
            <dd>{{phone.battery.talkTime}}</dd>
            <dt>Standby time (max)</dt>
            <dd>{{phone.battery.standbyTime}}</dd>
        </dl>
    </li>
    <li>
        <span>Storage and Memory</span>
        <dl>
            <dt>RAM</dt>
            <dd>{{phone.storage.ram}}</dd>
            <dt>Internal Storage</dt>
            <dd>{{phone.storage.flash}}</dd>
        </dl>
    </li>
    <li>
        <span>Connectivity</span>
        <dl>
            <dt>Network Support</dt>
            <dd>{{phone.connectivity.cell}}</dd>
            <dt>WiFi</dt>
            <dd>{{phone.connectivity.wifi}}</dd>
            <dt>Bluetooth</dt>
            <dd>{{phone.connectivity.bluetooth}}</dd>
            <dt>Infrared</dt>
            <dd>{{phone.connectivity.infrared}}</dd>
            <dt>GPS</dt>
            <dd>{{phone.connectivity.gps}}</dd>
        </dl>
    </li>
    <li>
        <span>Android</span>
        <dl>
            <dt>OS Version</dt>
            <dd>{{phone.android.os}}</dd>
            <dt>UI</dt>
            <dd>{{phone.android.ui}}</dd>
        </dl>
    </li>
    <li>
        <span>Size and Weight</span>
        <dl>
            <dt>Dimensions</dt>
            <dd ng-repeat="dim in phone.sizeAndWeight.dimensions">{{dim}}</dd>
            <dt>Weight</dt>
            <dd>{{phone.sizeAndWeight.weight}}</dd>
        </dl>
    </li>
    <li>
        <span>Display</span>
        <dl>
            <dt>Screen size</dt>
            <dd>{{phone.display.screenSize}}</dd>
            <dt>Screen resolution</dt>
            <dd>{{phone.display.screenResolution}}</dd>
            <dt>Touch screen</dt>
            <dd>{{phone.display.touchScreen}}</dd>
        </dl>
    </li>
    <li>
        <span>Hardware</span>
        <dl>
            <dt>CPU</dt>
            <dd>{{phone.hardware.cpu}}</dd>
            <dt>USB</dt>
            <dd>{{phone.hardware.usb}}</dd>
            <dt>Audio / headphone jack</dt>
            <dd>{{phone.hardware.audioJack}}</dd>
            <dt>FM Radio</dt>
            <dd>{{phone.hardware.fmRadio}}</dd>
            <dt>Accelerometer</dt>
            <dd>{{phone.hardware.accelerometer}}</dd>
        </dl>
    </li>
    <li>
        <span>Camera</span>
        <dl>
            <dt>Primary</dt>
            <dd>{{phone.camera.primary}}</dd>
            <dt>Features</dt>
            <dd>{{phone.camera.features.join(', ')}}</dd>
        </dl>
    </li>
    <li>
        <span>Additional Features</span>
        <dd>{{phone.additionalFeatures}}</dd>
    </li>
</ul>
{% endraw %}
```
