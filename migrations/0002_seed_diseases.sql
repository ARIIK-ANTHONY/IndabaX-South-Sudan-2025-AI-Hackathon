-- Seed data for diseases table
-- Contains information about the 6 blood diseases the AI can predict

INSERT INTO diseases (name, description, symptoms, causes, treatments, preventions, risk_factors, category, severity) VALUES
(
    'Healthy',
    'Normal blood values with no disease indicators',
    ARRAY['No symptoms', 'Normal energy levels', 'Good overall health'],
    ARRAY['Balanced lifestyle', 'Regular exercise', 'Proper nutrition'],
    ARRAY['Maintain healthy lifestyle', 'Regular check-ups', 'Balanced diet'],
    ARRAY['Regular exercise', 'Balanced diet', 'Adequate sleep', 'Stress management'],
    ARRAY['Sedentary lifestyle', 'Poor diet', 'Lack of sleep'],
    'Normal',
    'None'
),
(
    'Diabetes',
    'A group of metabolic disorders characterized by high blood sugar levels',
    ARRAY['Frequent urination', 'Increased thirst', 'Unexplained weight loss', 'Fatigue', 'Blurred vision'],
    ARRAY['Insulin resistance', 'Genetics', 'Obesity', 'Sedentary lifestyle', 'Age'],
    ARRAY['Insulin therapy', 'Oral medications', 'Diet modification', 'Regular exercise', 'Blood glucose monitoring'],
    ARRAY['Maintain healthy weight', 'Regular physical activity', 'Balanced diet', 'Avoid refined sugars'],
    ARRAY['Family history', 'Obesity', 'Age over 45', 'Sedentary lifestyle', 'High blood pressure'],
    'Metabolic',
    'Moderate to High'
),
(
    'Anemia',
    'A condition where the blood lacks enough healthy red blood cells or hemoglobin',
    ARRAY['Fatigue', 'Weakness', 'Pale skin', 'Shortness of breath', 'Dizziness', 'Cold hands and feet'],
    ARRAY['Iron deficiency', 'Vitamin deficiency', 'Chronic diseases', 'Blood loss', 'Genetic disorders'],
    ARRAY['Iron supplements', 'Vitamin supplements', 'Dietary changes', 'Treatment of underlying causes'],
    ARRAY['Iron-rich diet', 'Vitamin C intake', 'Regular medical check-ups', 'Manage chronic conditions'],
    ARRAY['Poor diet', 'Menstruation', 'Pregnancy', 'Chronic kidney disease', 'Family history'],
    'Hematologic',
    'Mild to Moderate'
),
(
    'Thalassemia',
    'An inherited blood disorder that affects the production of hemoglobin',
    ARRAY['Fatigue', 'Weakness', 'Pale skin', 'Facial bone deformities', 'Slow growth', 'Abdominal swelling'],
    ARRAY['Genetic mutations', 'Inherited from parents', 'Alpha or beta globin gene defects'],
    ARRAY['Blood transfusions', 'Chelation therapy', 'Bone marrow transplant', 'Folic acid supplements'],
    ARRAY['Genetic counseling', 'Carrier screening', 'Prenatal diagnosis'],
    ARRAY['Mediterranean ancestry', 'Asian ancestry', 'African ancestry', 'Family history'],
    'Genetic',
    'Moderate to Severe'
),
(
    'Thrombocytopenia',
    'A condition characterized by low platelet count in the blood',
    ARRAY['Easy bruising', 'Excessive bleeding', 'Petechial rash', 'Prolonged bleeding from cuts', 'Heavy menstrual periods'],
    ARRAY['Immune system disorders', 'Medications', 'Infections', 'Bone marrow disorders', 'Enlarged spleen'],
    ARRAY['Platelet transfusions', 'Medications to increase platelet production', 'Splenectomy', 'Immunosuppressive therapy'],
    ARRAY['Avoid medications that affect platelets', 'Manage underlying conditions', 'Protective measures to prevent injury'],
    ARRAY['Autoimmune disorders', 'Certain medications', 'Viral infections', 'Bone marrow diseases'],
    'Hematologic',
    'Moderate to High'
),
(
    'Heart Disease',
    'Various conditions that affect the heart and blood vessels',
    ARRAY['Chest pain', 'Shortness of breath', 'Fatigue', 'Irregular heartbeat', 'Swelling in legs and feet'],
    ARRAY['High cholesterol', 'High blood pressure', 'Smoking', 'Diabetes', 'Obesity', 'Family history'],
    ARRAY['Lifestyle changes', 'Medications', 'Medical procedures', 'Surgery', 'Cardiac rehabilitation'],
    ARRAY['Healthy diet', 'Regular exercise', 'No smoking', 'Limit alcohol', 'Stress management', 'Regular check-ups'],
    ARRAY['Age', 'Gender', 'Family history', 'Smoking', 'High cholesterol', 'High blood pressure', 'Diabetes'],
    'Cardiovascular',
    'High'
);
