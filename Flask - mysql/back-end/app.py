# app.py
from flask import Flask, request, jsonify
from models import db, Task
import config
from flask_cors import CORS
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    # Load configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = config.SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.SQLALCHEMY_TRACK_MODIFICATIONS
    app.config["SECRET_KEY"] = config.SECRET_KEY

    # Initialize database with app context
    db.init_app(app)

    # Initialize Flask-Migrate
    migrate = Migrate(app, db)

    # ---------- Health & Root ----------
    @app.route("/")
    def root():
        return jsonify({"message": "Task Manager API (Flask + MySQL + SQLAlchemy)"}), 200

    @app.route("/healths")
    def health():
        # Lightweight health check
        return jsonify({"status": "ok"}), 200

    # ---------- CRUD: Tasks ----------
    @app.route("/tasks", methods=["GET"])
    def list_tasks():
        """List all tasks with pagination."""
        try:
            page = request.args.get("page", 1, type=int)
            limit = request.args.get("limit", 5, type=int)
            
            # Validate pagination parameters
            if page < 1:
                page = 1
            if limit < 1 or limit > 100:
                limit = 5
            
            # Paginate tasks ordered by creation date
            paginated = Task.query.order_by(Task.created_at.desc()).paginate(
                page=page, per_page=limit, error_out=False
            )
            
            return jsonify({
                "data": [t.to_dict() for t in paginated.items],
                "total": paginated.total,
                "pages": paginated.pages,
                "current_page": page,
                "per_page": limit,
                "has_next": paginated.has_next,
                "has_prev": paginated.has_prev,
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @app.route("/tasks/<int:task_id>", methods=["GET"])
    def get_task(task_id):
        """Get a single task by id."""
        task = Task.query.get(task_id)
        if not task:
            return jsonify({"error": "Task not found"}), 404
        return jsonify(task.to_dict()), 200

    @app.route("/tasks", methods=["POST"])
    def create_task():
        """Create a new task."""
        payload = request.get_json(silent=True) or {}
        name = payload.get("name", "").strip()
        content = payload.get("content", "").strip()

        if not name:
            return jsonify({"error": "Field 'name' is required and cannot be empty."}), 400
        if not content:
            return jsonify({"error": "Field 'content' is required and cannot be empty."}), 400

        task = Task(name=name, content=content, done=bool(payload.get("done", False)))
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201

    @app.route("/tasks/<int:task_id>", methods=["PUT"])
    def update_task(task_id):
        """Update name/content/done for an existing task."""
        task = Task.query.get(task_id)
        if not task:
            return jsonify({"error": "Task not found"}), 404

        payload = request.get_json(silent=True) or {}

        # Only update provided fields
        if "name" in payload:
            new_name = str(payload["name"]).strip()
            if not new_name:
                return jsonify({"error": "Field 'name' cannot be empty."}), 400
            task.name = new_name

        if "content" in payload:
            new_content = str(payload["content"]).strip()
            if not new_content:
                return jsonify({"error": "Field 'content' cannot be empty."}), 400
            task.content = new_content

        if "done" in payload:
            task.done = bool(payload["done"])

        db.session.commit()
        return jsonify(task.to_dict()), 200

    @app.route("/tasks/<int:task_id>", methods=["DELETE"])
    def delete_task(task_id):
        """Delete a task by id."""
        task = Task.query.get(task_id)
        if not task:
            return jsonify({"error": "Task not found"}), 404
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"}), 200

    # ---------- Convenience Filters ----------
    @app.route("/tasks/done", methods=["GET"])
    def list_done():
        count = Task.query.filter_by(done=True).count()
        return jsonify({"count": count}), 200

    @app.route("/tasks/pending", methods=["GET"])
    def list_pending():
        count = Task.query.filter_by(done=False).count()
        return jsonify({"count": count}), 200

    return app

# Dev entrypoint
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
