import joblib
import numpy as np
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, '..', 'model', 'infaltion_model.joblib')
dataset_path =  os.path.join(current_dir, '..', 'model', 'inflation_prediciton_dataset')

class InflationCalculator:
    inflation_model = joblib.load(model_path)

    def __init__(self) -> None:
        self.historic_inflation = None
        with open(dataset_path, 'r') as f:
            infaltions = []
            for line in f.readlines():
                year, inflation = line.split(':')
                year = int(year)
                inflation = np.float64(inflation.strip()[:-1])
                infaltions.append(inflation)
            
            self.historic_inflation = np.array(infaltions)
            

    def predict_infaltion(self, until_retirement):
        current_data = self.historic_inflation.copy()

        for _ in range(until_retirement):
            X = current_data.reshape(1, -1)
            
            prediction = self.inflation_model.predict(X)
            next_inflation = prediction[0]
            
            current_data = np.roll(current_data, -1)
            current_data[-1] = next_inflation
            
            yield next_inflation

    
if __name__ == "__main__":
    calc = InflationCalculator(30)
    print(calc.predict_infaltion())