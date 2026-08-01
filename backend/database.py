from config.database import users_collection

def save_user(username, passphrase):
    users_collection.insert_one(
        {
            "username": username,
            "passphrase": passphrase
        }
    )

def load_users():
    users = {}

    for user in users_collection.find():
        users[user["username"]] = {
            "passphrase": user["passphrase"]
        }

    return users