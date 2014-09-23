/**
 * freeCSV (c) Aaron Freeland - afreeland - 2014
 *
 * freeCSV provides a fast and efficient way to parse CSV files client side before uploading to server
 */

(function(window){

	var regex = {
		newLine: /[^+\r\n]+/g // Match EOL (End Of Line) characters... new lines or returns
	};

	// Default Options for CSV
	var _options = {
		delimiter: ',', // The delimiter that is used to separate our values
		files: [], // Stores the original files as they were passed in or uploaded
		supportedExtensions: ['csv']
	};

	var util = {

		checkFileExtension: function (filename, supportedExtensions) {
			var len = supportedExtensions.length,
				_exp = '^.*\\.(';

			for (var i = 0; i < len; i++) {
				_exp += (i === len - 1) ? supportedExtensions[i] : supportedExtensions[i] + '|';
			}
			_exp += ')$';
			var extensionExpression = new RegExp(_exp, 'gi');
			
			return extensionExpression.test(filename);
		},

		isFunction: function (fn) {
			return (typeof fn == 'function');
		}
	};


	function CSV (options) {
		options = options || {};
		this.hasHeaders = options.hasHeaders || true;
		this.delimiter = options.delimiter || _options.delimiter;
		this.supportedExtensions = options.supportedExtensions || _options.supportedExtensions;
		this.parsedFiles = [];
		this.enablePerf = options.enablePerf || false;

		if(this.enablePerf){
			console.time('time to execute');
		}
	}

	CSV.prototype = {

		onLoadEnd: function (currentFile, readerFN, callback) {
			var self = this;
			return function(evt){
					if(util.isFunction(readerFN))
						readerFN.call(self, currentFile, evt, callback);
				};
		},

		getRecords: function  (file, evt, callback) {
			var self = this;
			var _file = {
				filename: file.name,
				size: file.size,
				type: file.type,
				totalRecords: 0,
				headers: [],
				data: {},
				lastModifiedDate: file.lastModifiedDate
			};

			// Get the ArrayBuffer
			var data = evt.target.result;

			// Grab our byte length
			var byteLength = data.byteLength;

			// Convert to conventional array, so we can iterate through it
			var ui8a = new Uint8Array(data, 0);

			var row = 0; // Start counting number of rows/records
			var record = ''; // We will store our characters in here and then split on the delimiter to get our values

			// Iterate through each character in our Array
			for (var i = 0; i < byteLength; i++) {
				// Continue if we come across a line feed character, otherwise it will fail regex
				// and push empty record into our data array
				if(ui8a[i] === 10)
					continue;

				// Get character from our current iteration
				var char = String.fromCharCode(ui8a[i]);

				// Test if we have hit a new line character or char code 10 (line feed)
				if(char.match(regex.newLine) !== null){

					// Not a new line so lets append it to our record string
					record += char;
				}else{

					// See if we have a header row and on our first record
					if(row === 0 && self.hasHeaders){
						_file.headers = record.split(self.delimiter);
					}else{
						_file.data[row] = record.split(self.delimiter);
					}
					row++; // increment our row count
					record = '';
					continue;
				}
			}

			_file.totalRecords = (self.hasHeaders) ? row - 1 : row;
			if(self.enablePerf){
				console.timeEnd('time to execute');
			}

			callback.call(this, null, _file);
		},

		readFile: function (file, callback) {
			var self = this;
			var reader = new FileReader();

			// Ensure that we are dealing with a valid file type
			util.checkFileExtension(file.name, self.supportedExtensions);

			// Closure handler function that is triggered each time the reading operation is completed (success or failure)
			reader.onloadend = (self.onLoadEnd)(file, self.getRecords, callback);

			// Read our file as an ArrayBuffer
			reader.readAsArrayBuffer(file);
		},

		parseFile: function (file, callback) {
			var self = this;
			if(!file)
				callback(new Error("Failed to provide file for parsing."));

			this.readFile(file, callback);

		},

		parseFiles: function (files, callback) {
			for (var i = files.length - 1; i >= 0; i--) {
				this.parseFile(files[i], callback);
			}
		},

		parseString: function (data, callback) {
			if(!data || typeof data != 'string')
				callback(new Error('No string provided'));

			var _file;
			try{
				_file = new File([data], 'free.csv', { type: 'text/csv'});
			}catch(e){
				callback(new Error('Failed to create temp file with csv data'));
			}
			this.parseFile(_file, callback);
		},

		getHeaders: function () {
		},

		getRecord: function () {
		}
	};

	window.freeCSV = CSV;

})(window);
