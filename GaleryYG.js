GaleryYG = {};
(function(GaleryYG){
    var defaul_height = 200;
    GaleryYG.setDefaultHeight = function(height){
        defaul_height = height;
    }
    GaleryYG.createImage = function(src){
        return new Im(src);
    }

    GaleryYG.createImageCollection = function(wrapper_selector){
        return new ImWrapper(wrapper_selector);
    }

    function Im(src){
        this.image = document.createElement('img');
        this.image.src = src;
        var that = this;
        this.width = 0;
        this.loaded = 0;
        this.error_load = 0;
        this.image.onload = function(){
            var ratio = that.image.height / defaul_height;
            that.image.height = defaul_height;
            that.image.width = that.image.width/ratio;
            that.width = that.image.width;
            that.loaded = 1;
        }
        this.wrapper = $('<div style="margin: 0 0 8px 8px;display: inline-block;vertical-align: bottom;overflow: hidden;"></div>')[0];
        this.wrapper_width = 0;
    }
    Im.prototype.getTemplate = function(){
        var el = $(this.wrapper);
        $(el).append(this.image);
        return $(el)[0].outerHTML;
    }

    Im.prototype.isLoad = function(){
        return this.loaded;
    }

    Im.prototype.isError = function(){
        return this.error_load;
    }

    Im.prototype.getWidth = function(){
        return this.width;
    }

    Im.prototype.getPower = function(width){
        return Math.round(this.width * 100 / width);
    }

    Im.prototype.setWraperWidth = function(w){
        var wr_div = Math.round(w/2);
        this.image.style.marginLeft = -wr_div+'px';
        this.wrapper.style.width = (this.width - w) + 'px';
        this.wrapper_width = this.width - w;
    }
    Im.prototype.getWraperWidth = function(){
        return this.wrapper_width;
    }

    function ImWrapper(wrapper_selector){
        this.images = [];
        this.count = 0;
        this.margin = 8;
        this.wrap_selector = wrapper_selector;
    }
    ImWrapper.prototype.addImage = function(im){
        this.images.push(im);
        this.count++;
    };

    ImWrapper.prototype.performGradual = function(){
    var wrapper = $(this.wrap_selector)[0];
        var width = wrapper.parentNode.clientWidth;
        wrapper.style.width = width + 'px';
        
        var images_arr = [];

        var timeout = null;
        for(var i = 0; i < this.images.length; i++){
            if(!this.images[i].isLoad()){
                var cur_func = arguments.callee;
                var that = this;
                if(timeout){
                    clearTimeout(timeout);
                }
                timeout = setTimeout(function(){
                    cur_func.call(that);
                }, 200);
                // return;
            }else{
                images_arr.push(this.images[i]);
            }
        }

        if(!images_arr.length){
            return;
        }
        
        this.perfomAction(images_arr, width, wrapper);

    }


    ImWrapper.prototype.perform = function(){
        var wrapper = $(this.wrap_selector)[0];
        var width = wrapper.parentNode.clientWidth;
        wrapper.style.width = width + 'px';
        
        for(var i = 0; i < this.images.length; i++){
            if(!this.images[i].isLoad()){
                var cur_func = arguments.callee;
                var that = this;setTimeout(function(){
                    cur_func.call(that);
                }, 200);
                return;
            }
        }

        this.perfomAction(this.images, width, wrapper);
    }

    ImWrapper.prototype.perfomAction = function(images_arr, width, wrapper){
        var summ_width = 0;
        var k = 1;
        var from = 0;
        var raid = 0;
        for(var i = 0; i < images_arr.length; i++){
            summ_width += images_arr[i].getWidth();
            k++;//количество элементов в одной строке
            if(summ_width >= width){
                raid++;
                var diff = summ_width - width;
                var diff_local_sum = 0;
                var wrap_summ_width = 0;
                for(var j = from; j <= i; j++){
                    //вес элемента в распределении ширины
                    var weight = images_arr[j].getPower(summ_width);
                    //на сколько надо уменьгшить див
                    var raznica = Math.round(diff * weight / 100) ;
                    diff_local_sum += raznica;
                    var pogr = 0;
                    //если нашли последний элемент в текущем ряду, немного компенсируем погрешности
                    if(i == j){
                        pogr =  diff - diff_local_sum;
                    }
                    raznica += this.margin;
                    raznica += pogr;
                    
                    images_arr[j].setWraperWidth(raznica);
                    wrap_summ_width += images_arr[j].getWraperWidth();
                }
                summ_width = 0;
                from = i + 1;
            }
        }
        
        wrapper.innerHTML = '';
        for(var i = 0; i < images_arr.length; i++){
            $('[data-role="images-wrapper"]').append(images_arr[i].getTemplate());
        }
    }
})(GaleryYG);
