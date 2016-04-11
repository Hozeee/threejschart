import express from 'express';
import cons from 'consolidate';
import open from 'open';
import fs from 'fs';

const app = express();

app.locals.pretty = true;

app.engine('jade', cons.jade);
app.set('view engine', 'jade');
app.set('views', __dirname + '/source/views/');
app.use(express.static('./build/'));

app.get('*', (req, res) => {
	res.render('index');
});

app.get('/:id', (req, res) => {
	var current = req.params.id.replace('.html', '');

	fs.readdir(__dirname + '/source/views', function (err, items) {
		for (var i = 0; i < items.length; i++) {
			if (items[i].replace('.jade', '') === current) {
				res.render(current);
			}
		}

	});
});

app.listen(3000, () => {
	console.log('Express server ready on http://localhost: 3000');
	open('http://localhost:3000');
});

export default app;

