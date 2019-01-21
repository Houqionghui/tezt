/**
 * Created by q977821807 on 2018/5/28.
 */
$(function () {
   let $hide = $('.toolbar .text'),
   $li = $('.toobar li');
   $hide.on('mouseover', function () {
       $hide.css('dispaly', 'block');
       $li.animate('width',97);
   })
});