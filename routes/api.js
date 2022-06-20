'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route('/api/check').post((req, res) => {
		const { puzzle, coordinate, value } = req.body;

		// check if all fields are filled in
		if (!puzzle || !coordinate || !value) {
			return res.json({ error: 'Required field(s) missing' });
		}

		// puzzle validator
		const validate = solver.validate(puzzle);
		if (validate instanceof Object && validate.hasOwnProperty('error')) {
			return res.json(solver.validate(puzzle));
		}

		// coordinate validator
		if (!coordinate.match(/^[a-iA-I][1-9]$/)) {
			return res.json({ error: 'Invalid coordinate' });
		}

		// value validator
		if (!value.match(/^[1-9]$/)) {
			return res.json({ error: 'Invalid value' });
		}

		const [row, column] = coordinate.split('');

		const checked = solver.isSafeManual(puzzle, row, column, value);

		// if checked includes error message array, return errors
		if (checked instanceof Array && checked.length !== 0) {
			return res.json({ valid: false, conflict: checked });
		}

		// if checked checks a previously filled cell, return validity
		if (typeof checked === 'boolean') {
			return res.json({ valid: checked });
		}
		res.json({ valid: true });
	});

	app.route('/api/solve').post((req, res) => {
		const puzzle = req.body.puzzle;

		const validate = solver.validate(puzzle);

		// error validator
		if (validate instanceof Object && validate.hasOwnProperty('error')) {
			return res.json(solver.validate(puzzle));
		}

		const solved = solver.solve(puzzle);

		if (!solved) {
			return res.json({ error: 'Puzzle cannot be solved' });
		}
		res.json({ solution: solved });
	});
};
