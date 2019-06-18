cordova.define("cordova-plugin-facedetection.FaceDetection", function (require, exports, module) {
    var exec = require('cordova/exec');

    var exec = require('cordova/exec');

    var faceFrameMemory;
    var faceFinderClassifyRegion;
    var initialized = false;

    function test1(rgba, width, height, result) {
        exec(result, result, "FaceDetection", "test1", [{ rgba: rgba, width: width, height: height }]);
    }

    function initFaceDetection(sizeFrameMemory, faceFinderPath, result) {
        exec(result, result, "FaceDetection", "initFaceDetection", [{ sizeFrameMemory: sizeFrameMemory, faceFinderPath: faceFinderPath }]);
    };

    function detections(rgba, width, height, minSizeFace, maxSizeFace, iouthreshold, result) {
        exec(result, result, "FaceDetection", "detections", [{ rgba: rgba, width: width, height: height, minSizeFace: minSizeFace, maxSizeFace: maxSizeFace, iouthreshold: iouthreshold }]);
    }

    module.exports = {
        initFaceDetection: initFaceDetection,
        detections: detections,
        test1: test1
    };
});