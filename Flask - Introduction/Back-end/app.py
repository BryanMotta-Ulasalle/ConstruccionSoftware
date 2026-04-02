from flask import Flask, jsonify, request

app = Flask(__name__)

tasks = [] 
Users = []

# GET - retrieve all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify({"tasks": tasks})

# POST - add a new task
@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    if(not data or "content" not in data):
        return jsonify({"error": "Content is required"}), 400
    task = {"id": len(tasks), "content": data.get("content", ""), "done": False}
    tasks.append(task)
    return jsonify({"message": "Task added!", "task": task}), 201

# PUT - update a task by ID
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    if task_id >= len(tasks):
        return jsonify({"error": "Task not found"}), 404
    data = request.json
    if(not data):
        return jsonify({"error": "No data provided"}), 400
    tasks[task_id]["content"] = data.get("content", tasks[task_id]["content"])
    return jsonify({"message": "Task updated!", "task": tasks[task_id]})

# DELETE - delete a task by ID
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    if task_id >= len(tasks):
        return jsonify({"error": "Task not found"}), 404
    removed = tasks.pop(task_id)
    return jsonify({"message": "Task deleted!", "task": removed})

# GET - retrieve a specific task by ID
@app.route("/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    if task_id >= len(tasks):
        return jsonify({"error": "Task not found"}), 404
    return jsonify({"task": tasks[task_id]})

@app.route("/tasksDone/<int:task_id>", methods=["POST"])
def get_done_task(task_id):
    if task_id >= len(tasks):
        return jsonify({"error": "Task not found"}), 404
    tasks[task_id]["done"] = True
    return jsonify({"message": "Task marked as done!", "task": tasks[task_id]})



#USERS ENDPOINTS

@app.route("/users", methods=["GET"])
def get_users():
    return jsonify({"users": Users})

@app.route("/user", methods=["POST"])
def add_user():
    data = request.json
    if(not data or "name" not in data):
        return jsonify({"error": "Name is required"}), 400
    address = data.get("address", {})
    user = {"id": len(Users), "name": data.get("name", ""), "lastname": data.get("lastname", ""), 
            "address": {
               "city": address.get("city", ""),
                "country": address.get("country", ""),
                "code": address.get("code", "") 
            }} 
    Users.append(user) 
    return jsonify({"message": "User added!", "user": user}), 201

@app.route("/user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    if user_id >= len(Users):
        return jsonify({"error": "User not found"}), 404
    data = request.json
    if(not data):
        return jsonify({"error": "No data provided"}), 400
    Users[user_id]["name"] = data.get("name", Users[user_id]["name"])
    Users[user_id]["lastname"] = data.get("lastname", Users[user_id]["lastname"])
    address = data.get("address", {})
    Users[user_id]["address"]["city"] = address.get("city", Users[user_id]["address"]["city"])
    Users[user_id]["address"]["country"] = address.get("country", Users[user_id]["address"]["country"])
    Users[user_id]["address"]["code"] = address.get("code", Users[user_id]["address"]["code"])
    return jsonify({"message": "User updated!", "user": Users[user_id]})

@app.route("/user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    if user_id >= len(Users):
        return jsonify({"error": "User not found"}), 404
    removed = Users.pop(user_id)
    return jsonify({"message": "User deleted!", "user": removed})




if __name__ == "__main__":
    app.run(debug=True)

