freeCSV
=======

Fast client side CSV parsing tool for reading files


##What does it do?
freeCSV allows a user to upload a CSV file and parse it client side.  This means a user can view/iterate through a CSV file before ever uploading it to a server.

*Currently only supports header if it is on first row*


##What was it created for?
freeCSV was created so that a user can see their CSV data and map it appropriately.  All of this happening in real-time with their file data and no server req/res needed.


##How to use freeCSV

### Parse via File/Filelist
You may pass a file object into freeCSV and it will parse contents based on the settings you have given it.


**HTML**
```
<form>
	<input type="file" id="CSVFileInput" />
</form>
```

**JavaScript**
```
var input = document.getElementById('CSVFileInput');
input.addEventListener('change', function () {
	var _fileList = input.files;
});

var csv = new freeCSV({
	delimiter: ',', // type of delimiter being used for this file
	hasHeaders: false // true by default
});

csv.parseFiles(_fileList, function(err, result){
	if(err) throw new Error(err);

	console.log(result);
});

// Alternatively for single file
csv.parseFile(_fileList[0], function(){
	if(err) throw new Error(err);

	console.log(result);
});
```

### Parse via String
You may also pass in your CSV data as a string and freeCSV will turn this into a file in the backend and return you your results.

**JavaScript**
```
var csvData =
'FirstName,LastName,Email\r\n' +
'Sam,Fisher,splinter@cell.com\r\n' +
'Naruto,Uzumaki,nine@tails.net\r\n';

csv.parseString(csvData, function(err, result){
	if(err) throw new Error(err);

	console.log(result);
});

```



