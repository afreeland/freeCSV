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

	var handlers = {
		reader: {
			onloadend: function (currentFile, callback) {
				return function(evt){
					if(util.isFunction(callback))
						callback.call(this, currentFile, evt);
				};
			}
		}
	};

	function CSV (options) {
		options = options || {};
		this.files = options.fileList || [];
		this.hasHeaders = options.hasHeaders || true;
		this.delimiter = options.delimiter || _options.delimiter;
		this.supportedExtensions = options.supportedExtensions || _options.supportedExtensions;
		this.parsedFiles = [];
	}

	CSV.prototype = {

		files: function () {
			return this.files;
		},

		parse: function (callback) {
			var self = this, filesLength = this.files.length;

			if(!filesLength || filesLength === 0)
				throw new Error("No files are present.");
			
			this.readFiles(function (currentFile, evt) {
				var _file = {
					filename: currentFile.name,
					size: currentFile.size,
					type: currentFile.type,
					totalRecords: 0,
					headers: [],
					data: [],
					lastModifiedDate: currentFile.lastModifiedDate
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
							_file.data.push(record.split(self.delimiter));
						}

						row++; // increment our row count
						record = '';
						continue;
					}


				}

				_file.totalRecords = (self.hasHeaders) ? row - 1 : row;
				debugger;
			});
		},

		readFiles: function (callback) {
			var self = this, filesLength = this.files.length;

			// Iterate through each of the files
			for (var i = 0; i < filesLength; i++) {
				
				var reader = new FileReader(),
					file = self.files[i];

				// Ensure that we are dealing with a valid file type
				util.checkFileExtension(file.name, self.supportedExtensions);

				// Closure handler function that is triggered each time the reading operation is completed (success or failure)
				reader.onloadend = (handlers.reader.onloadend)(file, callback);

				// Read our file as an ArrayBuffer
				reader.readAsArrayBuffer(file);
			}
		},

		getHeaders: function () {
			



		},

		getRecord: function () {
			
		}
	};

	window.freeCSV = CSV;

})(window);
