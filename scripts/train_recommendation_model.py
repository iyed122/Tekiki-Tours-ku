import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib

class TourRecommendationML:
    """
    Machine Learning model for tour recommendations
    Uses collaborative filtering and content-based approaches
    """
    
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_columns = []
        
    def load_training_data(self):
        """Load and prepare training data"""
        
        # Load data
        with open('training_data/customers.json', 'r') as f:
            customers = json.load(f)
        
        with open('training_data/tours.json', 'r') as f:
            tours = json.load(f)
            
        with open('training_data/interactions.json', 'r') as f:
            interactions = json.load(f)
        
        # Convert to DataFrames
        customers_df = pd.DataFrame(customers)
        tours_df = pd.DataFrame(tours)
        interactions_df = pd.DataFrame(interactions)
        
        return customers_df, tours_df, interactions_df
    
    def create_features(self, customers_df, tours_df, interactions_df):
        """Create feature matrix for training"""
        
        # Merge data to create training examples
        training_data = []
        
        for _, interaction in interactions_df.iterrows():
            customer = customers_df[customers_df['id'] == interaction['customer_id']].iloc[0]
            tour = tours_df[tours_df['id'] == interaction['tour_id']].iloc[0]
            
            # Create feature vector
            features = {
                # Customer features
                'customer_budget': customer['budget'],
                'customer_duration': customer['duration'],
                'customer_group_size': customer['group_size'],
                'customer_previous_bookings': customer['previous_bookings'],
                'customer_travel_style': customer['travel_style'],
                'customer_age_group': customer['age_group'],
                
                # Tour features
                'tour_price': tour['price'],
                'tour_duration': tour['duration'],
                'tour_rating': tour['rating'],
                'tour_category': tour['category'],
                'tour_difficulty': tour['difficulty'],
                'tour_min_group': tour['group_size']['min'],
                'tour_max_group': tour['group_size']['max'],
                
                # Interaction features
                'interaction_type': interaction['interaction_type'],
                'device_type': interaction['device_type'],
                'session_duration': interaction['session_duration'],
                
                # Derived features
                'budget_match': 1 if tour['price'] <= customer['budget'] / customer['duration'] else 0,
                'duration_match': 1 if tour['duration'] <= customer['duration'] else 0,
                'group_size_match': 1 if customer['group_size'] >= tour['group_size']['min'] and customer['group_size'] <= tour['group_size']['max'] else 0,
                
                # Interest matching (simplified)
                'interest_match_score': len(set(customer['interests']) & set(tour['tags'])) / len(customer['interests']),
                
                # Target variable (rating or interaction strength)
                'target': self.get_interaction_score(interaction)
            }
            
            training_data.append(features)
        
        return pd.DataFrame(training_data)
    
    def get_interaction_score(self, interaction):
        """Convert interaction type to numerical score"""
        scores = {
            'view': 1.0,
            'click': 2.0,
            'favorite': 3.0,
            'booking': 5.0
        }
        
        base_score = scores.get(interaction['interaction_type'], 1.0)
        
        # Adjust based on session duration
        duration_bonus = min(interaction['session_duration'] / 300, 1.0)  # Max 5 minutes
        
        return base_score + duration_bonus
    
    def preprocess_features(self, df):
        """Preprocess features for training"""
        
        # Separate features and target
        X = df.drop('target', axis=1)
        y = df['target']
        
        # Encode categorical variables
        categorical_columns = ['customer_travel_style', 'customer_age_group', 'tour_category', 
                             'tour_difficulty', 'interaction_type', 'device_type']
        
        for col in categorical_columns:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                X[col] = self.label_encoders[col].fit_transform(X[col])
            else:
                X[col] = self.label_encoders[col].transform(X[col])
        
        # Scale numerical features
        numerical_columns = X.select_dtypes(include=[np.number]).columns
        X[numerical_columns] = self.scaler.fit_transform(X[numerical_columns])
        
        self.feature_columns = X.columns.tolist()
        
        return X, y
    
    def train(self):
        """Train the recommendation model"""
        
        print("Loading training data...")
        customers_df, tours_df, interactions_df = self.load_training_data()
        
        print("Creating features...")
        training_df = self.create_features(customers_df, tours_df, interactions_df)
        
        print("Preprocessing features...")
        X, y = self.preprocess_features(training_df)
        
        print("Splitting data...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        print("Training model...")
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        
        train_mse = mean_squared_error(y_train, train_pred)
        test_mse = mean_squared_error(y_test, test_pred)
        train_mae = mean_absolute_error(y_train, train_pred)
        test_mae = mean_absolute_error(y_test, test_pred)
        
        print(f"Training MSE: {train_mse:.4f}")
        print(f"Test MSE: {test_mse:.4f}")
        print(f"Training MAE: {train_mae:.4f}")
        print(f"Test MAE: {test_mae:.4f}")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nTop 10 Most Important Features:")
        print(feature_importance.head(10))
        
        return {
            'train_mse': train_mse,
            'test_mse': test_mse,
            'train_mae': train_mae,
            'test_mae': test_mae,
            'feature_importance': feature_importance
        }
    
    def save_model(self, filepath='models/recommendation_model.pkl'):
        """Save trained model"""
        import os
        os.makedirs('models', exist_ok=True)
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_columns': self.feature_columns
        }
        
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='models/recommendation_model.pkl'):
        """Load trained model"""
        model_data = joblib.load(filepath)
        
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.label_encoders = model_data['label_encoders']
        self.feature_columns = model_data['feature_columns']
        
        print(f"Model loaded from {filepath}")
    
    def predict_recommendation_score(self, customer_features, tour_features):
        """Predict recommendation score for customer-tour pair"""
        
        # Create feature vector (simplified version)
        features = {
            'customer_budget': customer_features['budget'],
            'customer_duration': customer_features['duration'],
            'customer_group_size': customer_features['group_size'],
            'customer_previous_bookings': customer_features.get('previous_bookings', 0),
            'customer_travel_style': customer_features['travel_style'],
            'customer_age_group': customer_features.get('age_group', '26-35'),
            
            'tour_price': tour_features['price'],
            'tour_duration': tour_features['duration'],
            'tour_rating': tour_features['rating'],
            'tour_category': tour_features['category'],
            'tour_difficulty': tour_features['difficulty'],
            'tour_min_group': tour_features['group_size']['min'],
            'tour_max_group': tour_features['group_size']['max'],
            
            # Default interaction features
            'interaction_type': 'view',
            'device_type': 'desktop',
            'session_duration': 120,
            
            # Derived features
            'budget_match': 1 if tour_features['price'] <= customer_features['budget'] / customer_features['duration'] else 0,
            'duration_match': 1 if tour_features['duration'] <= customer_features['duration'] else 0,
            'group_size_match': 1 if customer_features['group_size'] >= tour_features['group_size']['min'] and customer_features['group_size'] <= tour_features['group_size']['max'] else 0,
            'interest_match_score': len(set(customer_features['interests']) & set(tour_features['tags'])) / len(customer_features['interests']),
        }
        
        # Convert to DataFrame
        feature_df = pd.DataFrame([features])
        
        # Encode categorical variables
        categorical_columns = ['customer_travel_style', 'customer_age_group', 'tour_category', 
                             'tour_difficulty', 'interaction_type', 'device_type']
        
        for col in categorical_columns:
            if col in self.label_encoders:
                feature_df[col] = self.label_encoders[col].transform(feature_df[col])
        
        # Scale features
        numerical_columns = feature_df.select_dtypes(include=[np.number]).columns
        feature_df[numerical_columns] = self.scaler.transform(feature_df[numerical_columns])
        
        # Predict
        score = self.model.predict(feature_df)[0]
        
        return max(0, min(5, score))  # Clamp between 0 and 5

def main():
    """Train and save the recommendation model"""
    
    print("Starting ML model training...")
    
    # Initialize model
    ml_model = TourRecommendationML()
    
    # Train model
    results = ml_model.train()
    
    # Save model
    ml_model.save_model()
    
    print("\nModel training completed successfully!")
    print("You can now use the trained model for recommendations.")

if __name__ == "__main__":
    main()
