var cordovaProxy = require("cordova/exec/proxy");

function initFaceDetector(success, error, args) {
    // { sizeFrameMemory: sizeFrameMemory, faceFinderPath: faceFinderPath }
    var self = this;
    var data = args[0];
    let imported = document.createElement('script');
    imported.src = 'pico.min.js';
    document.head.appendChild(imported);

    let faceFrameMemory = window.pico.instantiate_detection_memory(data.sizeFrameMemory);

    fetch(data.faceFinderPath).then(function (response) {
        response.arrayBuffer().then(function (buffer) {
            var bytes = new Int8Array(buffer);
            let faceFinderClassifyRegion = pico.unpack_cascade(bytes);

            success({faceFrameMemory: faceFrameMemory, faceFinderClassifyRegion: faceFinderClassifyRegion});
        })
    })
};

function detections(success, error, args) {
    // { rgbaX: rgbaX, height: height, width: width, params: params, faceFinderClassifyRegion: faceFinderClassifyRegion }
    var data = args[0];
    let image = {
        "pixels": _convertRgbaToGrayscale(data.rgba, data.height, data.width),
        "nrows": data.height,
        "ncols": data.width,
        "ldim": data.width
    }

    var dets = window.pico.run_cascade(image, data.faceFinderClassifyRegion, data.params);

    success(dets);
};

function cluster(success, error, args) {
    // { iouthreshold: iouthreshold, detections: self.dets }
    var data = args[0];
    let dets = window.pico.cluster_detections(data.detections, data.iouthreshold);
    success(dets);
};

function _convertRgbaToGrayscale(rgba, nrows, ncols) {
    var gray = new Uint8Array(nrows * ncols);
    for (var r = 0; r < nrows; ++r)
        for (var c = 0; c < ncols; ++c)
            // gray = 0.2*red + 0.7*green + 0.1*blue
            gray[r * ncols + c] =
                (2 * rgba[r * 4 * ncols + 4 * c + 0] +
                    7 * rgba[r * 4 * ncols + 4 * c + 1] +
                    1 * rgba[r * 4 * ncols + 4 * c + 2]) /
                10;
    return gray;
}

module.exports = {
    initFaceDetector: initFaceDetector,
    detections: detections,
    cluster: cluster
};

cordovaProxy.add("FaceDetector", module.exports);