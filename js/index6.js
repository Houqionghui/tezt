;(function () {
    let bannerRender = (function () {
        let characterBox = document.querySelector('#characterBox'),
            container = characterBox.querySelector('.container'),
            secondLevel = characterBox.querySelector('.secondLevel'),
            focus = characterBox.querySelector('.focus'),
            focusList = focus.querySelectorAll('li'),
            arrowLeft = document.querySelector('.characterBox .arrowLeft'),
            arrowRight = document.querySelector('.characterBox .arrowRight'),
            slideList = null;


        let stepIndex = 0,
            animateTimer = null,
            interval = 2000;

        let queryData = function () {
            return new Promise(resolve => {
                let xhr = new XMLHttpRequest;
                xhr.open('get', 'json/character.json');
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let data = JSON.parse(xhr.responseText);
                        resolve(data);
                    }
                };
                xhr.send(null);
            });
        };
        let bindHTML = function (data) {
            let strSlide = ``;


            data.forEach((item, index) => {
                let {title, img, link, desc} = item;
                strSlide += `<li>
                            <div class="title">
                                <a href="${link}" class="clearfix">
                                    <h3>${title}</h3>
                                    <img src="img/img6/zhinengxianfeng/download.png" alt="">
                                    <span>${desc}</span>
                                </a>
                            </div>
                            <div class="characterpic">
                                <a href="${link}">
                                    <img src="${img}" alt="">
                                </a>
                            </div>
                        </li>`;
            });

            secondLevel.innerHTML = strSlide;
            slideList = secondLevel.querySelectorAll('li');
            focusList = focus.querySelectorAll('li');
            secondLevel.appendChild(slideList[0].cloneNode(true));
            secondLevel.appendChild(slideList[1].cloneNode(true));
            secondLevel.appendChild(slideList[2].cloneNode(true));
            slideList = secondLevel.querySelectorAll('li');
            utils.css(secondLevel, 'width', slideList.length * 400);
        };


        //自动轮播
        let autoMove = function () {
            stepIndex++;
            if (stepIndex === 5) {
                utils.css(secondLevel, 'left', 0);
                stepIndex = 1;
            }

            animate(secondLevel, {left: -stepIndex * 1190}, 300);
            containerfocus();
        };

        //焦点跟随
        let containerfocus = function () {
            let secondIndex = stepIndex;
            secondIndex === 4 ? secondIndex = 0 : null;
            [].forEach.call(focusList, (item, index) => {
                item.className = index === secondIndex ? 'active' : null;
            })
        };
        //鼠标移进移出
        let overfocus = function () {
            container.onmouseenter = function () {
                clearInterval(animateTimer);
                container.onmouseleave = function () {
                    animateTimer = setInterval(autoMove, interval);
                }
            };
        };
        //鼠标经过
        let changefocus = function () {
            [].forEach.call(focusList, (item, index) => {
                item.onmouseenter = function () {
                    if (stepIndex === 4) {
                        utils.css(secondLevel, 'left', 0)
                    }
                    if (index === stepIndex) {
                        clearInterval(autoTimer);
                        console.log(autoTimer);
                    }

                    stepIndex = index;
                    animate(secondLevel, {left: -stepIndex * 1190}, 300);
                    containerfocus();
                }

            })

        };
        //点击箭头移动
        let changearrow = function () {
            arrowRight.onclick = autoMove;
            arrowLeft.onclick = function () {
                stepIndex--;
                if (stepIndex < 0) {
                    utils.css(secondLevel, 'left', -(slideList.length - 11) * 1190);
                    stepIndex = slideList.length - 12;
                }
                animate(secondLevel, {left: -stepIndex * 1190}, 300);
                containerfocus();
            }
        };
        return {
            init: function () {
                let promise = queryData();
                promise.then(bindHTML).then(() => {
                    animateTimer = setInterval(autoMove, interval)
                }).then(overfocus)
                    .then(changefocus)
                    .then(changefocus)
                    .then(changearrow)
            }
        }
    })();
    bannerRender.init();
})();




