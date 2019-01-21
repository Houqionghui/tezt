/**
 * Created by q977821807 on 2018/5/7.
 */
let utils = (function () {

    let getCss = function (ele, attr) {
        if ('getComputedStyle' in window) {
            let value = window.getComputedStyle(ele)[attr], // getComputedStyle(ele) 中ele 代表元素而不是字符串，之前写成了字符串
                reg = /-?(\d+)(\.\d+)?(px|em|rem)?/g;
            if (reg.test(value)) {
                value = parseFloat(value);
            }
            return value;
        }
    };

    let setCss = function (ele, attr, value) {
        let reg = /^(opacity|zIndex)$/g;
        if (!isNaN(value)) {
            if (!reg.test(attr)) {
                value += 'px';
            }
        }
        ele.style[attr] = value;
    };

    let setGroupCss = function (ele, options) {
        for (let attr in options) {
            if (options.hasOwnProperty(attr)) {
                setCss(ele, attr, options[attr]);
            }
        }
    };

    let css = function (...arg) {
        let len = arg.length,
            fn = getCss;
        len === 3 ? fn = setCss : null;
        len === 2 && arg[1] instanceof Object ? fn = setGroupCss : null;  // 第二个参数是arg[1]，之前写成了arg[2]
        return fn(...arg);  // css 执行相当于函数执行，所以返回的是函数执行，而不是一个函数，之前写成了函数名
    };

    let each = function (options, callback) {
        if ('length' in options) {
            for (let i = 0; i < options.length; i++) {
                let item = options[i];
                let isTrue = callback && callback.call(item, i, item);
                if (!isTrue) {
                    break;
                }
            }
            return; // 当后面还有代码要在此处结束代码的话，必须要返回
        }
        for (let key in options) {
            if(options.hasOwnProperty(key)){
                let isTrue = callback && callback.call(options[key],key, options[key]);
                // if (isTrue === false) {
                //     break;
                // }
                if (isTrue===false) { // 绝对等于false 时，才跳出循环，
                    // 不遍历（剩下的值，也不再执行回调函数），之前用的是！isTrue这样会先转化为布尔值
                    break;
                }
            }
        }
    };

    // let each = (obj, callback) => {
    //     if ('length' in obj) {
    //         for (let i = 0; i < obj.length; i++) {
    //             let item = obj[i],
    //                 res = callback && callback.call(item, i, item);
    //             if (res === false) {
    //                 break;
    //             }
    //         }
    //         return;
    //     }
    //     for (let attr in obj) {
    //         if (obj.hasOwnProperty(attr)) {
    //             let item = obj[attr],
    //                 res = callback && callback.call(item, attr, item);
    //             if (res === false) {
    //                 break;
    //             }
    //         }
    //     }
    // };

    return {
        css, each
    }
})();

// 动画思路：
/*
 * 0.概要： 定时器   left top 定位  规定时间匀速动画  计算当前时间所在位置的公式
 * 1.  设置好变量（begin change duration )一便于计算计算当前时间元素所在位置，和需要的公式
 * 2. 设置定时器，间隔interval 时间增加interval 元素动一次，把元素移动到当前位置
 * */

// window.animate = function (ele, target,duration=1000, callback= new Function) {
//         let begin = {},
//             change = {},  // 它是对象，后面要直接赋值，之前写成了null
//             time = 0;
//
//         let effect = (t, d, c, b) => t / d * c + b;
//
//         for (let attr in target) {
//             if (target.hasOwnProperty(attr)) {
//                 begin[attr] = utils.css(ele, attr);
//                 change[attr] = target[attr] - begin[attr];
//             }
//         }
//         let cur = {};
//         let timer = setInterval(() => {
//             time += 17;
//             if(time>=duration){// 边界判断，如果下一步时间就到了，直接跳到目标位置，之前没设置边界，他会一直走
//
//                 utils.css(ele, target);  // 批量设置属性就好，不用一个个设置
//                 clearInterval(timer);   //  动画完成后清除定时器，不然一直会循环，虽然位置没有变化（但是要在循环外面清除，意思是，都到达目标位置，这样比较符合逻辑
//                 return;   // return 如果不写，它会执行到函数的最后一行才结束， 会多走一步
//             }
//             for (let attr in target) {
//                 if (target.hasOwnProperty(attr)) {
//                     cur[attr] = effect(time,duration,change[attr],begin[attr]); // 思想混沌了，之前传入的是：effect(time/duration*change[attr]+begin[attr])
//                     utils.css(ele, attr, cur[attr]);
//                 }
//             }
//         }, 17)
//     };



window.animate = function (ele, target, duration = 1000, callback = new Function) {
    let begin = {},
        change = {};
    let effect = (t, d, c, b) => t / d * c + b;

    // for (let attr in target) {
    //     if (target.hasOwnProperty(attr)) {
    //         begin[attr] = utils.css(ele, attr);
    //         change[attr] = target[attr] - begin[attr];
    //     }
    // }
    utils.each(target, (key,value)=>{
        begin[key] = utils.css(ele, key);
        // change[key] = target[key] - begin[key];
        change[key] = value - begin[key];
    });


    let interval = 17,
        time = 0,
        cur = {};
    let timer = setInterval(() => {
        time += interval;
        if(time>=duration){
            utils.css(ele, target);
            clearInterval(timer);
            return;
        }
        for (let attr in target) {
            if (target.hasOwnProperty(attr)) {
                cur[attr] = effect(time, duration, change[attr], begin[attr]);
            }
        }
        utils.css(ele, cur);
    }, interval)

};


// animate(box, {top: 500,left: 800});
























