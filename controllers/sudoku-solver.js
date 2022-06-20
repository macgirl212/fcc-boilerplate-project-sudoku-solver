class SudokuSolver {
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

	solveCell(grid, row, column) {
		// if the end of the grid is reached, return grid
		if (row === 9 - 1 && column === 9) {
			return grid;
		}

		// if the end of the row is reached, move to the next row
		if (column === 9) {
			row++;
			column = 0;
		}

		// if number is already filled, skip to the next
		if (grid[row][column] !== 0) {
			return this.solveCell(grid, row, column + 1);
		}

		// loop through values for selected empty space
		for (let value = 1; value < 10; value++) {
			// if a correct value is found, update grid
			if (this.isSafe(grid, row, column, value)) {
				grid[row][column] = value;

				if (this.solveCell(grid, row, column + 1)) {
					return grid;
				}
			}
			// change the selected cell back to a period
			grid[row][column] = 0;
		}
		return false;
	}

	isSafeManual(puzzleString, selectedRow, selectedColumn, value) {
		let grid = this.transform(puzzleString);

		const rowArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
		selectedRow = selectedRow.toUpperCase();
		const row = rowArray.indexOf(selectedRow);
		const column = Number(selectedColumn) - 1;

		if (grid[row][column] !== 0) {
			if (grid[row][column] === value) {
				return true;
			}
			return false;
		}

		let errorArray = [];
		// loop through each cell in chosen row
		for (let x = 0; x <= 8; x++) {
			// check if value exists in each cell
			if (grid[row][x] == value) {
				errorArray.push('row');
			}
		}

		// loop through each cell in chosen row
		for (let x = 0; x <= 8; x++) {
			// check if value exists in each cell
			if (grid[x][column] == value) {
				errorArray.push('column');
			}
		}

		// divide into groups of 3
		let startRow = row - (row % 3);
		let startCol = column - (column % 3);

		// loop through only the row of selected section
		for (let i = 0; i < 3; i++) {
			// loop through only the columns of selected section
			for (let j = 0; j < 3; j++) {
				// check if value exists in other cells in region
				if (grid[i + startRow][j + startCol] == value) {
					errorArray.push('region');
				}
			}
		}
		return errorArray;
	}

	isSafe(grid, row, column, value) {
		// loop through each cell in chosen row
		for (let x = 0; x <= 8; x++) {
			// check if value exists in each cell
			if (grid[row][x] == value) {
				return false;
			}
		}

		// loop through each cell in chosen row
		for (let x = 0; x <= 8; x++) {
			// check if value exists in each cell
			if (grid[x][column] == value) {
				return false;
			}
		}

		// divide into groups of 3
		let startRow = row - (row % 3);
		let startCol = column - (column % 3);

		// loop through only the row of selected section
		for (let i = 0; i < 3; i++) {
			// loop through only the columns of selected section
			for (let j = 0; j < 3; j++) {
				// check if value exists in other cells in region
				if (grid[i + startRow][j + startCol] == value) {
					return false;
				}
			}
		}
		return true;
	}

	transform(puzzleString) {
		// setup grid
		let grid = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
		let row = -1;
		let column = 0;

		// separate puzzleString into a nested array grid
		for (let i = 0; i < puzzleString.length; i++) {
			if (i % 9 == 0) {
				row++;
			}
			if (column % 9 == 0) {
				column = 0;
			}

			grid[row][column] = puzzleString[i] === '.' ? 0 : puzzleString[i];
			column++;
		}
		return grid;
	}

	transformBack(grid) {
		// turn grid back into a string
		return grid.flat().join('');
	}

	solve(puzzleString) {
		let grid = this.transform(puzzleString);
		let solved = this.solveCell(grid, 0, 0);

		// if unsolvable, return false
		if (!solved) {
			return false;
		}

		let solvedString = this.transformBack(solved);
		return solvedString;
	}
}

module.exports = SudokuSolver;
