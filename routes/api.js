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

		return res.json({ msg: 'checked' });
	});

	app.route('/api/solve').post((req, res) => {
		const puzzle = req.body.puzzle;

		const validate = solver.validate(puzzle);

		// error validator
		if (validate instanceof Object && validate.hasOwnProperty('error')) {
			return res.json(solver.validate(puzzle));
		}

		const solved = solver.solve(puzzle);
		res.json({ solution: solved });
	});
};
