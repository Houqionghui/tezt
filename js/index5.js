(function () {
    let bannerRender = (function () {
        let container = document.querySelector('#auto_container'),
            wrapper = container.querySelector('.autoData'),
            focus = container.querySelector('.focus'),
            searchLive = document.querySelector('#searchLive'),
            arrow = searchLive.querySelectorAll('.arrow'),
            arrowLeft = searchLive.querySelector('.arrowLeft'),
            arrowRight = searchLive.querySelector('.arrowRight'),
            slideList = null,
            focusList  = focus.querySelectorAll('i');  // 1.改



        //循环数组绑定 鼠标划入 滑出事件
        let arrowAry = [].slice.call(arrow);
        arrowAry.forEach((item)=>{
            item.onmouseenter = function () {
                this.style.opacity=.9;
            };
            item.onmouseleave = function () {
                this.style.opacity=.3;
            }
        });



        let stepIndex = 0,
            interval = 2000,
            autoTimer = null;




        let autoMove = function () {
            stepIndex++;
            if(stepIndex >= slideList.length){
                utils.css(wrapper,'left', 0);
                stepIndex = 1;
            }
            animate(wrapper,{
                left: -stepIndex * 350
            },200);

            changeFocus();

        };
        let changeFocus = function () {

            let tempIndex = stepIndex;

            tempIndex === slideList.length - 1 ?tempIndex = 0 :'';
            [].forEach.call(focusList,(item, index) => {
                /*            if(index===tempIndex){
                 item.style.width='8px';
                 item.style.height='8px';
                 item.style.borderColor='transparent';
                 }else {
                 item.style.width='6px';
                 item.style.height='6px';
                 item.style.borderColor='#999'
                 }*/

                item.className = index === tempIndex ? 'active' : '';

            });
        };
        let queryData = function () {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest;
                let data=null;
                xhr.open('GET','json/data5.json');
                xhr.onreadystatechange = () => {
                    xhr.readyState === 4 && xhr.status === 200 ? ((data = JSON.parse(xhr.responseText)),(resolve(data))): '';
                };

                xhr.send(null);
            });
        };
        let bindHTML = function (data) {
            let strSlide = ``;
            // strFocus = ``;
            data.forEach((item,index) => {
                let {img = 'img/banner1',title,desc} = item;
                strSlide += `<a href="javascript:;" class="slide">
                <img src="${img}" alt="">
                <h3>${title}</h3>
                <p>${desc}</p>
                </a>`;
                // strFocus += `<li class="${index === 0 ? 'active' : null}"></li>`;

            });
            wrapper.innerHTML = strSlide;
            // focus.innerHTML = strFocus;
            slideList = wrapper.querySelectorAll('.slide');

            wrapper.appendChild(slideList[0].cloneNode(true));
            slideList = wrapper.querySelectorAll('.slide');
            utils.css(wrapper,'width' ,slideList.length * 350);

        };
        let handelContainer = function () {
            container.onmouseenter = function () {
                clearInterval(autoTimer);
                /*arrowLeft.style.opacity = arrowRight.style.opacity = 0.9;*/
            };
            container.onmouseleave = function () {
                autoTimer = setInterval(autoMove,interval);
                /*arrowLeft.style.opacity = arrowRight.style.opacity = 0.3;*/

            }
        };


        /*    let handleSearchLive = function () {
         searchLive.onmouseenter = function () {
         arrowLeft.style.opacity = arrowRight.style.opacity = 0.7;
         };
         searchLive.onmouseleave = function () {
         arrowLeft.style.opacity = arrowRight.style.opacity = 0.3;
         }
         };*/




        let handelFocus = function () {
            [].forEach.call(focusList, (item, index) => {
                item.onmouseenter = function () {
                    stepIndex = index;
                    animate(wrapper, {
                        left: -stepIndex * 350
                    }, 200);
                    changeFocus();
                };
            });
        };

        let handelArrow = function () {
            arrowRight.onclick = autoMove;
            arrowLeft.onclick = function () {
                stepIndex--;
                if(stepIndex < 0){
                    utils.css(wrapper,'left',-(slideList.length - 1) * 350);
                    stepIndex = slideList.length - 2;
                }
                animate(wrapper,{
                    left: -stepIndex *350
                },200);
                changeFocus();
            }
        };
        return {
            init: function init() {
                let promise = queryData();
                promise.then(bindHTML).then(
                    autoTimer = setInterval(autoMove, interval)
                ).then(() => {
                    handelContainer();
                    handelFocus();
                    handelArrow();
                    /*handleSearchLive();*/
                })
            }
        }

    })();
    bannerRender.init();
})();