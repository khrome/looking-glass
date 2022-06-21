(function (root, factory) {
    if(typeof define === 'function' && define.amd){
        define([], factory);
    }else if(typeof module === 'object' && module.exports){
        module.exports = factory();
    }else{
        root.LGCameraSource = factory();
    }
}(typeof self !== 'undefined' ? self : this, function(){

    const startStream = async (constraints, el)=>{
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        el.srcObject = stream;
    };

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

    const LookingGlassCameraSource = function(source, operations, options){
        this.options = options || {};
        this.source = source;
        this.operations = operations;
        this.controls = [];
    }

    LookingGlassCameraSource.prototype.start = function(){
        if(this.video) startStream({video: true}, this.video);
        let runLoop = ()=>{
            if(this.ctx1 && this.ctx1.drawImage){
                this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
            }
            setTimeout(()=>{
                runLoop();
            }, 0);
        };
        runLoop();
    }

    LookingGlassCameraSource.prototype.create = function(document, cb){
        let callback = ks(cb);
        this.controls = [];
        this.cameraSelect = document.createElement('select');
        this.cameraSelect.style.position = 'absolute';
        this.cameraSelect.style.top = '0.5em';
        this.cameraSelect.style.left = '0.5em';
        this.cameraSelect.style.zIndex = 1;
        this.controls.push(this.cameraSelect);
        this.stages = [];
        this.video = document.createElement('video');
        this.video.setAttribute('autoplay', true);
        this.video.setAttribute('controls', 'true');
        this.video.setAttribute('playsinline', true); // safari fix
        this.video.style.width = '640px';
        this.video.style.height = '480px';
        this.stages.push(this.video);
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', 640);
        this.canvas.setAttribute('height', 480);
        this.canvas.style.width = '640px';
        this.canvas.style.height = '480px';
        this.stages.push(this.canvas);
        navigator.mediaDevices.getUserMedia({video: true}).then((ds)=>{
            navigator.mediaDevices.enumerateDevices().then((ds)=>{
                let devices = ds.filter((d)=> d.kind === 'videoinput');
                this.cameraSelect.innerHTML = '';
                devices.forEach((device)=>{
                    var option = document.createElement("option");
                    option.text = device.label;
                    option.value = device.deviceId;
                    this.cameraSelect.add(option);
                });
                this.cameraSelect.addEventListener('change', ()=>{
                    let selected = Array.prototype.filter.call(
                        this.cameraSelect.children,
                        (child)=> child.selected
                    );
                    if(selected[0].value){
                      this.setCamera(selected[0].value);
                      console.log('Camera set to'+ selected[0].value)
                    }
                });
                if(devices[0]) this.setCamera(devices[0].deviceId);
                this.video.addEventListener('loadeddata', (e) => {
                    callback();
                });
            }).catch((ex)=>{

            });
        }).catch((ex)=>{

        });
        return callback.return;
    }

    LookingGlassCameraSource.prototype.setCamera = function(id, cb){
        let callback = ks(cb);
        let constraints = {video : {deviceId: id} };
        navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
            this.video.addEventListener('loadeddata', (e) => {
               if(this.video.readyState >= 3){
                  this.video.play(); // safari fix
                  this.width = this.video.videoWidth;
                  this.height = this.video.videoHeight;
                  this.ctx1 = this.canvas.getContext("2d");
                  //this.ctx2 = this.c2.getContext("2d");
                  callback();
               }
            });
            this.video.srcObject = stream;
            this.video.play(); // safari fix
        }).catch((err)=>{ console.log(err); callback(err) });
        return callback.return;
    }

    return LookingGlassCameraSource;
}));
