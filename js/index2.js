(function () {
    let index2Render = (function () {
        let lis = document.querySelectorAll('.fs .left-nav li'),
            liList = [...lis],
            data = null;

        let queryData = function () {
            return new Promise(resolve => {
                $.ajax({
                    url: 'json/index2.json',
                    method: 'GET',
                    async: true,
                    dataType: 'json',
                    success: resolve
                })
            })
        };

        let bindHTML = function (result) {
            data = result;
            let reg = /(.*?)\|([^|]+)\|\|\d/,
                str = ``,
                leftNav = document.querySelector('.fs .left-nav ul');
            data.forEach((itemData, indexData) => {// 拼接navA title dt dd  imgBox所需要的信息
                let dataLi = itemData.s,
                    dataTitle = itemData.t,
                    dataDt = dataLi,
                    imgBoxOne = itemData.b,
                    imgBoxTwo = itemData.p;

                let subNavAStr = ``,  // 侧栏字符串
                    titleStr = ``,
                    dtStr = ``,
                    dlStr = ``,
                    imgBoxOneStr = ``,
                    imgBoxTwoStr = ``,
                    imgReg = /.*?\|.*?\|(.*?)\|/;
                // 拼接navA
                imgBoxOne.forEach(img1Data => {

                    let imgSrc = 'https://img11.360buyimg.com/' + imgReg.exec(img1Data)[1];
                    imgBoxOneStr += `<a href="javascript:;"><img src="${imgSrc}" alt=""></a>`;
                });

                imgBoxTwo.forEach(img2Data => {
                    let imgSrc = 'https://img11.360buyimg.com/' + imgReg.exec(img2Data)[1];
                    imgBoxTwoStr += `<a href="javascript:;"><img src="${imgSrc}" alt=""></a>`;
                });

                dataTitle.forEach(titleItem => {
                    titleStr += `<a href='${reg.exec(titleItem)[1]}'>${reg.exec(titleItem)[2]}<i class="iconfont icon-jiantou1"></i></a>`;
                });

                dataLi.forEach(item => {
                    let liNavA = item.n,
                        descAry = item.s;
                    subNavAStr += `<a href='${reg.exec(liNavA)[1]}'>${reg.exec(liNavA)[2]}/</a>`;
                    descAry.forEach(descItem => {
                        let dtA = descItem.n,
                            ddA = descItem.s;
                        dtStr = `<a href="${reg.exec(dtA)[1]}">${reg.exec(dtA)[2]}<i class="iconfont icon-jiantou1"></i></a>`;

                        let ddStr = ``;

                        ddA.forEach(ddItem => {
                            let ddAData = ddItem.n;
                            ddStr += `<a href="${reg.exec(ddAData)[1]}">${reg.exec(ddAData)[2]}</a>`;
                        });
                        dlStr += `<dl><dt>${dtStr}</dt>
                            <dd class="clearfix">${ddStr}</dd></dl>`;
                    });
                });
                subNavAStr = subNavAStr.slice(0, -5) + '</a>';
                str += `<li>
                    <div class="navA">${subNavAStr}</div>
                    <div class="menu clearfix">
                    <div class="menu-left">
                        <div class="menu-header clearfix">${titleStr}</div>
                        ${dlStr}
                    </div>
                     <div class="menu-right">
                     <div class="imgTop"> ${imgBoxOneStr}</div>
                     <div class="imgBottom"> ${imgBoxTwoStr}</div>
                    </div>
                    </div>   
                </li>`
            });
            leftNav.innerHTML = str;
        };
        return {
            init: () => {
                let promise = queryData();
                promise.then(bindHTML)
            }
        }
    })();
    index2Render.init();
})();

