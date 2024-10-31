from unittest import TestCase

from app import app
from models import db, Cupcake

# Use test database and don't clutter tests with SQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_test'
app.config['SQLALCHEMY_ECHO'] = False

# Make Flask errors be real errors, rather than HTML pages with error info
app.config['TESTING'] = True


CUPCAKE_DATA = {
    "flavor": "TestFlavor",
    "size": "TestSize",
    "rating": 5,
    "image": "http://test.com/cupcake.jpg"
}

CUPCAKE_DATA_2 = {
    "flavor": "TestFlavor2",
    "size": "TestSize2",
    "rating": 10,
    "image": "http://test.com/cupcake2.jpg"
}


class CupcakeViewsTestCase(TestCase):
    """Tests for views of API."""

    def setUp(self):
        """Make demo data."""
        
        with app.app_context():
            db.drop_all()
            db.create_all()
            
            cupcake = Cupcake(**CUPCAKE_DATA)
            db.session.add(cupcake)
            db.session.commit()
            
            self.cupcake = cupcake
            

    def tearDown(self):
        """Clean up fouled transactions."""
        
        with app.app_context():
            db.drop_all()
            db.session.remove()
            

    def test_list_cupcakes(self):
        with app.app_context(), app.test_client() as client:
            
            resp = client.get("/api/cupcakes")

            self.assertEqual(resp.status_code, 200)

            data = resp.json
            self.assertEqual(data, {
                "cupcakes": [
                    {
                        "id": 1,
                        "flavor": "TestFlavor",
                        "size": "TestSize",
                        "rating": 5.0,
                        "image": "http://test.com/cupcake.jpg"
                    }
                ]
            })

    def test_get_cupcake(self):
        with app.app_context(), app.test_client() as client:
            cupcake = Cupcake.query.one()
            url = f"/api/cupcakes/{cupcake.id}"
            resp = client.get(url)

            self.assertEqual(resp.status_code, 200)
            data = resp.json
            self.assertEqual(data, {
                "cupcake": {
                    "id": cupcake.id,
                    "flavor": "TestFlavor",
                    "size": "TestSize",
                    "rating": 5,
                    "image": "http://test.com/cupcake.jpg"
                }
            })

    def test_create_cupcake(self):
        with app.test_client() as client:
            url = "/api/cupcakes"
            resp = client.post(url, json=CUPCAKE_DATA_2)

            self.assertEqual(resp.status_code, 201)

            data = resp.json

            # don't know what ID we'll get, make sure it's an int & normalize
            self.assertIsInstance(data['cupcake']['id'], int)
            del data['cupcake']['id']

            self.assertEqual(data, {
                "cupcake": {
                    "flavor": "TestFlavor2",
                    "size": "TestSize2",
                    "rating": 10,
                    "image": "http://test.com/cupcake2.jpg"
                }
            })

            self.assertEqual(Cupcake.query.count(), 2)
            
            
    def test_patch_cupcake(self):
        with app.app_context(), app.test_client() as client:
            cupcake = Cupcake.query.one()
            url = f"/api/cupcakes/{cupcake.id}"
            # Data to be used for PATCH request
            update_data = {
                "flavor": "UpdatedFlavor",
                "size": "UpdatedSize",
                "rating": 10,
                "image": "http://updated.com/cupcake.jpg"
            }
            resp = client.patch(url, json=update_data)
            
            # check that the response status code is 200
            self.assertEqual(resp.status_code, 200)
            
            # check that the flavor, size, rating, and image fields got updated
            data = resp.json
            self.assertEqual(data, {
                "cupcake": {
                    "id": cupcake.id,
                    "flavor": "UpdatedFlavor",
                    "size": "UpdatedSize",
                    "rating": 10,
                    "image": "http://updated.com/cupcake.jpg"
                }
            })
            
            
    def test_delete_cupcake(self):
        with app.app_context(), app.test_client() as client:
            cupcake = Cupcake.query.one()
            url = f"/api/cupcakes/{cupcake.id}"
            resp = client.delete(url)
            
            # check that the response status code is 200
            self.assertEqual(resp.status_code, 200)
            
            # check deletion message
            data = resp.json
            self.assertEqual(data, {"message": "Deleted"})
            
            # check the cupcake was actually deleted
            resp = client.get(url)
            self.assertEqual(resp.status_code, 404)
