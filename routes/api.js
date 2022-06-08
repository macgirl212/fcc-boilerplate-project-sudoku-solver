'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route('/api/check').post((req, res) => {});

	app.route('/api/solve').post((req, res) => {
		const puzzle = req.body.puzzle;

		// error validator
		if (solver.validate(puzzle) instanceof Object) {
			return res.json(solver.validate(puzzle));
		}
		console.log('solved');
		return res.json({ msg: 'solved' });
	});
};
