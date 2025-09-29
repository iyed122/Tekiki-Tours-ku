# Machine Learning Training Guide for Tekiki Tours Recommendation System

## Overview

This guide explains how to train and improve the machine learning recommendation system for Tekiki Tours. The system uses a hybrid approach combining collaborative filtering and content-based recommendations.

## Quick Start

1. **Generate Training Data**
   \`\`\`bash
   python scripts/generate_training_data.py
   \`\`\`

2. **Train the Model**
   \`\`\`bash
   python scripts/train_recommendation_model.py
   \`\`\`

3. **The trained model will be saved to `models/recommendation_model.pkl`**

## Data Structure

### Customer Data
- **Budget**: Total budget in TND
- **Duration**: Trip duration in days
- **Interests**: Array of interest categories
- **Travel Style**: Budget-friendly, Mid-range, or Luxury
- **Group Size**: Number of travelers
- **Demographics**: Age group, nationality, previous bookings

### Tour Data
- **Price**: Price per person in TND
- **Duration**: Tour duration in days
- **Category**: Cultural, Adventure, Beach, etc.
- **Tags**: Array of descriptive tags
- **Rating**: Average customer rating
- **Group Size**: Min/max group size limits

### Interaction Data
- **View**: Customer viewed tour details
- **Click**: Customer clicked on tour
- **Favorite**: Customer added to favorites
- **Booking**: Customer made a booking
- **Session Duration**: Time spent viewing
- **Device Type**: Mobile, desktop, tablet

## Feature Engineering

The ML model uses these key features:

### Customer Features
- Budget per day ratio
- Duration preferences
- Group size compatibility
- Travel style preferences
- Previous booking history
- Demographics (age, nationality)

### Tour Features
- Price point
- Duration
- Rating and popularity
- Category and tags
- Difficulty level
- Group size requirements

### Interaction Features
- Interaction type (view, click, favorite, booking)
- Session duration
- Device type
- Time of interaction

### Derived Features
- **Budget Match**: Does tour price fit customer budget?
- **Duration Match**: Does tour duration fit customer schedule?
- **Group Size Match**: Does tour accommodate customer group?
- **Interest Match Score**: Percentage of customer interests matching tour tags

## Model Architecture

### Random Forest Regressor
- **Algorithm**: Random Forest with 100 estimators
- **Target**: Interaction strength score (1-5 scale)
- **Features**: 15+ engineered features
- **Preprocessing**: StandardScaler for numerical, LabelEncoder for categorical

### Scoring System
- **View**: 1.0 points
- **Click**: 2.0 points
- **Favorite**: 3.0 points
- **Booking**: 5.0 points
- **Session Duration Bonus**: Up to +1.0 points

## Training Process

### 1. Data Generation
\`\`\`python
# Generate 1000 synthetic customers
customers = generate_customer_data(1000)

# Generate 5000 interactions
interactions = generate_tour_interaction_data(customers, tours, 5000)
\`\`\`

### 2. Feature Creation
\`\`\`python
# Create feature matrix
training_df = create_features(customers_df, tours_df, interactions_df)

# Preprocess features
X, y = preprocess_features(training_df)
\`\`\`

### 3. Model Training
\`\`\`python
# Split data 80/20
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train Random Forest
model.fit(X_train, y_train)
\`\`\`

### 4. Evaluation Metrics
- **MSE**: Mean Squared Error
- **MAE**: Mean Absolute Error
- **Feature Importance**: Which features matter most

## Improving the Model

### 1. Collect Real Data
Replace synthetic data with actual customer interactions:

\`\`\`javascript
// Track user interactions
fetch('/api/analytics', {
  method: 'POST',
  body: JSON.stringify({
    action: 'click',
    userId: customerId,
    tourId: tourId,
    sessionDuration: timeSpent,
    deviceType: navigator.userAgent
  })
})
\`\`\`

### 2. A/B Testing
Test different recommendation algorithms:

\`\`\`python
# Test different models
models = {
    'random_forest': RandomForestRegressor(),
    'gradient_boost': GradientBoostingRegressor(),
    'neural_network': MLPRegressor()
}

# Compare performance
for name, model in models.items():
    score = cross_val_score(model, X, y, cv=5)
    print(f"{name}: {score.mean():.4f} (+/- {score.std() * 2:.4f})")
\`\`\`

### 3. Feature Engineering
Add new features based on domain knowledge:

\`\`\`python
# Seasonal preferences
features['season_match'] = get_season_match(customer, tour)

# Price sensitivity
features['price_sensitivity'] = customer['budget'] / customer['previous_avg_spend']

# Social proof
features['popularity_score'] = tour['booking_count'] / tour['view_count']
\`\`\`

### 4. Deep Learning Approach
For larger datasets, consider neural networks:

\`\`\`python
import tensorflow as tf

# Neural collaborative filtering
def create_ncf_model(num_users, num_tours, embedding_size=50):
    user_input = tf.keras.Input(shape=(), name='user_id')
    tour_input = tf.keras.Input(shape=(), name='tour_id')
    
    user_embedding = tf.keras.layers.Embedding(num_users, embedding_size)(user_input)
    tour_embedding = tf.keras.layers.Embedding(num_tours, embedding_size)(tour_input)
    
    # Concatenate and add dense layers
    concat = tf.keras.layers.Concatenate()([user_embedding, tour_embedding])
    dense1 = tf.keras.layers.Dense(128, activation='relu')(concat)
    dense2 = tf.keras.layers.Dense(64, activation='relu')(dense1)
    output = tf.keras.layers.Dense(1, activation='sigmoid')(dense2)
    
    model = tf.keras.Model(inputs=[user_input, tour_input], outputs=output)
    return model
\`\`\`

## Production Integration

### 1. Model Serving
\`\`\`python
# Load trained model
ml_model = TourRecommendationML()
ml_model.load_model('models/recommendation_model.pkl')

# Get predictions
score = ml_model.predict_recommendation_score(customer_features, tour_features)
\`\`\`

### 2. Real-time Recommendations
\`\`\`python
# In your API route
def get_ml_recommendations(customer_preferences, available_tours):
    scores = []
    
    for tour in available_tours:
        score = ml_model.predict_recommendation_score(
            customer_preferences, 
            tour
        )
        scores.append((tour, score))
    
    # Sort by score and return top 3
    return sorted(scores, key=lambda x: x[1], reverse=True)[:3]
\`\`\`

### 3. Continuous Learning
\`\`\`python
# Retrain model weekly with new data
def retrain_model():
    # Load new interaction data
    new_interactions = load_recent_interactions()
    
    # Combine with existing training data
    combined_data = combine_training_data(existing_data, new_interactions)
    
    # Retrain model
    ml_model.train(combined_data)
    
    # Save updated model
    ml_model.save_model(f'models/model_{datetime.now().strftime("%Y%m%d")}.pkl')
\`\`\`

## Monitoring and Evaluation

### 1. Recommendation Quality Metrics
- **Click-through Rate (CTR)**: Percentage of recommendations clicked
- **Conversion Rate**: Percentage of recommendations leading to bookings
- **Diversity**: How varied are the recommendations
- **Coverage**: Percentage of tours being recommended

### 2. Business Metrics
- **Revenue per Recommendation**: Average booking value from recommendations
- **Customer Satisfaction**: Ratings of recommended tours
- **Repeat Bookings**: Customers returning for more recommendations

### 3. Model Performance Monitoring
\`\`\`python
# Track model performance over time
def monitor_model_performance():
    recent_predictions = get_recent_predictions()
    actual_outcomes = get_actual_outcomes()
    
    current_mse = mean_squared_error(actual_outcomes, recent_predictions)
    
    if current_mse > baseline_mse * 1.2:  # 20% degradation
        trigger_model_retrain()
\`\`\`

## Advanced Techniques

### 1. Matrix Factorization
\`\`\`python
from sklearn.decomposition import NMF

# Create user-item matrix
user_item_matrix = create_interaction_matrix(customers, tours, interactions)

# Apply Non-negative Matrix Factorization
nmf = NMF(n_components=50, random_state=42)
user_factors = nmf.fit_transform(user_item_matrix)
item_factors = nmf.components_
\`\`\`

### 2. Graph Neural Networks
\`\`\`python
# For complex relationship modeling
import torch_geometric

# Create customer-tour interaction graph
edge_index = create_interaction_graph(customers, tours, interactions)

# Apply Graph Convolutional Network
class TourGCN(torch.nn.Module):
    def __init__(self, num_features, hidden_dim):
        super().__init__()
        self.conv1 = GCNConv(num_features, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, 1)
    
    def forward(self, x, edge_index):
        x = F.relu(self.conv1(x, edge_index))
        x = self.conv2(x, edge_index)
        return x
\`\`\`

### 3. Multi-Armed Bandits
\`\`\`python
# For exploration vs exploitation
class EpsilonGreedyRecommender:
    def __init__(self, epsilon=0.1):
        self.epsilon = epsilon
        self.tour_rewards = {}
    
    def recommend(self, customer, available_tours):
        if random.random() < self.epsilon:
            # Explore: random recommendation
            return random.choice(available_tours)
        else:
            # Exploit: best known recommendation
            return max(available_tours, key=lambda t: self.tour_rewards.get(t.id, 0))
    
    def update_reward(self, tour_id, reward):
        if tour_id not in self.tour_rewards:
            self.tour_rewards[tour_id] = []
        self.tour_rewards[tour_id].append(reward)
\`\`\`

## Conclusion

This ML training guide provides a comprehensive framework for building and improving the Tekiki Tours recommendation system. Start with the basic Random Forest model and gradually incorporate more sophisticated techniques as you collect real user data.

Remember to:
1. **Start Simple**: Begin with basic collaborative filtering
2. **Collect Data**: Real user interactions are crucial
3. **Iterate Quickly**: Regular model updates improve performance
4. **Monitor Performance**: Track both technical and business metrics
5. **A/B Test**: Compare different approaches with real users

The recommendation system will improve over time as it learns from actual customer behavior and preferences.
