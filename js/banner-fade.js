
let bannerRender = (function anonymous() {

    //=>QUERY-DATA:获取数据
    let queryData = function queryData() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'json/index2.json',//=>请求API地址
                method: 'get',//=>请求方式
                dataType: 'json',//=>把获取的JSON字符串转为对象
                async: true,//=>TRUE:异步 FALSE:同步
                success: resolve,
                error: reject
                /*success: data => {
                    //=>成功后执行的回调函数,DATA从服务器端获取的数据(对象)
                    resolve(data);
                },
                error: msg => {
                    //=>失败后执行的回调函数,MSG存储了失败的信息
                    reject(msg);
                }*/
            });
        });
    };

    //=>BIND-HTML:数据绑定
    let bindHTML = function bindHTML(data) {
        console.log(data);
    };

    return {
        init: function init() {
            let promise = queryData();
            console.log(1);
            promise.then(data => {
                //=>获取数据成功后处理的事情(DATA就是获取的数据)
                bindHTML(data);
                console.log(1);
            });
        }
    }
})();
bannerRender.init();
