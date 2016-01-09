# YandexImageGallery
Gallery look like Yandex or google image gallery

Using

HTML structure
<div>
  <div data-role="images-wrapper"></div>
</div>

div[data-role="images-wrapper"] must have parrent div

create global gallery object
var im_wr = GaleryYG.createImageCollection('[data-role="images-wrapper"]');

add some images to gallery
for(var i = 0; i < images.length; i++){
    var src = '/image/source/' + images[i];
    var image = GaleryYG.createImage(src);
    im_wr.addImage(image);
}

then call im_wr.performGradual();
create resize event listener, for exmpl
jQuery(window).resize(function(){
    im_wr.performGradual();
});

you may call im_wr.performGradual() or im_wr.perform()

you may set height of the images through function GaleryYG.setDefaultHeight(100) before adding images to gallery
default height is 200px
