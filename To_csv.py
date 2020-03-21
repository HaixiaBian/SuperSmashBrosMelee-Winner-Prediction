#!/usr/bin/env python
# coding: utf-8

# Notebook for converting the .json files to csv.

# In[1]:


import pandas as pd
import json
import os


# Method for loading the game. Only the `game.json` and `settings.json` files are used as of now.

# In[2]:


def load_game(d):
	with open(os.path.join(d, "game.json")) as f:
		game = json.load(f)
	with open(os.path.join(d, "settings.json")) as f:
		settings = json.load(f)
	return game, settings


# Constants, creating output directory.

# In[8]:


setting_features = ['stageId', 'winner']
game_features = {
	'pre': [], 
	'post': ['positionX', 'positionY', 'facingDirection', 
			 'percent', 'shieldSize', 'stocksRemaining', 'lCancelStatus']
}
in_dir = "./json"
out_dir = "./data"
os.makedirs(os.path.join(out_dir), exist_ok=True)
columns = ['frame']
for k in game_features:
	columns += ["p1_{}_{}".format(k, feat) for feat in game_features[k]]
for k in game_features:
	columns += ["p2_{}_{}".format(k, feat) for feat in game_features[k]]
columns += setting_features


# Goes through all the games in the input directory, reads them and gets the features, outputs to csv.

# In[9]:



for tourn in os.listdir(in_dir):
	os.makedirs(os.path.join(out_dir, tourn), exist_ok=True)
	for d in os.listdir(os.path.join(in_dir, tourn)):
		game, settings = load_game(os.path.join(in_dir, tourn, d))
		jig_id = settings['jig_id']
		other_id = settings['other_id']
		setting_data = [settings[feat] for feat in setting_features]
		data = []
		for frame in game:
			frame_data = []
			frame_data += [int(frame)]
			# Appending game features to the data
			for k in game_features:
				frame_data += [game[frame]['players'][jig_id][k][feat] for feat in game_features[k]]
			for k in game_features:
				frame_data += [game[frame]['players'][other_id][k][feat] for feat in game_features[k]]
			# Appending settings data
			frame_data += setting_data

			data.append(frame_data)
		
		# Writes the data that was retrieved to a csv.
		pd.DataFrame(data, columns=columns).to_csv(os.path.join(out_dir, tourn, d + ".csv"), index=False)
	print("Finished tournament {}".format(tourn))

