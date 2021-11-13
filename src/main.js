const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last') // 找最后一个li
const x = localStorage.getItem('x')
const xObject = JSON.parse(x) // 不能解析空字符串，会直接返回一个null
const hashMap = xObject || [
    {logo: 'A', url: 'https://www.acfun.cn'},
    {logo: 'B', url: 'https://www.bilibili.com'}
]

const simplifyUrl=(url)=>{
    return url.replace('https://','')
    .replace('http://', '')
    .replace('www.','')
    .replace(/\/.*/, '') //删除/开头的内容
}

const render = ()=>{
    $siteList.find('li:not(.last)').remove() // 每次增加新的之前，把原有的那两个li清空，就是没有这句的话，每次新增会同时把数组里原有的那两个再增加一遍
    // 点击的时候不在创建新site了
    hashMap.forEach((node, index)=>{
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
        const $li = $(`<li>
        <div class="site">
          <div class="logo">${node.logo}</div>
          <div class="link">${simplifyUrl(node.url)}</div>
          <div class="close">...
          </div>
        </div>
      </li>`).insertBefore($lastLi)        
        $li.on('click', ()=>{
            window.open(node.url)
        })
        $li.on('click', '.close', (e)=>{
            e.stopPropagation()
            hashMap.splice(index,1)
            render()
        })
    })
}

            // <svg class="icon">
            //   <use xlink:href="#icon-close"></use>
            // </svg>


render(); // 首先render，点击之后就push，push之后再render

// foeEach 会遍历数组hashMap，把每个元素作为参数传给后面的函数
// console.log($) // 用jQuery库 里的$函数来监听用户输入的网址
$('.addButton').on('click',()=>{
    let url=window.prompt('请问你要添加的网址是啥？')
    if(url.indexOf('http')!==0){
        url = 'https://' +url
    }
    console.log(url)
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url:url
    })
//     const $site = $(`<li>
//     <a href="${url}"> 
//     <div class="site">
//         <div class="logo">${url1[0]}</div>
//         <div class="link">${url}</div>
//     </div>
// </a>
//     </li>`).insertBefore($lastLi) // ${}表示插值法；li还能这样插入?没看懂
render();
})

// 接下来就是用户退出网站之后，之前添加的网站标签都没了的情况了；想个办法把之前的标签保存下来；用户添加或离开页面的时候存下来
window.onbeforeunload = ()=>{
    console.log('页面要关闭了');
    const string = JSON.stringify(hashMap)
    window.localStorage.setItem('x', string) // 在本地内存设置一个'x'属性，这个属性的值就是string
}

$(document).on('keypress', (e)=>{
    const key = e.key.toUpperCase() // 变量名和获取的属性名相同，可以简写成这样{key} = e
    for(let i=0;i<hashMap.length;i++){
        if(hashMap[i].logo === key){
            window.open(hashMap[i].url);
        }
    }
})