$(function () {
    let bannerRender = (function anonymous() {
        let $container = $('.fs .bannerBox .container'),
            $wrapper = $container.children('.wrapper'),
            $focus = $container.children('.focus'),
            $arrowLeft = $container.children('.arrow-left'),
            $arrowRight = $container.children('.arrow-right '),
            $slideList = $wrapper.children('li'),
            $focusList = $focus.children('i');


        //=>SLIDE切换的公共方法
        let changeSlide = function changeSlide() {
            /*
             * 切换思路：
             *   1.让当前的Z-INDEX=1，并且让上一个的Z-INDEX=0（这样是为了保证不管结构是靠前还是靠后，始终当前这个都是层级最高的，也是优先展示的）
             *   2.让当前的实现出渐现的效果（OPACITY从0~1）
             *   3.当前这个已经渐现出来（动画结束），我们再让上一个透明度为零（为了下一次展示它的时候，透明度是从零开始渐现的）
             *   4.让当前的索引变为下一次对应的上一次索引
             */
            let $cur = $slideList.eq(_index),
                $last = $slideList.eq(_lastIndex);
            $cur.css('zIndex', 1);
            $last.css('zIndex', 0);
            $cur.stop().animate({
                opacity: 1
            }, _speed, () => {
                $last.css({opacity: 0});
            });
            changeFocus();
            _lastIndex = _index;
        };

        //=>AUTO-MOVE:自动轮播
        let _index = 0,//=>当前展示SLIDE的索引
            _lastIndex = 0,//=>上一次展示SLIDE的索引
            _timer = null,//=>存储自动轮播的定时器
            _interval = 2000,//=>多久切换一次
            _speed = 200;//=>每一次切换动画的时间

        let autoMove = function autoMove() {
            _index++;
            //=>边界判断：如果累加的结果大于最大索引，我们展示第一个SLIDE即可
            if (_index >= $slideList.length) {
                _index = 0;
            }
            changeSlide();
        };

        //=>CHANGE-FOCUS:焦点对齐
        let changeFocus = function changeFocus() {
            $focusList.eq(_index).addClass('active');
            $focusList.eq(_lastIndex).removeClass('active');
        };

        //=>HANDLE-MOUSE:鼠标控制暂停和开启
        let handleMouse = function handleMouse() {
            $container.on('mouseenter', () => {
                clearInterval(_timer);
                $arrowLeft.add($arrowRight).css('display', 'block');//=>ADD:是在一个JQ集合中增加一些新的元素(获取新的JQ对象),有点类似乎两个集合合并
            }).on('mouseleave', () => {
                _timer = setInterval(autoMove, _interval);
                $arrowLeft.add($arrowRight).css('display', 'none');
            })
        };

        //=>HANDLE-ARROW:箭头左右切换
        let handleArrow = function handleArrow() {
            $arrowRight.on('click', autoMove);
            $arrowLeft.on('click', () => {
                _index--;
                if (_index < 0) {
                    _index = $slideList.length - 1;
                }
                changeSlide();
            });
        };

        //=>HANDLE-FOCUS:点击焦点切换
        let handleFocus = function handleFocus() {
            $focusList.on('mouseenter', function anonymous() {
                let curIndex = $(this).index();
                if (_index === curIndex) {
                    //=>当前展示的和点击的是同一个，不做任何的处理
                    return;
                }
                _index = curIndex;
                changeSlide();
            });
        };

        return {
            init: function init() {
                //=>获取数据成功后处理的事情(DATA就是获取的数据)
                _timer = setInterval(autoMove, _interval);
                handleMouse();
                handleArrow();
                handleFocus();
            }
        }
    })();
    bannerRender.init();
});

(function () {
    let container = document.querySelector('#newsTab1'),
        newsTab = container.querySelector('.news-tab'),
        newsItem2 = container.querySelector('.news-item2');

    let trans = function () {
        if (newsItem2.className.indexOf('active') > -1) {
            newsTab.style.transform = 'translateX(58px)';
        } else {
            newsTab.style.transform = 'translateX(0)';
        }
    };

    let index2Tab1 = new TabPlugin(container, {
        limit: 2,
        changeEnd: trans
    });

})();

// 动画
(function () {
    let activeImg0 = document.querySelectorAll('.fs .newsBox .service-img li'),
        $box = $('.fs .newsBox .service-img'),
        $descBox = $('.fs .newsBox .service-desc'),
        $headList = $('.fs .newsBox .service-desc .service-head a'),
        activeImg1 = [...activeImg0].slice(0, 4),
        closeA = document.querySelector('#guanbi0');
    activeImg1.forEach((item, index) => {
        item.onmouseenter = function () {
            // let an = new Promise(resolve=>{
            //     $box.animate({
            //         top: '-55px'
            //     }, 2000);
            // });

            fn = function () {
                console.log(1);
                $box[0].style.display = 'none';
                $descBox[0].style.display = 'block';
                $descBox[0].style.zIndex = 3;
                $headList[index].classList.add('active');
            };  //好问题

            $box.animate({
                top: '-44px'
            }, 1000, fn);

            // an.then(()=>{
            //     console.log(1);
            // });
        }
    });


    closeA.onclick =  function () {
        $descBox.css({
            display: 'none',
            zIndex: 1
        });
        $box.css({
            display: 'block',
            zIndex: 2
        });
        $box.animate({
            top: 0
        });
    }
})();

(function () {
    let container2 = document.querySelector('#serviceTab2'),
    container1 = document.querySelector('#serviceTab1');

    let serviceTab2 = new TabPlugin(container2);

    let serviceTab21 = new TabPlugin(container1);
})();
