"""Flask app for Cupcakes"""
from flask import Flask, request, jsonify, render_template
from models import db, connect_db, Cupcake


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)

def init_db():
    """Create all tables."""
    with app.app_context():
        db.create_all()
        
init_db()


@app.route('/')
def home_page():
    return render_template('home.html')


@app.route('/api/cupcakes')
def list_all_cupcakes():
    """Get data about all cupcakes"""
    cupcakes = [cupcake.serialize_cupcake() for cupcake in Cupcake.query.all()]
    return jsonify(cupcakes=cupcakes)


@app.route('/api/cupcakes/<int:cupcake_id>')
def get_single_cupcake(cupcake_id):
    """Get data about a single cupcake"""
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    return jsonify(cupcake=cupcake.serialize_cupcake())


@app.route('/api/cupcakes', methods=['POST'])
def create_cupcake():
    """Create a cupcake"""
    new_cupcake = Cupcake(
        flavor=request.json['flavor'],
        size=request.json['size'],
        rating=request.json['rating'],
        image=request.json.get('image', None)
    )
    
    db.session.add(new_cupcake)
    db.session.commit()
    
    return (jsonify(cupcake=new_cupcake.serialize_cupcake()), 201)


@app.route('/api/cupcakes/<int:cupcake_id>', methods=['PATCH'])
def update_cupcake(cupcake_id):
    """Update a specific cupcake and respond with JSON of the updated cupcake"""
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    
    data = request.json
    
    cupcake.flavor = data.get('flavor', cupcake.flavor)
    cupcake.size = data.get('size', cupcake.size)
    cupcake.rating = data.get('rating', cupcake.rating)
    cupcake.image = data.get('image', cupcake.image)
    
    db.session.commit()
    
    return jsonify(cupcake=cupcake.serialize_cupcake())


@app.route('/api/cupcakes/<int:cupcake_id>', methods=['DELETE'])
def delete_cupcake(cupcake_id):
    """Delete a specific cupcake and respond with 'Deleted' JSON"""
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    
    db.session.delete(cupcake)
    db.session.commit()
    
    return jsonify({'message': 'Deleted'})
