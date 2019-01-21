$(function () {
    let dropdown = document.getElementById('dropdown'),
        sideBar = document.getElementById('toolbar'),
        goTop = document.getElementById('goTop');

    Fn = function () {
        let winH = document.documentElement.clientHeight,
            scrollT = document.documentElement.scrollTop;

        if (scrollT >= 800) {
            dropdown.style.display = 'block';
            dropdown.style.zIndex = 1000;
        }
        else {
            dropdown.style.display = 'none';
        }

        if (scrollT >= 1500) {
            sideBar.style.display = 'block';
            goTop.style.display = 'block';
        }else {
            sideBar.style.display = 'none';
            goTop.style.display = 'none';
        }

    };
    window.addEventListener('scroll', Fn);
});

