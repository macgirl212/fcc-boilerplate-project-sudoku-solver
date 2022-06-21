const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
	const puzzle =
		'.6.3.9..5.74.251..5..1.6.49..7..1.6.34....79....................1.....2....63..5.';
	test('POST /api/solve with valid string', (done) => {
		chai
			.request(server)
			.post('/api/solve')
			.send({ puzzle: puzzle })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(
					res.body.solution,
					'162349875974825136583176249857491362341562798296783514635214987418957623729638451'
				);
				done();
			});
	});
	test('POST /api/solve with no string', (done) => {
		chai
			.request(server)
			.post('/api/solve')
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.error, 'Required field missing');
				done();
			});
	});
	test('POST /api/solve with invalid characters in string', (done) => {
		chai
			.request(server)
			.post('/api/solve')
			.send({
				puzzle:
					':6}3|9<>5@74%251&^5~~1%6$49%&7=+1_6-34^__^79sudoku$!@#puzzles><>1are#@2fun!63//5{',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.error, 'Invalid characters in puzzle');
				done();
			});
	});
	test('POST /api/solve with incorrect length', (done) => {
		chai
			.request(server)
			.post('/api/solve')
			.send({
				puzzle:
					'.6.3.9..5.74.251..5..1.6.49..7..1.6.34....79...................1.....2....63..5.',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(
					res.body.error,
					'Expected puzzle to be 81 characters long'
				);
				done();
			});
	});
	test('POST /api/solve with an unsolvable string', (done) => {
		chai
			.request(server)
			.post('/api/solve')
			.send({
				puzzle:
					'96.3.9..5.74.251..5..1.6.49..7..1.6.34....79....................1.....2....63..5.',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.error, 'Puzzle cannot be solved');
				done();
			});
	});
	test('POST /api/check with all fields', (done) => {
		chai
			.request(server)
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: 'a1',
				value: '1',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.valid, true);
				done();
			});
	});
	test('POST /api/check with single placement conflict', (done) => {
		chai
			.request(server)
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: 'a1',
				value: '9',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.valid, false);
				assert.include(res.body.conflict, 'row');
				assert.notInclude(res.body.conflict, 'column');
				assert.notInclude(res.body.conflict, 'region');
				done();
			});
	});
	test('POST /api/check with multiple placement conflicts', (done) => {
		chai
			.request(server)
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: 'a1',
				value: '3',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.valid, false);
				assert.include(res.body.conflict, 'row');
				assert.include(res.body.conflict, 'column');
				assert.notInclude(res.body.conflict, 'region');
				done();
			});
	});
	test('POST /api/check with all placement conflicts', (done) => {
		chai
			.request(server)
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: 'a1',
				value: '5',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.valid, false);
				assert.include(res.body.conflict, 'row');
				assert.include(res.body.conflict, 'column');
				assert.include(res.body.conflict, 'region');
				done();
			});
	});
	test('POST /api/check with missing fields', (done) => {
		chai
			.request(server)
			.post('/api/check')
			.send({
				puzzle: puzzle,
				value: '1',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.error, 'Required field(s) missing');
				done();
			});
	});
	test('POST /api/check with invalid characters', (done) => {
		chai
			.request(server)
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: 'jk',
				value: '1',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.error, 'Invalid coordinate');
				done();
			});
	});
	test('POST /api/check with incorrect length', (done) => {
		chai
			.request(server)
			.post('/api/check')
			.send({
				puzzle:
					'.6.3.9..5.74.251..5..1.6.49..7..1.6.34....79...................1.....2....63..5.',
				coordinate: 'a1',
				value: '1',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(
					res.body.error,
					'Expected puzzle to be 81 characters long'
				);
				done();
			});
	});
	test('POST /api/check with incorrect coordinate', (done) => {
		chai
			.request(server)
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: 'a2',
				value: '1',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.valid, false);
				done();
			});
	});
	test('POST /api/check with incorrect value', (done) => {
		chai
			.request(server)
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: 'a2',
				value: '1',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.body.valid, false);
				done();
			});
	});
});
