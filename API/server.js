var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;
var router = express.Router();
var outputFile = 'database.json';
var command_template = 'command_template.json';
var database = JSON.parse(fs.readFileSync(outputFile, 'utf8'));


function writeToFile()
{
	//write to file for testing purposes
	var databaseJSON = JSON.stringify(database);
	fs.writeFileSync(outputFile, databaseJSON);
}


function addCommand(type, psu_id)
{
	var json = JSON.parse(fs.readFileSync(command_template, 'utf8'));
	json['type'] = type;
	json['psu_id'] = psu_id;
	console.log(json);
	database.push(json);
	//writeToFile();
}


router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/command', function(req, res) {

	console.log(database);
	console.log(database.length);

	if(database.length > 0)
	{
		res.json(database[0]);
		database.splice(0,1);
		//writeToFile(); 
		//console.log(database);
	}
	else
	{
		var json = JSON.parse(fs.readFileSync(command_template, 'utf8'));
		json['type'] = 'none';
		json['psu_id'] = 0;
		res.json(json);
	}

      
});

router.get('/pull_psu/:psu_id', function(req, res) {
	addCommand('pull_psu', req.params.psu_id);
	//addCommand(req.body.id);
	res.json({message: 'sucess' });
});

router.get('/push_psu/:psu_id', function(req, res) {
	addCommand('push_psu', req.params.psu_id);
	//addCommand(req.body.id);
	res.json({message: 'sucess' });
});



app.use('/api', router);

app.listen(port, '0.0.0.0');
console.log('Starting port ' + port);