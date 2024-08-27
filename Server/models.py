from flask_sqlalchemy import SQLAlchemy
from alembic import op
import sqlalchemy as sa
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import ForeignKey, Column, Integer, String
from sqlalchemy.orm import validates, relationship
from sqlalchemy_serializer import SerializerMixin
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo

db = SQLAlchemy()


def upgrade():
    op.alter_column('user', 'password', type_=sa.String(255))

def downgrade():
    op.alter_column('user', 'password', type_=sa.String(150))
    
    
class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

class User(db.Model, SerializerMixin):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    orders = db.relationship('Order', back_populates='user', lazy=True)
    reviews = db.relationship('Review', back_populates='user', lazy=True)
    cart_items = db.relationship('CartItem', back_populates='user', lazy=True)
    preferences = db.Column(db.Text, nullable=True)
    wishlists = db.relationship('Wishlist', back_populates='user', lazy=True)
    favorites = db.relationship('Favorite', back_populates='user', lazy=True)
    is_admin = db.Column(db.Boolean, default=False)
        

    serialize_only = ('id', 'username', 'email', 'password' 'created_at')

    @validates('email')
    def validate_email(self, key, address):
        if '@' not in address:
            raise ValueError("Invalid email address: must contain '@' symbol")

        return address
    
    @validates('username')
    def validate_username(self, key, username):
        assert len(username) >= 3, "Username must be at least 3 characters long"
        return username


    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at
        }
        
    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def add_to_cart(self, product, quantity):
        cart_item = CartItem(user=self, product=product, quantity=quantity)
        db.session.add(cart_item)
        db.session.commit()


    def remove_from_cart(self, product):
        cart_item = CartItem.query.filter_by(user=self, product=product).first()
        if cart_item:
            db.session.delete(cart_item)
            db.session.commit()
    
    def __repr__(self):
        return f'<User {self.username}>'

class Product(db.Model, SerializerMixin):
    __tablename__ = 'product'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    orders = db.relationship('Order', back_populates='product', lazy=True)
    reviews = db.relationship('Review', back_populates='product', lazy=True)
    cart_items = db.relationship('CartItem', back_populates='product', lazy=True)
    category = db.relationship('Category', back_populates='products')
    image_url = db.Column(db.String(200), nullable=True)
    rating = db.Column(db.Integer, default=0)
   


    serialize_only = ('id', 'name', 'description', 'price', 'category', 'created_at', 'rating')

    @validates('name')
    def validate_name(self, key, name):
        assert len(name) >= 2, "Product name must be at least 2 characters long"
        return name

    @validates('price')
    def validate_price(self, key, price):
        assert price >= 0, "Price must be non-negative"
        return price

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'imageUrl': self.image_url,
            'rating': self.rating,
            'category': self.category,
            'created_at': self.created_at
        
        }
class Category(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
    products = db.relationship('Product', back_populates='category', lazy=True)

    serialize_only = ('id', 'name')
    
    
class Wishlist(db.Model, SerializerMixin):
    __tablename__ = 'wishlists'
    __table_args__ = {'sqlite_autoincrement': True}
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='wishlists', lazy=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship('Product', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_only = ('id', 'user_id', 'product_id', 'created_at')

class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='favorites', lazy=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship('Product', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    serialize_only = ('id', 'user_id', 'product_id', 'created_at')

class CartItem(db.Model, SerializerMixin):
    __tablename__ = 'cart_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='cart_items', lazy=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship('Product', lazy=True)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_only = ('id', 'user_id', 'product_id', 'quantity', 'created_at')

    
    @validates('quantity')
    def validate_quantity(self, key, quantity):
        assert quantity > 0, "Quantity must be positive"
        return quantity
    
    
    def __repr__(self):
            return f'<CartItem {self.product.name}>'
        
class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='orders', lazy=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    product = db.relationship('Product', lazy=True)
    total_amount = db.Column(db.Float, nullable=False, default=0.0)
    taxes = db.Column(db.Float, nullable=False, default=0.0)
    shipping_cost = db.Column(db.Float, nullable=False, default=0.0)
    discount = db.Column(db.Float, nullable=False, default=0.0)
    order_total = db.Column(db.Float, nullable=False, default=0.0)
    shipping_address = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='Processing')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    serialize_only = ('id', 'user_id', 'total_amount', 'taxes', 'shipping_cost', 'discount', 'order_total', 'shipping_address', 'status', 'created_at', 'updated_at', 'quantity')
    
    @validates('total_amount', 'taxes', 'shipping_cost', 'discount', 'order_total')
    def validate_non_negative(self, key, value):
        assert value >= 0, f"{key} must be non-negative"
        return value

    @validates('shipping_address')
    def validate_shipping_address(self, key, address):
        assert len(address) > 0, "Shipping address cannot be empty"
        return address


    def to_dict(self):
        return {
                
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='reviews', lazy=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product = db.relationship('Product', lazy=True)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    serialize_only = ('id', 'user_id', 'product_id', 'rating', 'eview', 'created_at')
    
    
    @validates('rating')
    def validate_rating(self, key, rating):
        assert 1 <= rating <= 5, "Rating must be between 1 and 5"
        return rating

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at
        }
        
        
class SupportRequest(db.Model, SerializerMixin):
    __tablename__ = 'support_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    serialize_only = ('id', 'user_id', 'subject', 'message', 'status', 'created_at', 'updated_at')

    @validates('subject')
    def validate_subject(self, key, subject):
        assert len(subject) > 0, "Subject cannot be empty"
        return subject

    @validates('message')
    def validate_message(self, key, message):
        assert len(message) > 0, "Message cannot be empty"
        return message
