(function (root, factory) {
    if(typeof define === 'function' && define.amd){
        define([], factory);
    }else if(typeof module === 'object' && module.exports){
        module.exports = factory();
    }else{
        root.LGFrameWriter = factory();
    }
}(typeof self !== 'undefined' ? self : this, function(b){
    let extendify = function(ext, supr, cls){
        var copy = supr || function(){};
        Object.keys(cls.prototype).forEach(function(key){
            copy.prototype[key] = cls.prototype[key];
        });
        Object.keys(ext).forEach(function(key){
            copy.prototype[key] = ext[key];
        });
        copy.extend = function(ext, supr){
            return extendify(ext, supr, copy);
        };
        return copy;
    }

    let LookingGlassFrameWriter = function(){

    };
    LookingGlassFrameWriter.prototype.run = function(source, destination, width, height){
        let dest = destination.getContext("2d");
        let runLoop = ()=>{
            let frame = source.getImageData(0, 0, width, height);
            frame = this.processFrame(frame);
            dest.putImageData(frame, 0, 0);
            setTimeout(()=>{
                runLoop();
            }, 0);
        };
        runLoop();
    };
    LookingGlassFrameWriter.prototype.processFrame = function(frame){
        return frame;
    };
    LookingGlassFrameWriter.extend = function(cls, cns){
        var cons = cns || function(){
            LookingGlassFrameWriter.apply(this, arguments);
            return this;
        };
        return extendify(cls, cons, LookingGlassFrameWriter);
    };
    return LookingGlassFrameWriter;
}));
