
from flask import Flask, request, jsonify, render_template
import numpy as np
import joblib

app = Flask(__name__)

# Load the pre-trained model
model = joblib.load('admission_model.pkl')

@app.route('/')
def index():
    return render_template('site.html')  # Serves the HTML frontend

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    try:
        # Extract and parse input data
        gre = float(data['gre'])
        toefl = float(data['toefl'])
        university_rating = float(data['university_rating'])
        sop = float(data['sop'])
        lor = float(data['lor'])
        cgpa = float(data['cgpa'])
        research = int(data['research'])

        # Prepare input for prediction
        features = np.array([[gre, toefl, university_rating, sop, lor, cgpa, research]])
        prediction = model.predict(features)[0]

        # Generate suggestions based on inputs
        suggestions = []

        if gre < 310:
            suggestions.append('Consider retaking the GRE to improve your score.')
        if toefl < 100:
            suggestions.append('Improving your TOEFL score can strengthen your language proficiency profile.')
        if university_rating < 3:
            suggestions.append('Aim for higher-rated universities or build a stronger profile to qualify.')
        if sop < 3:
            suggestions.append('Work on making your Statement of Purpose more compelling and focused.')
        if lor < 3:
            suggestions.append('Request stronger Letters of Recommendation from influential or academic mentors.')
        if cgpa < 8:
            suggestions.append('If possible, improve your academic grades or highlight academic excellence in your SOP.')
        if research == 0:
            suggestions.append('Engage in research projects or publish papers to add credibility to your application.')

        # Return prediction and suggestions
        return jsonify({
            'admission_chance': round(prediction, 2),
            'suggestions': suggestions
        })

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
