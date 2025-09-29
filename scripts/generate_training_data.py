import json
import random
from datetime import datetime, timedelta
import csv

# Generate synthetic training data for ML recommendation system
def generate_customer_data(num_customers=1000):
    """Generate synthetic customer data for training"""
    
    interests_pool = [
        'beach', 'culture', 'adventure', 'nature', 'food', 
        'nightlife', 'photography', 'wellness', 'history', 
        'architecture', 'shopping', 'sports', 'music', 'art'
    ]
    
    travel_styles = ['Budget-friendly', 'Mid-range comfort', 'Luxury experience']
    
    customers = []
    
    for i in range(num_customers):
        # Generate realistic customer preferences
        budget = random.choice([
            random.randint(200, 800),    # Budget travelers
            random.randint(800, 2000),   # Mid-range
            random.randint(2000, 5000)   # Luxury
        ])
        
        duration = random.choice([1, 2, 3, 4, 5, 7, 10, 14])
        
        # Select 2-5 interests per customer
        num_interests = random.randint(2, 5)
        interests = random.sample(interests_pool, num_interests)
        
        travel_style = random.choice(travel_styles)
        group_size = random.choice([1, 2, 3, 4, 5, 6, 8])
        
        customer = {
            'id': f'customer_{i+1}',
            'budget': budget,
            'duration': duration,
            'interests': interests,
            'travel_style': travel_style,
            'group_size': group_size,
            'age_group': random.choice(['18-25', '26-35', '36-45', '46-55', '55+']),
            'nationality': random.choice(['Tunisian', 'French', 'German', 'Italian', 'American', 'British']),
            'previous_bookings': random.randint(0, 5)
        }
        
        customers.append(customer)
    
    return customers

def generate_tour_interaction_data(customers, tours, num_interactions=5000):
    """Generate synthetic interaction data (views, clicks, bookings)"""
    
    interactions = []
    
    for i in range(num_interactions):
        customer = random.choice(customers)
        tour = random.choice(tours)
        
        # Calculate interaction probability based on preference matching
        interaction_score = calculate_preference_match(customer, tour)
        
        # Generate different types of interactions based on score
        if random.random() < interaction_score:
            interaction_type = random.choices(
                ['view', 'click', 'favorite', 'booking'],
                weights=[0.5, 0.3, 0.15, 0.05]
            )[0]
            
            interaction = {
                'customer_id': customer['id'],
                'tour_id': tour['id'],
                'interaction_type': interaction_type,
                'timestamp': datetime.now() - timedelta(days=random.randint(0, 365)),
                'session_duration': random.randint(30, 600),  # seconds
                'device_type': random.choice(['mobile', 'desktop', 'tablet']),
                'rating': random.randint(3, 5) if interaction_type == 'booking' else None
            }
            
            interactions.append(interaction)
    
    return interactions

def calculate_preference_match(customer, tour):
    """Calculate how well a tour matches customer preferences"""
    score = 0.0
    
    # Budget matching
    budget_per_day = customer['budget'] / customer['duration']
    if tour['price'] <= budget_per_day:
        score += 0.3
    elif tour['price'] <= budget_per_day * 1.2:
        score += 0.15
    
    # Duration matching
    if tour['duration'] <= customer['duration']:
        score += 0.2
    
    # Interest matching
    matching_interests = len(set(customer['interests']) & set(tour['tags']))
    score += (matching_interests / len(customer['interests'])) * 0.3
    
    # Group size matching
    if customer['group_size'] >= tour['group_size']['min'] and customer['group_size'] <= tour['group_size']['max']:
        score += 0.2
    
    return min(score, 1.0)

def generate_sample_tours():
    """Generate sample tour data for training"""
    
    tours = [
        {
            'id': 'tour_1',
            'name': 'Sidi Bou Said Cultural Walk',
            'price': 120,
            'duration': 1,
            'category': 'Cultural',
            'tags': ['culture', 'photography', 'architecture', 'history'],
            'group_size': {'min': 2, 'max': 15},
            'rating': 4.8,
            'difficulty': 'easy'
        },
        {
            'id': 'tour_2',
            'name': 'Sahara Desert Adventure',
            'price': 450,
            'duration': 3,
            'category': 'Adventure',
            'tags': ['adventure', 'desert', 'camping', 'nature'],
            'group_size': {'min': 4, 'max': 12},
            'rating': 4.9,
            'difficulty': 'moderate'
        },
        {
            'id': 'tour_3',
            'name': 'Tunis Medina Discovery',
            'price': 60,
            'duration': 0.5,
            'category': 'Cultural',
            'tags': ['culture', 'history', 'shopping', 'food'],
            'group_size': {'min': 1, 'max': 20},
            'rating': 4.6,
            'difficulty': 'easy'
        },
        {
            'id': 'tour_4',
            'name': 'Hammamet Beach Retreat',
            'price': 180,
            'duration': 1,
            'category': 'Beach',
            'tags': ['beach', 'wellness', 'relaxation'],
            'group_size': {'min': 2, 'max': 10},
            'rating': 4.7,
            'difficulty': 'easy'
        },
        {
            'id': 'tour_5',
            'name': 'Kairouan Pilgrimage',
            'price': 100,
            'duration': 1,
            'category': 'Cultural',
            'tags': ['culture', 'religion', 'history', 'architecture'],
            'group_size': {'min': 3, 'max': 25},
            'rating': 4.5,
            'difficulty': 'easy'
        }
    ]
    
    return tours

def save_training_data():
    """Generate and save all training data"""
    
    print("Generating synthetic training data...")
    
    # Generate data
    customers = generate_customer_data(1000)
    tours = generate_sample_tours()
    interactions = generate_tour_interaction_data(customers, tours, 5000)
    
    # Save to JSON files
    with open('training_data/customers.json', 'w') as f:
        json.dump(customers, f, indent=2, default=str)
    
    with open('training_data/tours.json', 'w') as f:
        json.dump(tours, f, indent=2)
    
    with open('training_data/interactions.json', 'w') as f:
        json.dump(interactions, f, indent=2, default=str)
    
    # Save to CSV for easier analysis
    with open('training_data/customers.csv', 'w', newline='') as f:
        if customers:
            writer = csv.DictWriter(f, fieldnames=customers[0].keys())
            writer.writeheader()
            for customer in customers:
                # Convert lists to strings for CSV
                row = customer.copy()
                row['interests'] = ','.join(customer['interests'])
                writer.writerow(row)
    
    with open('training_data/interactions.csv', 'w', newline='') as f:
        if interactions:
            writer = csv.DictWriter(f, fieldnames=interactions[0].keys())
            writer.writeheader()
            writer.writerows(interactions)
    
    print(f"Generated {len(customers)} customers, {len(tours)} tours, {len(interactions)} interactions")
    print("Training data saved to training_data/ directory")

if __name__ == "__main__":
    import os
    os.makedirs('training_data', exist_ok=True)
    save_training_data()
