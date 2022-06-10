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

	checkRegionPlacement(puzzleString, row, column, value) {}

	solve(puzzleString) {
		const sudokuObject = this.makeSudokuObject(puzzleString);
		console.log(sudokuObject);
		// get coordinates of empty space
		const [row, column] = this.findEmptySpace(sudokuObject);
		/* current value is just for testing */
		const plausibleRow = this.checkRowPlacement(sudokuObject, row, column, '5');
		const plausibleCol = this.checkColPlacement(sudokuObject, row, column, '5');
		console.log(plausibleRow, plausibleCol);
	}
}

module.exports = SudokuSolver;
