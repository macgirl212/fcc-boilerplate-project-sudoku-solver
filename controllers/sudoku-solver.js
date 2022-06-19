class SudokuSolver {
	makeSudokuArray(puzzleString) {
		// separate puzzleString into a nested array for each row
		let sudokuArray = [];
		const rows = puzzleString.match(/.{9}/g);
		rows.forEach((row) => {
			sudokuArray.push(row.split(''));
		});
		return sudokuArray;
	}

	divideintoRegions(unit) {
		// divide into groups of 3
		switch (unit) {
			case 0:
			case 1:
			case 2:
				return 0;
			case 3:
			case 4:
			case 5:
				return 1;
			case 6:
			case 7:
			case 8:
				return 2;
		}
	}

	checkIfValid(sudokuArray, row, column, value) {
		const plausibleRow = this.checkRowPlacement(sudokuArray, row, value);
		const plausibleCol = this.checkColPlacement(sudokuArray, column, value);
		const plausibleReg = this.checkRegionPlacement(
			sudokuArray,
			row,
			column,
			value
		);
		return plausibleRow && plausibleCol && plausibleReg ? true : false;
	}

	validate(puzzleString) {
		// blank puzzle
		if (!puzzleString) {
			return { error: 'Required field missing' };
		}
		// if puzzle is not the correct length
		if (puzzleString.length !== 81) {
			return { error: 'Expected puzzle to be 81 characters long' };
		}
		// check if puzzle has invalid characters
		for (let i = 0; i < puzzleString.length; i++) {
			if (puzzleString[i] !== '.' && !puzzleString[i].match(/\d/)) {
				return { error: 'Invalid characters in puzzle' };
			}
		}
	}

	checkRowPlacement(sudokuArray, row, value) {
		// loop through each cell in chosen row
		for (const cell in sudokuArray[row]) {
			// check if value exists in each cell
			if (sudokuArray[row][cell] == value) {
				return false;
			}
		}
		return true;
	}

	checkColPlacement(sudokuArray, column, value) {
		// loop through each cell in chosen column
		for (const cell in sudokuArray) {
			// check if value exists in each cell
			if (sudokuArray[cell][column] == value) {
				return false;
			}
		}
		return true;
	}

	checkRegionPlacement(sudokuArray, row, column, value) {
		const xBox = this.divideintoRegions(row);
		const yBox = this.divideintoRegions(column);

		// loop through only the row of selected section
		for (let i = xBox * 3; i < xBox * 3 + 3; i++) {
			// loop through only the columns of selected section
			for (let j = yBox * 3; j < yBox * 3 + 3; j++) {
				// check if value exists in other cells in region
				if (sudokuArray[i][j] == value) {
					return false;
				}
			}
		}
		return true;
	}

	solveCell(puzzleString, sudokuArray, row, column) {
		// if no row or column is entered, start at 0 index for both
		if (!row) {
			row = 0;
		}
		if (!column) {
			column = 0;
		}

		// if the end of the column is reached, move to the next nested array and reset at index 0
		if (column === 9) {
			column = 0;
			row++;
		}

		// if the end of the nested array is reached, return puzzleString
		if (row === 9) {
			return puzzleString;
		}

		if (sudokuArray[row][column] !== '.') {
			return this.solveCell(puzzleString, sudokuArray, row, column + 1);
		}

		console.log(`Checking row ${row}, column ${column}...`);

		// loop through values for selected empty space
		for (let value = 1; value < 10; value++) {
			const checkedValue = this.checkIfValid(sudokuArray, row, column, value);
			if (checkedValue) {
				// if a correct value is found, update puzzleString
				let filledIndex = column + row * 9;
				puzzleString =
					puzzleString.substring(0, filledIndex) +
					value +
					puzzleString.substring(filledIndex + 1);
				console.log('new filled space', puzzleString);

				if (
					this.solveCell(puzzleString, sudokuArray, row, column + 1) != false &&
					!puzzleString.includes('.')
				) {
					console.log('it is solved', puzzleString);
					return puzzleString;
				}
			} else {
				// change the selected cell back to a period
				let filledIndex = column + row * 9;
				puzzleString =
					puzzleString.substring(0, filledIndex) +
					'.' +
					puzzleString.substring(filledIndex + 1);
			}
		}
		console.log('dead end', puzzleString);
		return false;
	}

	solve(puzzleString) {
		let sudokuArray = this.makeSudokuArray(puzzleString);
		this.solveCell(puzzleString, sudokuArray);
	}
}

module.exports = SudokuSolver;
