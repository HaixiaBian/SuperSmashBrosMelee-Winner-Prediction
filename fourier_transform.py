# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import os
import numpy as np
import pandas as pd

#%%
data = []
base = "data"
for tourn in os.listdir(base):
    for game in os.listdir(os.path.join(base, tourn)):
#        data.append(pd.read_csv(os.path.join(base, tourn, game)))
        frames = pd.read_csv(os.path.join(base, tourn, game))
        print(len(frames))
        
    break

