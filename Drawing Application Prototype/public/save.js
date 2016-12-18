var saveButton = document.getElementById('save');

saveButton.addEventListener('click', saveImage);

function saveImage() {
	var data = canvas.toDataURL();

	var request = new XMLHttpRequest();

	request.onreadstatechange = function() {
		if (request.readState == 4 && request.status == 200) {
			var response = request.responseText;
			window.open(response, '_blank', 'location=0, menubar=0');
		}
	}

	request.open('POST', 'save.php', true);
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	request.send('img=' + data);

	// window.open(data, '_blank', 'location=0, menubar=0');
}