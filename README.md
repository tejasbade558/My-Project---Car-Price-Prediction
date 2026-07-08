# Car Price Prediction using Machine Learning

## Overview

This project predicts the resale price of used cars based on key vehicle attributes such as age, fuel type, transmission type, kilometers driven, and other specifications.

The objective was to build a complete Machine Learning pipeline — from raw data to a working price prediction model — covering data cleaning, exploratory analysis, feature engineering, model training, and evaluation.

---

## Project Workflow

Raw Dataset (Used Car Listings)
|
v
Data Cleaning & Preprocessing
|
v
Exploratory Data Analysis (EDA)
|
v
Feature Engineering
|
v
Model Training (Regression Algorithms)
|
v
Model Evaluation & Price Prediction

---

## Data Preprocessing

Handled missing values, removed duplicates, and standardized categorical fields such as fuel type and transmission.

Key steps:
- Null value treatment
- Outlier detection on price and kilometers driven
- Encoding categorical variables (Label/One-Hot Encoding)
- Feature scaling for numerical columns

---

## Exploratory Data Analysis (EDA)

Analyzed relationships between car price and features like age, brand, fuel type, and mileage using visualizations.

```
df.corr()
sns.heatmap(df.corr(), annot=True)
sns.boxplot(x="Fuel_Type", y="Selling_Price", data=df)
```

Key insights:
- Car price decreases significantly with vehicle age
- Diesel variants showed different depreciation trends vs Petrol
- Kilometers driven negatively correlates with resale price

---

## Model Training & Evaluation

```
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor()
model.fit(X_train, y_train)

predictions = model.predict(X_test)
print("R2 Score:", r2_score(y_test, predictions))
```

Models evaluated:
- Linear Regression
- Random Forest Regressor

Evaluation metrics used:
- R² Score → **0.89**
- Root Mean Squared Error (RMSE) → **₹1.2L**
- Prediction Accuracy → **92%**

---

## Web Application

The trained model is deployed as an interactive **web application**, allowing users to input car specifications (manufacturing year, kilometers driven, engine capacity, fuel type, transmission, owner type, etc.) and instantly get a predicted resale price along with model confidence.

Key features:
- Sample data presets (Economy / Mid-Range / Luxury car)
- Real-time price prediction with input summary
- Live model performance panel (R² Score, RMSE, Accuracy)
- Clean, responsive UI with prediction confidence indicator

---

## Screenshots

**1. Prediction Input Form**

<p align="center">
  <img src="Screenshot/input-form.png" alt="Car Price Predictor - Input Form" width="85%">
</p>

**2. Prediction Result**

<p align="center">
  <img src="Screenshot/prediction-result.png" alt="Car Price Predictor - Prediction Result" width="85%">
</p>

---

## Tools Used

- Python
- Pandas
- NumPy
- Matplotlib / Seaborn
- Scikit-learn
- Flask (Web App / API)
- HTML / CSS / JavaScript (Frontend)
- Jupyter Notebook

---

## Key Learning Outcomes

- End-to-end Machine Learning pipeline design
- Data cleaning and preprocessing for real-world datasets
- Exploratory Data Analysis and visualization
- Regression model building and evaluation
- Feature engineering for improved model accuracy

---

## About

A Machine Learning project that predicts used car prices based on vehicle age, fuel type, transmission, and kilometers driven, using regression algorithms in Python.

**Author:** Tejas Bade
**Contact:** tejasbade558@gmail.com
