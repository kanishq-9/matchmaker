import pandas as pd
import json
import sys
from io import StringIO

pd.set_option('display.max_columns', None)

def calculate_match(user1, user2):
    score = 0
    total_checks = 0

    total_checks += 5
    if user1['gender'] != user2['gender']:
        score += 5
    
    if user1['gender'] == 'Male':
        total_checks += 5
        if user1['age']<user2['age']:
            score += 5
    
    if user1['gender'] == 'Female':
        total_checks += 2
        if user1['occupation'] == user2['occupation']:
            score += 2
        else:
            score += 1

    total_checks += 3
    age_diff = abs(user1['age'] - user2['age'])
    if age_diff <= 2:
        score += 3
    elif age_diff <= 5:
        score += 2
    else:
        score += 1

    total_checks += 1
    if user1['religion'] == user2['religion']:
        score += 1

    total_checks += 1
    if user1['caste'] == user2['caste']:
        score += 1

    total_checks += 3
    if user1['mother_tongue'] == user2['mother_tongue']:
        score += 3
    else:
        score += 1

    total_checks += 5
    if user1['education'] == user2['education']:
        score += 5
    else:
        score += 1

    total_checks += 2
    if user1['occupation'] == user2['occupation']:
        score += 2
    else:
        score += 1

    total_checks += 2
    if user1['location'] == user2['location']:
        score += 2
    else:
        score += 1

    if user1['gender'] == 'Male':
        total_checks += 2
        if user1['salary_inr'] >= user2['salary_inr']:
            score += 2
        else:
            score += 1

    total_checks += 2
    if abs(user1['salary_inr'] - user2['salary_inr']) / max(user1['salary_inr'], 1) <= 0.3:
        score += 2
    else:
        score += 1

    if user1['gender'] == 'Male':
        total_checks += 2
        if user1['height_cm'] >= user2['height_cm']:
            score += 2
        else:
            score += 1


    hobbies1 = set(str(user1.get('hobbies', '')).split(","))
    hobbies2 = set(str(user2.get('hobbies', '')).split(","))
    common_hobbies = hobbies1 & hobbies2
    score += len(common_hobbies)
    total_checks += max(len(hobbies1), len(hobbies2))

    percentage = round((score / total_checks) * 100, 2)
    return percentage


def find_matches(target_id, dataframe):
    target_id = int(target_id) if dataframe['id'].dtype in ['int64', 'float64'] else str(target_id)

    target_df = dataframe[dataframe['id'] == target_id]
    if target_df.empty:
        raise ValueError(f"No user found with id={target_id}")
    
    target = target_df.iloc[0]
    results = []

    for _, row in dataframe.iterrows():
        if row['id'] == target_id:
            continue
        match_percent = calculate_match(target, row)
        results.append({
            "id": row['id'],
            "match_percentage": match_percent
        })

    matches = pd.DataFrame(results)
    matches = matches.sort_values(by="match_percentage", ascending=False)
    return matches


if __name__ == "__main__":
    try:
        input_text = sys.stdin.read()
        input_data = json.loads(input_text)
        user_id = input_data.get("userId")
        csv_data = input_data.get("csvData")

        if csv_data:
            df = pd.read_csv(StringIO(csv_data))
        else:
            df = pd.read_csv('../../docs/matrimonial_user_dataset.csv')

        result = find_matches(user_id, df)
        print(json.dumps(result.head(20).to_dict(orient="records")), flush=True)

    except Exception as e:
        print(json.dumps({"error": str(e)}), flush=True)
