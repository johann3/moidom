var pictureSource; // picture source
var destinationType; // sets the format of returned value
var imageAfterOCRHeight = 1000; // height of OCR image (if taken photo is more than imageAfterOCRHeight)
var scaleFixWidth; // scale factor for OCR squares x positioning and width
var scaleFixHeight; // scale factor for OCR squares y positioning and width
var result; // OCR result rectangles

/** 
 * Set picture source and type
 * 
 * Must be called when device is READY!
 */
function setPicSourceType() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;	
}


/**
 * Init elements on load,
 * hide cameraBtn if not Android
 */
function initOCR() {
	if (!navigator.userAgent.match(/Android/i)) 
		$('#cameraBtn').hide();
	else 
		initCanvas();

	$('#canvasContainer').hide();
}

function showCameraButton() {
	$('#cameraBtn').show();
}

/**
 * Init canvas - add event listener and set right height/width
 */
function initCanvas() {
	var canvas = $('#canvas')[0];
	canvas.height = window.innerHeight * 0.88;
	canvas.width = window.innerWidth * 1;
	canvas.addEventListener("click", detectClick, false);
}

/**
 * Call the camera view
 */
function capturePhoto() {
	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	if (!$('#canvasContainer').is(':visible'))
		switchVisibleContainer();
	
	// Take picture using device camera and retrieve image as file uri string
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		quality : 100,
		correctOrientation : true,
		destinationType : destinationType.FILE_URI
	});
}

/**
 * Called when a photo is successfully retrieved
 */
function onPhotoURISuccess(imageURI) {
	drawImage(imageURI);
//	callOCR(imageURI);
}

/** 
 * Called if something bad happens.
 * @param message
 */
function onFail(message) {
	switchVisibleContainer();
	alert('Picture was not taken! Reason: ' + message);
}

/**
 * Switch between canvas and input 
 */
function switchVisibleContainer() {
	if ($('.mainWrap').is(':visible')) {
		$('.mainWrap').hide();
		$('#canvasContainer').show();
	} else {
		$('.mainWrap').show();
		$('#canvasContainer').hide();
	}
}

/**
 * Draw image from camera, on image load we call OCR
 * @param imageSrc
 */
function drawImage(imageSrc) {
	var imageURI = imageSrc;
	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');
	var imageObj = new Image();
	
	imageObj.onload = function() {
			if (imageObj.height < imageAfterOCRHeight)
				imageAfterOCRHeight = imageObj.height;
			scaleFixWidth = canvas.width / (imageAfterOCRHeight / imageObj.height * imageObj.width) ;
			scaleFixHeight = canvas.height / imageAfterOCRHeight;
			var scaleWidth = canvas.width / imageObj.width;
			var scaleHeight = canvas.height / imageObj.height;
			var destinatedWidth = scaleWidth * imageObj.width;
			var destinatedHeight = scaleHeight * imageObj.height;
			context.drawImage(imageObj, 0, 0, destinatedWidth, destinatedHeight);
			
			callOCR(imageURI);
	};
	imageObj.src = imageURI;
}

/**
 * Perform OCR on taken photo
 * @param imageURI
 */
function callOCR(imageURI) {
	cordova.exec(function(result) {
		drawRectangles(result);
	}, function(err) {
		alert("Moidom cannot detect any number! ");
	}, "OCRPlugin", "OCR", [ imageURI, imageAfterOCRHeight ]);
}

/**
 * Draw rectangles from result and also scale it to right size
 * 
 * @param result
 */
function drawRectangles(result) {
	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');
	for ( var i = 0; i < result.length; i++) {
		result[i].x *= scaleFixWidth;
		result[i].y *= scaleFixHeight;
		result[i].width *= scaleFixWidth;
		result[i].height *= scaleFixHeight;
		context.strokeRect(result[i].x, result[i].y, result[i].width,
				result[i].height);
		context.fillStyle = "blue";
		context.font = "bold 16px Arial";
		context.fillText(result[i].value.toString(), result[i].x, result[i].y);
	}
	this.result = result;
}

/**
 * Get touch coordinates relative to canvas
 * and check if event is in rectangle
 * 
 * @param event
 */
function detectClick(event) {
	var canvas = $('#canvas')[0];
	var context = canvas.getContext('2d');
	var canvasX = canvas.offsetLeft;
	var canvasY = canvas.offsetTop;
	var touchX = event.pageX - canvasX;
	var touchY = event.pageY - canvasY;

	for ( var i = 0; i < result.length; i++) {
		var rectX = result[i].x;
		var rectY = result[i].y;
		var rectWidth = result[i].width;
		var rectHeight = result[i].height;
		var value = result[i].value;
		
		if (touchX >= rectX && touchX <= rectX + rectWidth && touchY >= rectY
				&& touchY <= rectY + rectHeight) {
			context.strokeStyle = '#ff0000';
			context.strokeRect(rectX, rectY, rectWidth, rectHeight);
			fillInput(value);
		}
	}
}

/**
 * Fill input
 * @param value
 */
function fillInput(value) {
	switchVisibleContainer();
	$('#submitValue').val(parseFloat(value).toFixed(2));
}
