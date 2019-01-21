(function () {
    let data = null,
        shop = document.querySelectorAll('.section1 .bannerBox .wrapper');
    let shopSlide = null;

    let special = document.querySelector('.section2 .bannerBox .wrapper'),
        specialSlide = special.querySelector('li'),
        coupon = document.querySelector('.section3 .bannerBox .wrapper'),
        couponSlide = coupon.querySelectorAll('.wrapper>li');


    let promise = new Promise((resolve, reject) => {
        $.ajax({
            url: 'json/index4.json',
            method: 'get',
            async: true,
            dataType: 'json',
            success: resolve
        })
    });


    let bindData = function (data) {
        let {sort, shoping, sale} = data;
        /*商品排序*/
        for (let j = 0, i = 0; j < sort.length; j += 6, i++) {  // 取出第一组数据,做绑定处理, i表示wrapper的索引
            let item = shop[i]; //012345 取出一个wrapper
            let liList = item.querySelectorAll('li'),//wrapper下的li
                strSort1 = ``, strSort2 = ``;
            for (let k = 0; k < 6; k += 3) {
                for (let n = 0; n < 3; n++) {
                    let dataItem = sort[j + k + n];
                    let {kind, pic, desc, rank, link} = dataItem;
                    // console.log(j + k + n);
                    if (!dataItem)break;
                    if (k < 3) {
                        strSort1 += `<div class="rank_desc">
                                <img src="${pic}" alt="">
                                <span>${rank}</span>
                                <p>${desc}</p>
                            </div>`;

                    } else {
                        strSort2 += `<div class="rank_desc">
                                <img src="${pic}" alt="">
                                <span>${rank}</span>
                                <p>${desc}</p>
                            </div>`;
                    }
                }
            }
            liList[0].innerHTML = strSort1;
            liList[1].innerHTML = strSort2;
        }

        let specialStr = ``;
        for (let i = 0; i < shoping.length; i++) {
            let {pic1, pic2, pic3, pic4, title, desc, link} = shoping[i];
            specialStr += `<li><div  class="titleImg"><a href="javascript:;"><img src="${pic1}" alt=""></a></div>
                       <div class="contentImg clearfix"> 
                        <a href="javascript:;"><img src="${pic2}" alt=""></a>
                        <a href="javascript:;"><img src="${pic3}" alt=""></a>
                        <a href="javascript:;"><img src="${pic4}" alt=""></a>
                        </div>
                        <h3>${title}</h3>
                        <p>${desc}</p></li>`;

            special.innerHTML = specialStr;

        }
        let couponStr = ``, couponIndex = -1;
        for (let i = 0; i < sale.length; i += 3) {
            couponStr = ``;
            couponIndex++;
            for (let j = 0; j < 3; j++) {
                let item = sale[i + j];
                if (!item)break;
                let {pic, price, limit, desc, tag} = sale[j + i];
                couponStr += `<div class="coupon_item clearfix">
                                <a href="javascript:;" class="clearfix">
                                    <div class="image"><img
                                            src="${pic}"
                                            alt="">
                                    </div>
                                    <div class="coupon-middle">
                                    <i>￥</i>
                                    <span>${price}</span>
                                        <div class="limit">满${limit}元可用</div>
                                        <div class="coupon_desc">${desc}</div>
                                    </div>
                                    <div class="coupon_more_inner">${tag}</div>
                                </a>
                            </div>`;
            }
            couponSlide[couponIndex].innerHTML = couponStr;
        }
        //console.log(1, '绑定数据'); 由于获取数据是异步的，后面的代码如果不用Promise管理，会
        // 都放到主任务队列，后面的代码会先执行

    };
    promise.then(bindData).then(() => {
        let bannerBox2 = document.querySelector('.section2 .bannerBox'),
            slideL = bannerBox2.querySelectorAll('.wrapper li');
        // console.log(bannerBox2);
        let banner2 = new myBanner(bannerBox2, {
            stepWidth: 350,
            isArrow: true,
            isSlide: true
        });

        // section1轮播图
        let navList = document.querySelectorAll('.corechn1_nav>li>a'),
            navListAry = [...navList],
            bannerList = document.querySelectorAll('.section1 .bannerBox'),
            pre = 0;

        let bannerPre = document.querySelector('.section1 .active.bannerBox'),
            wrapper =  bannerPre.querySelector('.wrapper'),
            slideList = wrapper.querySelectorAll('li');
        let bannerOne = new myBanner(bannerPre, {});
        // let bannerPre = document.querySelectorAll('.section1 .bannerBox');
        // console.log(bannerPre);
        // bannerAry = [...bannerPre];
        // bannerAry.forEach(item=>{
        //     new myBanner(item, {});
        // });

        navListAry.forEach((item, index) => {
            item.onmouseover = function () {
                if (pre === index) return;
                if(bannerOne) bannerOne = null;
                let reg = '';
                bannerList[pre].className = bannerList[pre].className.replace('active', '');// 单独改变值，是没用的，它不是引用类型，需要赋值
                navListAry[pre].className = navListAry[pre].className.replace('active', '');
                if (bannerList[index].className.indexOf('active') === -1) {
                    bannerList[index].className += ' active';
                    navListAry[index].className += ' active';
                }
                pre = index;
                let bannerPre = document.querySelector('.section1 .active.bannerBox'),
                    wrapper =  bannerPre.querySelector('.wrapper'),
                    slideList = wrapper.querySelectorAll('li');
                bannerOne = new myBanner(bannerPre, {});
            };
        });

       // section3 轮播图
        let bannerBox3 = document.querySelector('.section3 .bannerBox'),
            banner = new myBanner(bannerBox3, {});
    })
})();