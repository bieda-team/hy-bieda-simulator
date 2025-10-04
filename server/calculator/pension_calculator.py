import joblib 
import os 
from dataclasses import dataclass
import pandas as pd
import numpy as np

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, '..', 'model', 'rf_estimator')
mapping_path  = os.path.join(current_dir, '..', 'model', 'mapping.csv')

@dataclass
class PensionPredictionInput:
    Age: int 
    Workclass: str 
    Fnlwgt: int 
    Education: str 
    EducationNum: int
    MaritalStatus: str 
    Occupation: str 
    Relationship: str
    Race: str 
    Sex: str
    CapitalGain: int 
    CapitalLoss: int 
    HoursPerWeek: int 
    Income: str 
    NativeCountry: str = 'Poland'

def get_mapping(df: pd.DataFrame, feature, value):
    mask = (df['column'] == feature) & (df['category'] == value)
    mapping = df[mask]['encoded_value']
    
    if len(mapping) == 0:
        default_mask = (df['column'] == feature) & (df['category'] == '?')
        default_mapping = df[default_mask]['encoded_value']
        
        if len(default_mapping) > 0:
            return default_mapping.values[0]
        else:
            available_values = df[df['column'] == feature]['category'].tolist()
            raise ValueError(
                f"Value '{value}' not found for feature '{feature}'. "
                f"Available values: {available_values}"
            )
    
    return mapping.values[0]


class PensionCalculator:
    model = joblib.load(model_path)

    def __init__(self) -> None:
        self.mapping_df = pd.read_csv(mapping_path)

    def map_to_array(self, prediction_input: PensionPredictionInput):
        try:
            array_data = [
                int(prediction_input.Age),
                int(get_mapping(self.mapping_df, 'workclass', prediction_input.Workclass)),
                int(prediction_input.Fnlwgt),
                int(get_mapping(self.mapping_df, 'education', prediction_input.Education)),
                int(prediction_input.EducationNum),
                int(get_mapping(self.mapping_df, 'marital.status', prediction_input.MaritalStatus)),
                int(get_mapping(self.mapping_df, 'occupation', prediction_input.Occupation)),
                int(get_mapping(self.mapping_df, 'relationship', prediction_input.Relationship)),
                int(get_mapping(self.mapping_df, 'race', prediction_input.Race)),
                int(get_mapping(self.mapping_df, 'sex', prediction_input.Sex)),
                int(prediction_input.CapitalGain),
                int(prediction_input.CapitalLoss),
                int(prediction_input.HoursPerWeek),
                int(get_mapping(self.mapping_df, 'native.country', prediction_input.NativeCountry)),
                int(get_mapping(self.mapping_df, 'income', prediction_input.Income))
            ]
            
            return np.array(array_data, dtype=np.float64).reshape(1, -1)
            
        except Exception as e:
            print(f"Error creating array: {e}")
            raise

    def predict(self, prediction_input: PensionPredictionInput):
        input_array = self.map_to_array(prediction_input)
        prediction = self.model.predict(input_array)[0]
        
        pension_mapping = {
            0: 'High',
            1: 'Low', 
            2: 'Medium'
        }
        return pension_mapping.get(prediction, 'Unknown')

if __name__ == "__main__":
    pc = PensionCalculator()

    sample_input = PensionPredictionInput(
        Age=35,
        Workclass='Never-worked',
        Fnlwgt=200000,
        Education='Bachelors',
        EducationNum=13,
        MaritalStatus='Never-married',
        Occupation='Prof-specialty',
        Relationship='Not-in-family',
        Race='White',
        Sex='Male',
        CapitalGain=0,
        CapitalLoss=0,
        HoursPerWeek=40,
        Income='<=50K',
        NativeCountry='United-States'
    )
    
    input_array = pc.map_to_array(sample_input)
    print(input_array)
    
    prediction = pc.predict(sample_input)
    print(f"Predicted pension category: {prediction}")