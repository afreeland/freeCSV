freeCSV
=======

Fast client side CSV parsing tool for reading files


##What does it do?
freeCSV allows a user to upload a CSV file and parse it client side.  This means a user can view/iterate through a CSV file before ever uploading it to a server.

*Currently only supports header if it is on first row*


##What was it created for?
freeCSV was created so that a user can see their CSV data and map it appropriately.  All of this happening in real-time with their file data and no server req/res needed.




##What does the parsed result look like

| Property | Type | Purpose |
| -------- | ---- | ------- |
| **data** | *object* | Stores each record minus headers as an array, with its row number being the key |
| **filename** | *string* | Identifies the name of the file given to the parser |
| **headers** | *array* | Stores the headers separately when applicable |
| **size** | *number* | Size of the file in bytes |
| **totalRecords** | *number* | How many records (rows) are in the csv file |
| **type** | *string* | The mime type for the file |




## Options

| Property | Type | Required | Purpose |
| -------- | ---- | -------- | -------- |
| **hasHeaders** | *bool* | Optional - true by default | Lets parser know to expect a header row |
| **delimiter** | *string* | Optional - ',' by default | What character(s) your csv uses as a delimiter |
| **enablePerf** | *bool* | Optional | Performance timer that logs execution time |


## Methods

### Parse File
| Parameters | Type | Purpose |
| --------- | ---- | ------- |
| **file** | *File* | Actual file used to parse |
| **callback** | *func* | Hands parsed result back |

## Callbacks
You can expect all methods to return this common callback mentality
--

| Arguments | Type | Purpose |
| --------- | ---- | ------- |
| **error** | *Error* | An error that has been thrown during parsing execution |
| **result** | *obj* | The parsed result object |


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



