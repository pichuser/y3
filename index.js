(function () {
    var video = document.querySelector('.camera__video'),
        canvas = document.querySelector('.camera__canvas');

    var getVideoStream = function (callback) {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
                function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.onloadedmetadata = function (e) {
                        video.play();

                        callback();
                    };
                },
                function (err) {
                    console.log("The following error occured: " + err.name);
                }
            );
        } else {
            console.log("getUserMedia not supported");
        }
    };

    var applyFilterToPixel = function (pixels) {
        var filters = {
            invert: function (pixels) {
		for(var i =0; i < pixels.length; i+= 4){
                pixels[i] = 255 - pixels[i];
                pixels[i+1] = 255 - pixels[i+1];
                pixels[i+2] = 255 - pixels[i+2];
		}	
            },
            grayscale: function (pixels) {
		for(var i = 0; i< pixels.length; i+=4){
                var r = pixels[i];
                var g = pixels[i+1];
                var b = pixels[i+2];
                var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

                pixels[i] = pixels[i+1] = pixels[i+2] = v;
		}
            },
            threshold: function (pixels) {
		for(var i = 0; i< pixels.length; i+=4){
		var r = pixels[i];
		var g = pixels[i + 1];
		var b = pixels[i + 2];
                var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0;
                pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
		}
            }
        };

        var filterName = document.querySelector('.controls__filter').value;
	filters[filterName](pixels);
    };

    var applyFilter = function () {
	var screen = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
var pixels = screen.data;
	applyFilterToPixel (pixels);        

         canvas.getContext('2d').putImageData(screen, 0, 0);
            
        
    };

    var captureFrame = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        canvas.getContext('2d').drawImage(video, 0, 0);
        applyFilter();
    };

    getVideoStream(function () {
        captureFrame();

        setInterval(captureFrame, 100);
    });
})();
