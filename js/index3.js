(function () {
    let bannerEed = (function () {
        let conter = document.querySelector('#conter'),
            bannerBox = conter.querySelector('.imgI .bannerBox'),
            wappr = bannerBox.querySelector('.wappr'),
            focus = conter.querySelector('.focus'),
            linkList = null,
            fockList = null;

        let stepIndex = 0,//=>STEP-INDEX记录当前展示块的索引(步长)
            autoTimer = null,//=>AUTO-TIMER自动轮播的定时器
            interval = 3000;//=>INTERVAL间隔多长时间自动切换一次

        let autoMove = function autoMove() {
            stepIndex++;
            if (stepIndex >= linkList.length) {
                utils.css(wappr, 'left', 0);
                stepIndex = 0;
            }
            //->基于自主封装的ANIMATE实现切换动画
            animate(wappr, {
                left: -stepIndex * 180
            }, 500);
            changeFocus();
        };

        let changeFocus = function changeFocus() {
            let tempIndex = stepIndex;
            tempIndex === linkList.length - 1 ? tempIndex = 0 : null;
            [].forEach.call(fockList, (item, index) => {
                item.className = index === tempIndex ? 'active' : '';
            });
        };

        let handleFocus = function handleFocus() {
            [].forEach.call(fockList, (item, index) => {
                item.onclick = function () {
                    console.log(item);
                    stepIndex = index;//=>点击的是谁，就让STEP-INDEX运动到哪（STEP-INDEX和点击LI的索引一致即可）
                    console.log(stepIndex);
                    animate(wappr, {
                        left: -stepIndex * 180
                    }, 1000);
                    changeFocus();
                };
            });
        };

        let queryData = function queryData() {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest;
                xhr.open('GET', 'json/bnn3.json');
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let data = JSON.parse(xhr.responseText);
                        resolve(data);
                    }
                };
                xhr.send(null);

            });
        };

        let binnHt = function binnHt(data) {
            let strSlide = ``,
                strFocus = ``;
            data.forEach((item, index) => {
                let {picImg} = item;
                strSlide += `<div class="slide clear">
                <a href="">
                    <img src="${picImg}" alt="">
                </a>
            </div>`;

                //->ES6模板字符串中${}存放的是JS表达式,但是需要表达式有返回值,因为我们要把这个返回值拼接到模板字符串中
                strFocus += `<li class="${index === 0 ? 'active' : ''}"></li>`;
            });

            wappr.innerHTML = strSlide;
            focus.innerHTML = strFocus;
            //->获取所有的SLIDE和LI
            linkList = wappr.querySelectorAll('.slide');
            fockList = focus.querySelectorAll('li');
            wappr.appendChild(linkList[0].cloneNode(true));
            linkList = wappr.querySelectorAll('.slide');
            utils.css(wappr, 'width', linkList.length * 180);
        };

        return {
            init: function init() {
                let promise = queryData();
                promise.then(binnHt).then(() => {
                    //=>开启定时器驱动的自动轮播
                    autoTimer = setInterval(autoMove, interval);
                }).then(() => {
                    handleFocus();
                })
            }
        }
    })();
    bannerEed.init();

//获取元素
    let bannerRend = (function () {
        let conter = document.querySelector('#conter'),
            warpp = conter.querySelector('.warpp'),
            // banner=conter.querySelector('.banner'),
            productBox = warpp.querySelector('.productBox'),
            arrowLeft = conter.querySelector('.arrowLeft'),
            arrowRight = conter.querySelector('.arrowRight'),
            productList = null;
        //获取数据
        let queryData = function queryData() {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest;
                xhr.open('GET', 'json/banner3.json');
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let data = JSON.parse(xhr.responseText);
                        resolve(data);
                    }
                };
                xhr.send(null);
            });
        };

        //数据绑定
        let bindHTML = function bindHTML(data) {
            let liStr = ``;
            for (let i = 0; i < data.length; i += 4) {
                let str1 = ``;
                for (let j = 0; j < 4; j++) {
                    let item = data[i + j],
                        {picImg, title, price, cost} = item;
                    str1 += `<div class="swiper-slide"><a href="">
                <div class="picture">
                <img src="${picImg}" alt=""></div>
                <p>${title}</p>
                <div class="money">
                    <span class="mone1">￥ ${price}</span>
                    <span class="money2">¥ ${cost}</span>
                </div>
            </a></div>`;
                }
                liStr += `<li>${str1}</li>`;
            }
            productBox.innerHTML = liStr;
            productList = productBox.querySelectorAll('li');
            let bannerBox = conter.querySelector('.swiper-container'),
                banner = new myBanner(bannerBox, {
                    isArrow: true,
                    isFocus: false,
                    stepWidth: 800
                });

        };
        return {
            init: function () {
                let promise = queryData();
                promise.then(bindHTML)
            }
        }
    })();
    bannerRend.init();

//倒计时
    function displayTime() {
        let elt = document.getElementById("boxTime");
        let endTime = new Date("2018/11/18 9:24"); //获取目标时间
        let now = new Date(); //获取当前时间
        let leftTime = endTime.getTime() - now.getTime(); //计算时间差 两个时间之间的毫秒差
        if (leftTime < 0) {  //如果时间差小于0 就开始抢购
            // alert(leftTime);
            elt.innerHTML = "<p>开始抢购</p>";
        } else {
            // alert(leftTime);
            leftTime = parseInt(leftTime / 1000);
            // alert(leftTime)
            let o = Math.floor(leftTime / 3600);
            let o_yu = leftTime % 3600;
            let m = Math.floor(o_yu / 60);
            let s = o_yu % 60;
            if (o < 10) {
                o = '0' + o
            }
            if (m < 10) {
                m = '0' + m
            }
            if (s < 10) {
                s = '0' + s
            }
            elt.innerHTML = "<span>" + o + "</span><span>" + m + "</span><span>" + s + "</span>";
            setTimeout(displayTime, 1000);
        }
    }
    displayTime();
})();