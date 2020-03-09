const { default: SlippiGame } = require('slp-parser-js');
const fs = require("fs");
const slip_folder = "./slip/"
const out_folder = "./out/"
const path = require('path');


fs.readdirSync(slip_folder).forEach(file => {



	const game = new SlippiGame(path.join(slip_folder, file));

	// Get game settings – stage, characters, etc
	const settings = game.getSettings();
	console.log(settings);

	// Get metadata - start time, platform played on, etc
	const metadata = game.getMetadata();
	console.log(metadata['players']);

	var jig = 0;
	var other = 0;
	if(settings['players'][0]['characterId'] == 15) {
		jig = settings['players'][0]['playerIndex']
		other = settings['players'][1]['playerIndex']
	}
	else {
		other = settings['players'][0]['playerIndex']
		jig = settings['players'][1]['playerIndex']
	}

	console.log(jig)
	// Get computed stats - openings / kill, conversions, etc
	// const stats = game.getStats();
	// console.log(stats);

	// Get frames – animation state, inputs, etc
	// This is used to compute your own stats or get more frame-specific info (advanced)
	const frames = game.getFrames();

	// console.log(frames[0]['players']); // Print frame when timer starts counting down

	const last = metadata['lastFrame']
	console.log(last)

	const puff_won = frames[last]['players'][jig]['post']['stocksRemaining'] > 0

	console.log(puff_won)

	var f2 = {}

	for(i=1;i<last+1;i++) {
		if(i%60==0) {
			f2[i] = frames[i]
		}
	}
	settings['winner'] = puff_won
	settings['jig_id'] = jig
	settings['other_id'] = other
	const file_name = file.split(".")[0]
	
	if (!fs.existsSync(path.join(out_folder, file_name))){
    	fs.mkdirSync(path.join(out_folder, file_name));
	}


	fs.writeFileSync(path.join(out_folder, file_name, "game.json"), JSON.stringify(f2), function(err) {
		if(err) {
			return console.log("err")
		}
	});

	fs.writeFileSync(path.join(out_folder, file_name, "metadata.json"), JSON.stringify(metadata), function(err) {
		if(err) {
			return console.log("err")
		}
	});

	fs.writeFileSync(path.join(out_folder, file_name, "settings.json"), JSON.stringify(settings), function(err) {
		if(err) {
			return console.log("err")
		}
	});

})