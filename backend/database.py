import json
import os


DB_FILE = "users/users.json"


def save_user(username, passphrase):

    users = load_users()

    users[username] = {
        "passphrase": passphrase
    }

    with open(DB_FILE, "w") as file:
        json.dump(users, file, indent=4)


def load_users():

    if not os.path.exists(DB_FILE):
        return {}

    with open(DB_FILE, "r") as file:
        return json.load(file)