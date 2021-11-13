// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last'); // 找最后一个li
var x = localStorage.getItem('x');
var xObject = JSON.parse(x); // 不能解析空字符串，会直接返回一个null
var hashMap = xObject || [{ logo: 'A', url: 'https://www.acfun.cn' }, { logo: 'B', url: 'https://www.bilibili.com' }];

var simplifyUrl = function simplifyUrl(url) {
    return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); //删除/开头的内容
};

var render = function render() {
    $siteList.find('li:not(.last)').remove(); // 每次增加新的之前，把原有的那两个li清空，就是没有这句的话，每次新增会同时把数组里原有的那两个再增加一遍
    // 点击的时候不在创建新site了
    hashMap.forEach(function (node, index) {
        // const $li = $(`<li>
        //         <div class="site">
        //             <div class="logo">${node.logo}</div>
        //             <div class="link">${simplifyUrl(node.url)}</div>
        //             <div class="close">
        //                 <svg class="icon">
        //                     <use xlink:href="#icon-close"></use>
        //                 </svg>
        //             </div>
        //         </div>
        // </li>`).insertBefore($lastLi)
        var $li = $('<li>\n        <div class="site">\n          <div class="logo">' + node.logo + '</div>\n          <div class="link">' + simplifyUrl(node.url) + '</div>\n          <div class="close">...\n          </div>\n        </div>\n      </li>').insertBefore($lastLi);
        $li.on('click', function () {
            window.open(node.url);
        });
        $li.on('click', '.close', function (e) {
            e.stopPropagation();
            hashMap.splice(index, 1);
            render();
        });
    });
};

// <svg class="icon">
//   <use xlink:href="#icon-close"></use>
// </svg>


render(); // 首先render，点击之后就push，push之后再render

// foeEach 会遍历数组hashMap，把每个元素作为参数传给后面的函数
// console.log($) // 用jQuery库 里的$函数来监听用户输入的网址
$('.addButton').on('click', function () {
    var url = window.prompt('请问你要添加的网址是啥？');
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    console.log(url);
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    });
    //     const $site = $(`<li>
    //     <a href="${url}"> 
    //     <div class="site">
    //         <div class="logo">${url1[0]}</div>
    //         <div class="link">${url}</div>
    //     </div>
    // </a>
    //     </li>`).insertBefore($lastLi) // ${}表示插值法；li还能这样插入?没看懂
    render();
});

// 接下来就是用户退出网站之后，之前添加的网站标签都没了的情况了；想个办法把之前的标签保存下来；用户添加或离开页面的时候存下来
window.onbeforeunload = function () {
    console.log('页面要关闭了');
    var string = JSON.stringify(hashMap);
    window.localStorage.setItem('x', string); // 在本地内存设置一个'x'属性，这个属性的值就是string
};

$(document).on('keypress', function (e) {
    var key = e.key.toUpperCase(); // 变量名和获取的属性名相同，可以简写成这样{key} = e
    for (var i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo === key) {
            window.open(hashMap[i].url);
        }
    }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.9e9c566e.map