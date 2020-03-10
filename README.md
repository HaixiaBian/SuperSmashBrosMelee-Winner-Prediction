# Melee-Win-Prediction

This will be the codebase for predicting the outcome of games of Super Smash Bros Melee via the current game state.

### Files

* *scraping.ipynb* - The current file used for scraping the `.slp` files from http://slippi.gg. Requires library selenium which to execute the scraping.
* *slp-to-json.js* - The script used to convert a directory full of `.slp` files to `.json` files. This is only in nodejs as the library for the conversion is in node.
* *to_csv.ipynb* - Jupyter notebook for converting the json output from *slp-to-json.js* to csv format, for use in future analysis and modeling.

### Todo List

* Add filtering of handwarmers to *slp-to-json.js*
	* The following are indicators of handwarmers:
		* Game is short (< 1 minute)
		* No player has 0 stocks on the final frame
		* One player has 4 stocks, low percent at the end
		* The maximum percent of one of the players is low (< 30).
* Scrape Hbox vs Fox games for all tournaments
	* We should only scrape games we are sure of, so probably only first few pages of most tournaments.

