describe('Parsing library', function () {
	var data = {
		headers: ['FirstName', 'LastName', 'Email', 'Phone'],
		records: [
			['Sam', 'Fisher', 'splinter@cell.com', '304-555-5555'],
			['Naruto', 'Uzumaki', 'nine@tails.net', '714-919-3425']
		],
		requestFull: function (delimiter) {
			var _csvData = this.requestHeaders(delimiter);
			_csvData += this.requestData(delimiter);
			return _csvData;
		},
		requestHeaders: function (delimiter) {
			return data.headers.join(delimiter) + '\r\n';
		},
		requestData: function (delimiter) {
			var _csvData = '';
			for (var i = data.records.length - 1; i >= 0; i--) {
				_csvData += data.records[i].join(delimiter) + '\r\n';
			}
			return _csvData;
		}
	};


	describe('Testing multiple delimiters', function () {
		var delimiterList = [',', ' ', '|', '.', '&', '^', ';'];


		function basicInfo (done) {
			expect(_csvData.filename).toEqual('test.csv');
			expect(_csvData.totalRecords).toEqual(data.records.length);
			done();
		}

		function parseHeaders (done) {
			//should parse back into our original headers
			expect(_csvData.headers).toEqual(data.headers);
			done();
		}

		function parseData (done) {
			var _records = data.records.slice().reverse(), tempObj = {};
			for (var i = _records.length - 1; i >= 0; i--) {
				tempObj[i + 1] = _records[i];
			}
			expect(_csvData.data).toEqual(tempObj);
			done();
		}

		for (var i = delimiterList.length - 1; i >= 0; i--) {
			var csvData = data.requestFull(delimiterList[i]);
			var _csvFile = new File([csvData], 'test.csv', { type: 'text/csv'});
			
			var _parser = new freeCSV({
				hasHeaders: false,
				delimiter: delimiterList[i]
			});
			/**
			 * Used to setup our csv parser before each test and done() triggers spec
			 * @param  {Function} done Triggers spec now that async is complete
			 */
			beforeEach(function(done){
				_parser.parseFile(_csvFile, function (err, data) {
					_csvData = data;
					console.log(data);
					done();
				});
			});

			it('should parse basic info for: ' + delimiterList[i], basicInfo);

			it('should parse headers for: ' + delimiterList[i], parseHeaders);

			it('should parse data for: ' + delimiterList[i], parseData);
		}


	});

				
		


});