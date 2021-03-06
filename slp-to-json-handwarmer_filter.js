const { default: SlippiGame } = require('slp-parser-js');
const fs = require("fs");
const path = require('path');

// Check whether a game is a handwarmer
function check_handwarmer(game) {
	// Get game settings – stage, characters, etc
	const settings = game.getSettings();
	//console.log(settings);

	// Get metadata - start time, platform played on, etc
	const metadata = game.getMetadata();
	//console.log(metadata);
	
	const last = metadata['lastFrame'];
	// check game length < 1min
	console.log(last);
	if (last < 3600) {
		console.log('Game is short (< 1 minute)');
		return true;
	}
	
	const frames = game.getFrames();
	const lastframe = frames[last];
	
	// check No player has 0 stocks on the final frame
	var flag1 = true; // satisfy this condition
	for(let player of lastframe['players']){
		if (!player) { // skip undefined
			continue;
		}
		console.log(player['post']['stocksRemaining']);
		console.log(player['post']['percent']);
		if (player['post']['stocksRemaining'] <= 0) {
			flag1 = false;
		}
	}
	if (flag1) {
		console.log('No player has 0 stocks on the final frame');
		return true;
	}
	
	// check One player has 4 stocks, low percent at the end
	for(let player of lastframe['players']){
		if (!player) { // skip undefined
			continue;
		}
		if (player['post']['stocksRemaining'] == 4 &&
			player['post']['percent'] < 30) {
			console.log('One player has 4 stocks, low percent at the end');
			return true;
		}
	}
	
	// check The maximum percent of one of the players is low (< 30).
	var maxs = {0:0, 1:0, 2:0, 3:0}; // recorder max percent of each player
	for(i=1;i<last+1;i++) {
		const frame = frames[i];
		for(let player of frame['players']){
			if (!player) { // skip undefined
				continue;
			}
			player_ind = player['post']['playerIndex']
			maxs[player_ind] = Math.max(maxs[player_ind], player['post']['percent'])
			//console.log(player);
		}
	}
	//console.log(maxs);
	for (let player of settings['players']) {
		if (maxs[player['playerIndex']] < 30) {
			console.log('The maximum percent of one of the players is low (< 30).');
			return true;
		}
	}
	return false;
}

var handwarmer_cnt = 0;
var game_cnt = 0;
// Gets every folder within the ./slip folder
fs.readdirSync("./slip").forEach(folder => {
	const slip_folder = "./slip/"+folder+"/"
	console.log(slip_folder)
	const out_folder = "./json/"+folder+"/"
	// Gets every file within the folder defined above containing the .slp files
	fs.readdirSync(slip_folder).forEach(file => {

		const game = new SlippiGame(path.join(slip_folder, file));

		// Get game settings – stage, characters, etc
		const settings = game.getSettings();
		//console.log(settings);

		// Get metadata - start time, platform played on, etc
		const metadata = game.getMetadata();
		//console.log(metadata['players']);
		
		//Check handwarmer game 
		flag = check_handwarmer(game);
		if (flag) {
			console.log('handwarmer');
			handwarmer_cnt++;
			return;//if it is handwarmer game, skip it, O.W. continue. 
		}
		else {
			game_cnt++;
		}
		console.log('not handwarmer');

		/**
		 Gets the index of which player is using jigglypuff, which character is using fox.
		 This is important as there are 4 character slots, and players can be on any of the 4.
		**/
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

		//console.log(jig)

		// Get frames – animation state, inputs, etc
		// This is used to compute your own stats or get more frame-specific info (advanced)
		const frames = game.getFrames();

		const last = metadata['lastFrame']
		//console.log(last)
		// Finding out whether jigglypuff won
		const puff_won = frames[last]['players'][jig]['post']['stocksRemaining'] > 0

		//console.log(puff_won)

		// Recreating the frames dict using only ever nth frame
		var frames2 = {}

		for(i=1;i<last+1;i++) {
			if(i%15==0) {
				frames2[i] = frames[i]
			}
		}
		// Saving the information we got in settings, which will be written to the JSON file
		settings['winner'] = puff_won
		settings['jig_id'] = jig
		settings['other_id'] = other

		// Get the file name, then create the folder where the json files will be
		const file_name = file.split(".")[0]
		
		if (!fs.existsSync(path.join(out_folder, file_name))){
			fs.mkdirSync(path.join(out_folder, file_name), { recursive: true });
		}


		// Write the JSON files
		fs.writeFileSync(path.join(out_folder, file_name, "game.json"), JSON.stringify(frames2), function(err) {
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
})

console.log('handwarmers ' + handwarmer_cnt);// count of handwarmers
console.log("Games " + game_cnt)