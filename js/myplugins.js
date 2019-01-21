/**
 * Created by q977821807 on 2018/5/14.
 */
// 思路： 自执行函数创建类
// 1. 参数验证  参数初始化   参数挂载
// 2. 获取slideList 幻灯片列表 把第一项复制一份放到最后 获取焦点列表 左右箭头（如果有的话）
// 3. 设置定时器自动轮播，到最后一张，再轮播需跳到第一张，然后继续（右箭头）
// 4. 处理左箭头，到第一张后，再点，需跳到最后一张，然后继续
/*5. 参数设计
 container: 要实现轮播的容器
 focusEvent: 触发焦点的事件
 isArrow: 是否有箭头
 isSlide: 是否轮播
 isFadein: 是否渐隐渐现
 callback: 回调函数
 */

(function () {
    class myBanner {
        constructor(container, options = {}) {
            if (typeof container !== 'undefined' && typeof container === 'object') {
                // console.log(container);
                if (container.nodeType !== 1) {
                    throw new SyntaxError('你传的不是元素对象');
                }
            } else {
                throw new SyntaxError('你的参数有问题');
            }

            let _default = {
                container: container,
                focusEvent: 'mouseover',
                stepWidth: 350,
                index: 0,
                preIndex: 0,
                isArrow: false,
                isSlide: false,
                isFocus: true,
                isFadein: false,
                interval: 3000,
                slideSpeed: 200,
                callback: new Function
            };


            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    _default[key] = options[key];
                }
            }


            for (let key in _default) {
                if (_default.hasOwnProperty(key)) {
                    this[key] = _default[key]
                }
            }
           // console.log(this);

            this.wrapper = container.querySelector('.wrapper');
            let focusList = container.querySelectorAll('.focus i');
            this.focusList = [...focusList];
            this.slideList = container.querySelectorAll('.wrapper>li');


            if (this.isFadein) return;
            if (this.isArrow) {
                let leftArrow = container.parentNode.querySelector('.arrowLeft') || container.querySelector('.arrowLeft'),
                    rightArrow = container.parentNode.querySelector('.arrowRight') || container.querySelector('.arrowRight');

                this.leftArrow = leftArrow;
                this.rightArrow = rightArrow;

                console.log(leftArrow,1);
                this.leftArrow.onclick = this.rightArrow.onclick = this.handleArrow.bind(this);

                if(this.isSlide){  // 只有可移动的，才才有可能触发离开时重新设置定时器
                    this.leftArrow.onmouseenter = this.leftArrow.onmouseleave = this.handleContainer.bind(this);
                    this.rightArrow.onmouseenter = this.rightArrow.onmouseleave = this.handleContainer.bind(this);
                }
            }

            this.wrapper.appendChild(this.slideList[0].cloneNode(true));  // 是克隆不是移动！！！ 第二次在这里犯错 // 并且cloneNode是元素本身的放法，不是document里面的
            this.slideList = container.querySelectorAll('.wrapper>li');


            this.slideList = [...this.slideList];
            utils.css(this.wrapper, 'width', this.slideList.length * this.stepWidth);

            // console.log(2,this.slideList, this.wrapper);

            if (this.isSlide) {
                this.timer = setInterval(this.automove.bind(this), this.interval);
                this.container.onmouseenter = this.container.onmouseleave = this.handleContainer.bind(this);
            }

            this.focusList.forEach((item, index) => {
                item.onmouseenter = this.handleFocus.bind(this, index);
                item.onmouseleave = this.handleFocus.bind(this, index);
            })

        }

        automove() {
            this.index++;
            if (this.index > this.slideList.length - 1) {
                utils.css(this.wrapper, 'left', 0);
                /*第一波打节奏*/
                this.index = 1;// 之前写成零，实际在索引为零出处没有停顿，到1处才停顿interval
                // animate(this.wrapper, {  // 其实从这一行开始到103行都可以不要，让wrapper会到起始，改下索引就好，因为后面操作相同
                //     left: -this.index * this.stepWidth
                // }, this.slideSpeed);
                // this.changeFocus(); // 之前这一步也没写，造成，索引实际为1一时，焦点还在0处，而上一次焦点也在零处，给此处加了类名又减掉
                // return;  // 要return 不然下面代码会走，导致停顿时间加长
            }
            animate(this.wrapper, {
                left: -this.index * this.stepWidth
            }, this.slideSpeed);

            this.changeFocus();
        }

        changeFocus() {
            if (!this.isFocus) return;
            let temIndex = this.index;   // 任何时候都不能随便改轮播图的索引，因为它是全局的很多地方要用，这里可以用一个临时索引存起来
            // 之前没写这个，在下面直接写的导致索引乱 if (this.index === this.slideList.length - 1) this.index = 0;
            if (this.index === this.slideList.length - 1) temIndex = 0;
            let classN = this.focusList[temIndex].className;  // 元素的类名是它自己的属性不是样式属性
                // 之前写成this.focusList[this.index].style.className
               // preClass = this.focusList[this.preIndex].className;

            // section1 6 块轮播图出现了焦点改变不了的bug，是因为preIndex不是确定的，被改变后，没有改回来
            this.focusList.forEach((item, index)=>{
                if(index !==temIndex ) {
                    if (this.focusList[index].className.indexOf('active') > -1) {
                        // let temAry = preClass.trim().split(' '),
                        //     i = temAry.indexOf('active');
                        // temAry.splice(i, 1);
                        this.focusList[index].className = this.focusList[index].className.replace(/active/g, '');
                    }
                }
            });

            if (classN.indexOf('active') > -1) return;
            this.focusList[temIndex].className += ' active';
            //this.preIndex = temIndex;
        }

        handleFocus(n, ev) {// 参数在前，ev在后
            //if(this.preIndex === n) return;
            if (this.index === this.slideList.length - 1) {
                utils.css(this.wrapper, 'left', 0);
            }
            this.index = n;
            if (ev.type === 'mouseenter') {
                //clearInterval(this.timer);  // 因为焦点在container内，进入container 已经清除定时器了，不需要重复清除；
                animate(this.wrapper, {
                    left: -this.index * this.stepWidth
                }, this.slideSpeed);
                if (!this.isFocus) return;
                this.changeFocus();
                return;
            }
            //this.timer = setInterval(this.automove.bind(this), this.interval);
        }

        handleContainer(ev) {
            if (ev.type === 'mouseenter') {
                clearInterval(this.timer);
                return;
            }
            console.log('是它对吧');
            this.timer = setInterval(this.automove.bind(this), this.interval);
        };

        handleArrow(ev) {
            console.log(2);
            if (ev.target === this.rightArrow || ev.target === this.rightArrow.querySelector('*')) {
                // 当arrow 有子元素时，点子元素也会触发事件,这点之前没考虑到
                this.automove();
                return;
            }
            this.index--;
            if (this.index < 0) {
                utils.css(this.wrapper, 'left', -(this.slideList.length - 1) * this.stepWidth);// 之前这里没加负号， -(this.slideList.length - 1)
                this.index = this.slideList.length - 2;
                animate(this.wrapper, {
                    left: -this.index * this.stepWidth
                }, this.slideSpeed);
                this.changeFocus();
                return;  // 要return 不然下面代码会走，导致停顿时间加长
            }
            animate(this.wrapper, {
                left: -this.index * this.stepWidth
            }, this.slideSpeed);
            this.changeFocus();
        }
    }
    window.myBanner = myBanner;
})();

