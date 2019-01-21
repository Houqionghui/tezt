(function () {
    let liveRender = (function () {
        let live_inner = document.querySelector('.live_inner'),
            liveBoxLeft = live_inner.querySelector('.liveBoxLeft'),
            liveBoxMiddle = live_inner.querySelector('.liveBoxMiddle'),
            liveBoxRight = live_inner.querySelector('.liveBoxRight');

        let queryData = function () {
            return new Promise(resolve => {
                let xhr = new XMLHttpRequest;
                xhr.open('GET', 'json/news.json');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let data = JSON.parse(xhr.responseText);
                        resolve(data);
                    }
                };
                xhr.send(null);
            })
        };

        let bindHTML = function (data) {
            let str = ``;
            (data.left).forEach((item, index) => {
                let {title, img} = item;
                str += `<a href="#" target="_blank" class="live_middle">
                        <div class="liveImg"><img src="${img}" alt=""></div>
                        <div class="liveBtn"></div>
                        <p class="liveInfo">${title}</p>
                    </a>`;
            });
            liveBoxLeft.innerHTML = str;

            let str1 = ``;
            (data.middle).forEach((item, index) => {
                let {title, img, content} = item;
                str1 += `<a href="#" target="_blank" class="live_middle2">
                        <div class="liveImg"><img src="${img}" alt=""></div>
                        <div class="liveBtn"></div>
                        <h4>${title}</h4>
                        <p class="liveInfo">${content}</p>
                    </a>`;
            });
            liveBoxMiddle.innerHTML = str1;

            let str2 = ``;
            (data.right).forEach((item, index) => {
                let {title, img} = item;
                str2 += `<a href="#" target="_blank" class="live_middle">
                        <div class="liveImg"><img src="${img}" alt=""></div>
                        <div class="liveBtn"></div>
                        <p class="liveInfo">${title}</p>
                    </a>`;
            });
            liveBoxRight.innerHTML = str2;
        };


        return {
            init: function () {
                let promise = queryData();
                promise.then(bindHTML);
            }
        }
    })();
    liveRender.init();

    let moreRender = (function () {
        let moreList = document.querySelector('.moreList'),
            isRun = false,
            page = 0,
            allLi = null;

        let queryData = function () {
            return new Promise(resolve => {
                page++;
                let xhr = new XMLHttpRequest;
                xhr.open('GET', 'json/more.json', true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let data = JSON.parse(xhr.responseText);
                        resolve(data);
                    }
                };
                xhr.send(null);
            });
        };

        let bindHTML = function (data) {
            if (!data) return;
            let str = ``;
            data.forEach((item, index) => {
                let {title, price, img, imgBig} = item;
                if (imgBig) {
                    str += `<li class="moreItem moreItemImg">
                        <a href="" class="moreLink">
                            <img src="" data-src="${imgBig}"/>
                        </a>
                    </li>`;
                    return;
                }
                str += `<li class="moreItem">
                <a href="" class="moreLink">
                    <div class="moreImg"><img src="" data-src="${img}"/></div>
                    <div class="moreInfo">
                        <p class="moreText">${title}</p>
                        <p class="morePrice">￥${price}</p>
                    </div>
                </a>
                <div class="moreFind">
                    <div class="moreBtn">
                        <span class="resemble">找相似</span>
                    </div>
                </div>
            </li>`;
            });
            moreList.innerHTML += str;
            isRun = false;
            setTimeout(lazyImg, 1000);
        };

        let lazyImg = function () {
            let moreImg = document.querySelectorAll('.moreImg'),
                moreItemImg = document.querySelectorAll('.moreItemImg');
            let moreImgAry = [...moreImg], moreItemImgAry = [...moreItemImg];
            moreImgAry.forEach(item => {
                if (item.isLoad) return;
                let moreImgOneS = item.querySelector('img');
                let trueImg = moreImgOneS.getAttribute('data-src');
                let tempImg = new Image();
                tempImg.onload = function () {
                    moreImgOneS.src = trueImg;
                    moreImgOneS.style.display = 'block';
                    tempImg = null;
                    item.isLoad = true;
                };
                tempImg.src = trueImg;
            });
            moreItemImgAry.forEach(item => {
                if (item.isLoad) return;//=>如果已经加载了图片，就不要再加载了
                let moreImgOneS = item.querySelector('img');
                let trueImg = moreImgOneS.getAttribute('data-src');
                let tempImg = new Image();
                tempImg.onload = function () {
                    moreImgOneS.src = trueImg;
                    moreImgOneS.style.display = 'block';
                    tempImg = null;
                    item.isLoad = true;//=>自定义属性
                };
                tempImg.src = trueImg;
            })
        };

        return {
            init: function () {
                let promise = queryData();
                promise.then(bindHTML).then(
                    window.onscroll = function () {
                        let winH = document.documentElement.clientHeight,
                            pageH = document.documentElement.scrollHeight,
                            scrollT = document.documentElement.scrollTop;
                        if ((scrollT + 200) > (pageH - winH)) {
                            if (isRun) return;
                            console.log('1');
                            isRun = true;
                            if (page > 3) {
                                //alert('没有更多数据了');
                                return;
                            }
                            let promise2 = queryData();
                            promise2.then(bindHTML);
                        }
                    }
                )
            }
        }
    })();
    moreRender.init();
})();


