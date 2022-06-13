class SudokuSolver {
	makeSudokuObject(puzzleString) {
		// separate puzzleString into arrays for values and titles
		const rows = puzzleString.match(/.{9}/g);
		const rowTitles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

		// combine the arrays into one object
		const sudokuObject = {};
		rows.forEach((row, index) => {
			sudokuObject[rowTitles[index]] = row;
		});
		return sudokuObject;
	}

	findEmptySpace(sudokuObject) {
		// search each row
		for (const row in sudokuObject) {
			// search each block of row
			for (const block in sudokuObject[row]) {
				// return coordinate of first blank space found
				if (sudokuObject[row][block] === '.') {
					const column = block;
					return [row, column];
				}
			}
		}
	}

	divideGridIntoRegions(row, column) {
		let xBox;
		let yBox;

		// find row section
		switch (row) {
			case 'A':
			case 'B':
			case 'C':
				xBox = 0;
				break;
			case 'D':
			case 'E':
			case 'F':
				xBox = 1;
				break;
			case 'G':
			case 'H':
			case 'I':
				xBox = 2;
				break;
		}

		// find column section
		switch (column) {
			case '0':
			case '1':
			case '2':
				yBox = 0;
				break;
			case '3':
			case '4':
			case '5':
				yBox = 1;
				break;
			case '6':
			case '7':
			case '8':
				yBox = 2;
				break;
		}
		return [xBox, yBox];
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

	checkRowPlacement(puzzleString, row, column, value) {
		// loop through each block in chosen row
		for (const block in puzzleString[row]) {
			// check if value exists in each block, but do not compare against the block that will be filled
			if (puzzleString[row][block] === value && column !== row) {
				return false;
			}
		}
		return true;
	}

	checkColPlacement(puzzleString, row, column, value) {
		// loop through each block in chosen column
		for (const block in puzzleString) {
			// check if value exists in each block, but do not compare against the block that will be filled
			if (puzzleString[block][column] === value && row !== column) {
				return false;
			}
		}
		return true;
	}

	checkRegionPlacement(puzzleString, row, column, value) {
		const [xBox, yBox] = this.divideGridIntoRegions(row, column);
		// loop through only the row of selected section
		for (let i = xBox; i < xBox + 3; i++) {
			// loop through only the columns of selected section
			for (let j = yBox; j < yBox + 3; j++) {
				// check if value exists in other blocks in region, but do not compare against the block that will be filled
				if (
					puzzleString[Object.keys(puzzleString)[i]][j] === value &&
					Object.keys(puzzleString)[i] !== row &&
					j.toString() !== column
				) {
					return false;
				}
			}
		}
		return true;
	}

	solve(puzzleString) {
		const sudokuObject = this.makeSudokuObject(puzzleString);
		console.log(sudokuObject);
		// get coordinates of empty space
		const [row, column] = this.findEmptySpace(sudokuObject);
		/* current value is just for testing */
		const value = '5';
		const plausibleRow = this.checkRowPlacement(
			sudokuObject,
			row,
			column,
			value
		);
		const plausibleCol = this.checkColPlacement(
			sudokuObject,
			row,
			column,
			value
		);
		const plausibleReg = this.checkRegionPlacement(
			sudokuObject,
			row,
			column,
			value
		);
		console.log(plausibleRow, plausibleCol, plausibleReg);
	}
}

module.exports = SudokuSolver;
