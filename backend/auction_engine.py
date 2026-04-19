import random
import pandas as pd
import os

file_path = os.path.join(os.path.dirname(__file__), "players.csv")

players = pd.read_csv(file_path)

teams = [
"MI","CSK","RCB","KKR",
"DC","RR","SRH","PBKS",
"LSG","GT"
]

team_purse = {team:150 for team in teams}

team_players = {team:[] for team in teams}


def ai_bid(player):

    base_price = player["base_price"]

    bid = base_price + random.uniform(0.5,5)

    return round(bid,2)


def run_auction():

    for i,player in players.iterrows():

        print("\n----------------------------")
        print("Player:",player["player"])
        print("Role:",player["role"])
        print("Base Price:",player["base_price"],"Cr")

        bids = {}

        for team in teams:

            if team_purse[team] > player["base_price"]:

                bid_price = ai_bid(player)

                if bid_price <= team_purse[team]:

                    bids[team] = bid_price

        if len(bids)==0:

            print("Unsold")

        else:

            winner = max(bids,key=bids.get)

            price = bids[winner]

            team_purse[winner] -= price

            team_players[winner].append(player["player"])

            print("Sold to",winner,"for",price,"Cr")


    print("\n======== FINAL TEAMS ========")

    for team in teams:

        print("\n",team)

        print("Players:",team_players[team])

        print("Remaining Purse:",round(team_purse[team],2),"Cr")