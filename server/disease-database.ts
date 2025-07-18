// Medical Information Database
export interface DiseaseInfo {
  name: string;
  causes: string[];
  symptoms: string[];
  treatments: string[];
  preventions: string[];
  description: string;
  riskFactors: string[];
  complications: string[];
  diagnosticTests: string[];
}

export const diseaseDatabase: Record<string, DiseaseInfo> = {
  'Diabetes': {
    name: 'Diabetes',
    description: 'A group of metabolic disorders characterized by high blood sugar levels over a prolonged period.',
    causes: [
      'Type 1: Autoimmune destruction of pancreatic beta cells',
      'Type 2: Insulin resistance and relative insulin deficiency',
      'Genetic predisposition',
      'Environmental factors',
      'Obesity and sedentary lifestyle'
    ],
    symptoms: [
      'Excessive thirst (polydipsia)',
      'Frequent urination (polyuria)',
      'Unexplained weight loss',
      'Increased hunger',
      'Fatigue and weakness',
      'Blurred vision',
      'Slow-healing wounds',
      'Frequent infections'
    ],
    treatments: [
      'Insulin therapy (Type 1 and advanced Type 2)',
      'Oral medications (metformin, sulfonylureas, DPP-4 inhibitors)',
      'GLP-1 receptor agonists',
      'SGLT2 inhibitors',
      'Blood glucose monitoring',
      'Dietary management',
      'Regular exercise',
      'Weight management'
    ],
    preventions: [
      'Maintain healthy weight',
      'Regular physical activity (150 minutes/week)',
      'Balanced diet low in processed foods',
      'Limit refined sugars and carbohydrates',
      'Regular health screenings',
      'Avoid smoking',
      'Limit alcohol consumption',
      'Manage stress effectively'
    ],
    riskFactors: [
      'Family history of diabetes',
      'Obesity',
      'Age over 45',
      'Sedentary lifestyle',
      'High blood pressure',
      'High cholesterol',
      'Gestational diabetes history',
      'Polycystic ovary syndrome (PCOS)'
    ],
    complications: [
      'Diabetic nephropathy (kidney disease)',
      'Diabetic retinopathy (eye disease)',
      'Diabetic neuropathy (nerve damage)',
      'Cardiovascular disease',
      'Stroke',
      'Foot ulcers and amputations',
      'Skin infections',
      'Dental problems'
    ],
    diagnosticTests: [
      'Fasting blood glucose',
      'HbA1c (glycated hemoglobin)',
      'Oral glucose tolerance test',
      'Random blood glucose',
      'Urine glucose test',
      'C-peptide test',
      'Autoantibody tests (Type 1)'
    ]
  },
  
  'Anemia': {
    name: 'Anemia',
    description: 'A condition characterized by a decrease in the number of red blood cells or hemoglobin concentration.',
    causes: [
      'Iron deficiency (most common)',
      'Vitamin B12 deficiency',
      'Folate deficiency',
      'Chronic diseases (kidney disease, cancer)',
      'Blood loss (menstruation, GI bleeding)',
      'Hemolytic disorders',
      'Bone marrow disorders',
      'Genetic conditions'
    ],
    symptoms: [
      'Fatigue and weakness',
      'Pale skin, nails, and inner eyelids',
      'Shortness of breath',
      'Dizziness or lightheadedness',
      'Cold hands and feet',
      'Brittle or spoon-shaped nails',
      'Rapid or irregular heartbeat',
      'Headaches',
      'Restless leg syndrome'
    ],
    treatments: [
      'Iron supplements (for iron deficiency)',
      'Vitamin B12 injections or supplements',
      'Folate supplements',
      'Dietary changes to include iron-rich foods',
      'Treatment of underlying conditions',
      'Blood transfusions (severe cases)',
      'Erythropoietin injections',
      'Bone marrow transplant (severe cases)'
    ],
    preventions: [
      'Iron-rich diet (red meat, spinach, legumes)',
      'Vitamin C to enhance iron absorption',
      'Avoid tea/coffee with iron-rich meals',
      'Regular health check-ups',
      'Manage heavy menstrual periods',
      'Treat underlying conditions promptly',
      'Avoid excessive blood donations',
      'Prenatal vitamins during pregnancy'
    ],
    riskFactors: [
      'Women of childbearing age',
      'Vegetarian or vegan diet',
      'Chronic diseases',
      'Heavy menstrual periods',
      'Pregnancy',
      'Frequent blood donation',
      'Gastrointestinal disorders',
      'Age over 65'
    ],
    complications: [
      'Heart problems (enlarged heart, heart failure)',
      'Severe fatigue affecting daily activities',
      'Pregnancy complications',
      'Restless leg syndrome',
      'Delayed growth in children',
      'Increased infection risk',
      'Cognitive impairment',
      'Depression'
    ],
    diagnosticTests: [
      'Complete blood count (CBC)',
      'Hemoglobin and hematocrit levels',
      'Iron studies (ferritin, TIBC, transferrin)',
      'Vitamin B12 and folate levels',
      'Reticulocyte count',
      'Peripheral blood smear',
      'Bone marrow biopsy (if needed)',
      'Stool test for blood'
    ]
  },
  
  'Thrombocytopenia': {
    name: 'Thrombocytopenia',
    description: 'A condition characterized by abnormally low platelet count, leading to increased bleeding risk.',
    causes: [
      'Autoimmune destruction of platelets (ITP)',
      'Bone marrow disorders',
      'Medications (heparin, quinine, antibiotics)',
      'Viral infections (HIV, hepatitis, dengue)',
      'Chemotherapy and radiation',
      'Liver disease',
      'Spleen enlargement',
      'Genetic conditions'
    ],
    symptoms: [
      'Easy bruising',
      'Prolonged bleeding from cuts',
      'Petechiae (small red spots on skin)',
      'Purpura (purple bruises)',
      'Nosebleeds',
      'Bleeding gums',
      'Heavy menstrual periods',
      'Blood in urine or stool',
      'Fatigue'
    ],
    treatments: [
      'Corticosteroids (prednisolone)',
      'Immunoglobulin therapy (IVIG)',
      'Platelet transfusions (severe cases)',
      'Immunosuppressive drugs',
      'Splenectomy (removal of spleen)',
      'Thrombopoietin receptor agonists',
      'Rituximab (monoclonal antibody)',
      'Treatment of underlying causes'
    ],
    preventions: [
      'Avoid medications that affect platelets',
      'Prevent infections through vaccination',
      'Avoid contact sports and high-risk activities',
      'Use soft toothbrush and electric razor',
      'Wear protective gear during activities',
      'Regular monitoring if on medications',
      'Prompt treatment of infections',
      'Avoid alcohol excess'
    ],
    riskFactors: [
      'Autoimmune diseases',
      'Viral infections',
      'Pregnancy',
      'Certain medications',
      'Cancer and cancer treatments',
      'Liver disease',
      'Genetic predisposition',
      'Age (more common in children and elderly)'
    ],
    complications: [
      'Severe bleeding episodes',
      'Intracranial hemorrhage',
      'Gastrointestinal bleeding',
      'Postoperative bleeding',
      'Pregnancy complications',
      'Delayed wound healing',
      'Anemia from blood loss',
      'Emergency situations requiring immediate care'
    ],
    diagnosticTests: [
      'Complete blood count with platelet count',
      'Peripheral blood smear',
      'Bone marrow biopsy',
      'Antiplatelet antibody tests',
      'Coagulation studies',
      'Liver function tests',
      'Viral infection screening',
      'Autoimmune markers'
    ]
  },
  
  'Thalassemia': {
    name: 'Thalassemia',
    description: 'A group of inherited blood disorders that affect hemoglobin production, leading to anemia.',
    causes: [
      'Genetic mutations in alpha or beta globin genes',
      'Inherited from one or both parents',
      'Alpha thalassemia (chromosome 16)',
      'Beta thalassemia (chromosome 11)',
      'Consanguineous marriages increase risk',
      'Ethnic predisposition (Mediterranean, Asian, African)',
      'Carrier state transmission',
      'Spontaneous mutations (rare)'
    ],
    symptoms: [
      'Fatigue and weakness',
      'Pale or yellowish skin',
      'Facial bone deformities',
      'Slow growth and development',
      'Abdominal swelling (enlarged spleen)',
      'Dark urine',
      'Bone problems',
      'Heart problems',
      'Delayed puberty'
    ],
    treatments: [
      'Regular blood transfusions',
      'Iron chelation therapy',
      'Folic acid supplements',
      'Bone marrow transplant (cure for severe cases)',
      'Gene therapy (experimental)',
      'Splenectomy (if enlarged spleen)',
      'Supportive care for complications',
      'Vaccination against infections'
    ],
    preventions: [
      'Genetic counseling before pregnancy',
      'Carrier screening for at-risk populations',
      'Prenatal diagnosis (chorionic villus sampling)',
      'Family planning counseling',
      'Population screening programs',
      'Avoid consanguineous marriages',
      'Preimplantation genetic diagnosis',
      'Education about inheritance patterns'
    ],
    riskFactors: [
      'Family history of thalassemia',
      'Mediterranean ancestry',
      'Middle Eastern ancestry',
      'Asian ancestry',
      'African ancestry',
      'Consanguineous parents',
      'Carrier parents',
      'Certain ethnic groups'
    ],
    complications: [
      'Iron overload from transfusions',
      'Heart failure',
      'Liver disease',
      'Endocrine problems',
      'Bone disease',
      'Delayed growth and puberty',
      'Increased infection risk',
      'Gallstones',
      'Leg ulcers'
    ],
    diagnosticTests: [
      'Hemoglobin electrophoresis',
      'Complete blood count',
      'DNA analysis',
      'Hemoglobin F (fetal hemoglobin) levels',
      'Iron studies',
      'Peripheral blood smear',
      'Genetic testing',
      'Prenatal testing'
    ]
  },
  
  'Heart Disease': {
    name: 'Heart Disease',
    description: 'A broad term for conditions affecting the heart and blood vessels, including coronary artery disease.',
    causes: [
      'Atherosclerosis (plaque buildup in arteries)',
      'High blood pressure',
      'High cholesterol',
      'Diabetes',
      'Smoking',
      'Obesity',
      'Sedentary lifestyle',
      'Genetic factors',
      'Age and gender'
    ],
    symptoms: [
      'Chest pain or discomfort',
      'Shortness of breath',
      'Fatigue',
      'Irregular heartbeat',
      'Dizziness',
      'Nausea',
      'Sweating',
      'Pain in arms, neck, jaw, or back',
      'Swelling in legs, ankles, or feet'
    ],
    treatments: [
      'Lifestyle modifications (diet, exercise)',
      'Medications (statins, ACE inhibitors, beta-blockers)',
      'Antiplatelet therapy (aspirin, clopidogrel)',
      'Cardiac catheterization and stenting',
      'Coronary artery bypass surgery',
      'Cardiac rehabilitation',
      'Implantable devices (pacemaker, ICD)',
      'Heart transplant (end-stage disease)'
    ],
    preventions: [
      'Healthy diet (low saturated fat, low sodium)',
      'Regular exercise (150 minutes/week)',
      'Maintain healthy weight',
      'Quit smoking',
      'Limit alcohol consumption',
      'Manage stress',
      'Control blood pressure',
      'Control cholesterol levels',
      'Manage diabetes',
      'Regular health screenings'
    ],
    riskFactors: [
      'High blood pressure',
      'High cholesterol',
      'Diabetes',
      'Smoking',
      'Obesity',
      'Sedentary lifestyle',
      'Family history',
      'Age (men >45, women >55)',
      'Chronic stress',
      'Excessive alcohol use'
    ],
    complications: [
      'Heart attack (myocardial infarction)',
      'Heart failure',
      'Stroke',
      'Arrhythmias',
      'Sudden cardiac death',
      'Peripheral artery disease',
      'Aortic aneurysm',
      'Cardiomyopathy',
      'Valve problems'
    ],
    diagnosticTests: [
      'Electrocardiogram (ECG)',
      'Echocardiogram',
      'Stress test',
      'Cardiac catheterization',
      'CT angiography',
      'Blood tests (troponins, BNP)',
      'Chest X-ray',
      'Holter monitor',
      'Lipid profile'
    ]
  },
  
  'Healthy': {
    name: 'Healthy Blood Profile',
    description: 'Normal blood parameters indicating good health status with no detected abnormalities.',
    causes: [
      'Balanced diet and nutrition',
      'Regular physical activity',
      'Adequate sleep',
      'Stress management',
      'Hydration',
      'Avoiding harmful substances',
      'Regular health monitoring',
      'Genetic factors'
    ],
    symptoms: [
      'Good energy levels',
      'Normal appetite',
      'Healthy skin color',
      'Regular sleep patterns',
      'Stable mood',
      'No unusual fatigue',
      'Normal healing',
      'Good exercise tolerance'
    ],
    treatments: [
      'Maintain current healthy lifestyle',
      'Continue regular exercise',
      'Balanced nutrition',
      'Adequate hydration',
      'Sufficient sleep',
      'Stress management',
      'Regular health check-ups',
      'Preventive care'
    ],
    preventions: [
      'Maintain healthy diet',
      'Regular exercise',
      'Avoid smoking',
      'Limit alcohol',
      'Manage stress',
      'Get adequate sleep',
      'Regular health screenings',
      'Stay hydrated',
      'Maintain healthy weight',
      'Follow preventive care guidelines'
    ],
    riskFactors: [
      'Age-related changes',
      'Family history',
      'Environmental factors',
      'Lifestyle changes',
      'Occupational hazards',
      'Chronic stress',
      'Poor nutrition',
      'Sedentary lifestyle'
    ],
    complications: [
      'None currently detected',
      'Risk of developing conditions with age',
      'Importance of continued monitoring',
      'Preventive care recommendations'
    ],
    diagnosticTests: [
      'Complete blood count',
      'Comprehensive metabolic panel',
      'Lipid profile',
      'Thyroid function tests',
      'Vitamin levels',
      'Inflammatory markers',
      'Hemoglobin A1c',
      'Liver function tests'
    ]
  }
};

// Helper function to get disease information
export function getDiseaseInfo(diseaseName: string): DiseaseInfo | null {
  return diseaseDatabase[diseaseName] || null;
}

// Helper function to get all diseases
export function getAllDiseases(): string[] {
  return Object.keys(diseaseDatabase);
}