~function anonymous(window) {

    class TabPlugin {
        constructor(container, options = {}) {
            //=>第一个参数必传，而且传递的还需要是元素对象，如果匹配直接抛出异常信息，不让继续执行了（参数合法性验证）
            if (typeof container === 'undefined' || container.nodeType !== 1) {
                throw new SyntaxError('The first parameter is the item that must be passed, and it must be an element object type!');
            }

            //=>参数初始化（初始化配置项）：把处理好的参数配置项尽可能的挂载到当前类的实例上，成为实例的私有属性，这样不仅在公共或者私有方法中直接可以获取使用，而且也保证每一个实例之间这些属性是不冲突的
            let _default = {
                lastIndex: 0,
                eventType: 'mouseover',
                customPageClass: 'option',
                customContentClass: 'con',
                changeEnd: null,
                limit: null,
            };
            for (let attr in options) {
                if (options.hasOwnProperty(attr)) {
                    _default[attr] = options[attr];//=>把OPTIONS传递进来的信息值覆盖_DEFAULT，此时_DEFAULT中存储的就是最新值
                }
            }
            for (let attr in _default) {
                if (_default.hasOwnProperty(attr)) {
                    this[attr] = _default[attr];
                }
            }

            //=>获取需要操作的元素，把获取的元素也挂载到实例上
            this.container = container;
            let childs = [...container.children],
                option = null;
            option = childs.find(item => this.hasClass(item, this.customPageClass));

            this.optionList = option ? [...option.children] : [];
            this.optionList = this.limit?this.optionList.slice(0,this.limit):this.optionList;  // 自加
            this.conList = childs.filter(item => this.hasClass(item, this.customContentClass));
            // console.log(option,this.optionList,this.conList);

            //=>让个LAST-INDEX对应项有选中样式，其余项没有选中样式
            this.optionList.forEach((item, index) => {
                // console.log(item, index);
                // console.log('conlist', this.conList);
                if (index === this.lastIndex) {
                    this.addClass(this.optionList[index], 'active');
                    this.addClass(this.conList[index], 'active');
                    return;
                }
                this.removeClass(this.optionList[index], 'active');
                this.removeClass(this.conList[index], 'active');
            });

            //=>实现选项卡
            this.changeTab();
        }

        /*==把公共方法挂载到类的原型上==*/
        hasClass(ele, str) {
            // console.log(ele);
            return ele.className.trim().split(/ +/).indexOf(str) >= 0;
        }

        addClass(ele, str) {
            //=>hasClass()不能直接调取，需要基于实例调取使用(或者直接基于类来调取使用也可以 TabPlugin.prototype.hasClass())
            if (this.hasClass(ele, str)) return;
            ele.className += ` ${str}`;
        }

        removeClass(ele, str) {
            if (!this.hasClass(ele, str)) return;
            ele.className = ele.className.trim().split(/ +/).filter(item => item !== str).join(' ');
        }

        changeTab() {
            this.optionList.forEach((item, index) => {
                //=>THIS:实例
                let _this = this;
                item[`on${this.eventType}`] = function anonymous() {
                    //=>THIS:当前操作的LI
                    if (_this.lastIndex === index) return;
                    _this.addClass(this, 'active');
                    _this.removeClass(_this.optionList[_this.lastIndex], 'active');

                    _this.addClass(_this.conList[index], 'active');
                    _this.removeClass(_this.conList[_this.lastIndex], 'active');

                    _this.lastIndex = index;

                    //=>切换完成后执行传递进来的回调函数（回调函数中的THIS是当前类的实例，把当前切换这一项索引和上一项的索引传递给回调函数，还把当前操作的LI以及操作的CON也都传给回调函数了）
                    _this.changeEnd && _this.changeEnd(this, _this.conList[index], index, _this.lastIndex);
                };
            });
        }
    }

    window.TabPlugin = TabPlugin;
}(window);






