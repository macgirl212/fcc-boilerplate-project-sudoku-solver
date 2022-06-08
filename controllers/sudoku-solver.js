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

	checkRowPlacement(puzzleString, row, column, value) {}

	checkColPlacement(puzzleString, row, column, value) {}

	checkRegionPlacement(puzzleString, row, column, value) {}

	solve(puzzleString) {}
}

module.exports = SudokuSolver;
