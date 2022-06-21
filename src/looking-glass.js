(function (root, factory) {
    if(typeof define === 'function' && define.amd){
        define([], factory);
    }else if(typeof module === 'object' && module.exports){
        module.exports = factory();
    }else{
        root.LookingGlass = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    let ks = (cb)=>{
        let callback = cb;
        if(!callback){
            let resolve = null;
            let reject = null;
            callback = (err, result)=>{
                if(err) return (reject && reject(err));
                if(result) return (resolve && resolve(result));
            };
            callback.return = (new Promise((rslv, rjct)=>{
                resolve = rslv;
                reject = rjct;
            }));
        }
        return callback;
    }

    const LookingGlass = function(source, operations, options){
        this.options = options || {};
        this.source = source;
        this.operations = operations;
    }

    LookingGlass.prototype.create = function(document, cb){
        let callback = ks(cb);
        if(this.source) this.source.create(document, callback);
        this.els = {};
        this.els.hiddenContainer = document.createElement('div');
        this.els.hiddenContainer.style.display = 'none';
        this.els.srcElements = this.source.stages;

        if(this.els.srcElements){
            this.els.srcElements.forEach((el)=>{
                this.els.hiddenContainer.appendChild(el);
            });
        }

        this.els.frame = document.createElement('div');
        //this.els.frame.style.position = 'absolute';
        //this.els.frame.style.top = 0;
        //this.els.frame.style.bottom = 0;
        //this.els.frame.style.right = 0;
        //this.els.frame.style.left = '50%';
        //this.els.frame.style.transform = 'translate(-50%)';
        this.els.frame.style.width = '100vw';
        this.els.frame.style.height = '100vh';
        if(this.source) this.els.srcInputs = this.source.controls;
        this.els.vizCanvas = document.createElement('canvas');
        this.els.vizCanvas.style.position = 'absolute';
        this.els.vizCanvas.style.left = '50%';
        this.els.vizCanvas.style.transform = 'translate(-50%)';
        this.els.vizCanvas.setAttribute('width', 640);
        this.els.vizCanvas.setAttribute('height', 480);
        //this.els.vizCanvas.style.width = '100%';
        this.els.vizCanvas.style.height = '100vh';

        if(this.els.srcInputs){
            this.els.srcInputs.forEach((el)=>{
                this.els.frame.appendChild(el);
            });
        }
        this.els.frame.appendChild(this.els.vizCanvas);

        document.body.appendChild(this.els.hiddenContainer);
        document.body.appendChild(this.els.frame);

        return callback.return;
    }

    LookingGlass.prototype.pause = function(){
        let callback = ks(cb);

        return callback.return;
    }

    LookingGlass.prototype.play = function(cb){
        let callback = ks(cb);
        if(this.source && this.source.start) this.source.start();
        setTimeout(()=> callback());
        return callback.return;
    }

    return LookingGlass;
}));
