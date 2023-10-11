import csv

def get_data():
    csv_file_path = './dataset_world_bank_220119.csv'
    data = read_csv_file(csv_file_path)
    return data

def read_csv_file(file_path):
    data = []
    with open(file_path, 'r', newline='') as csvfile:
        csv_reader = csv.reader(csvfile)
        field_names = next(csv_reader)
        for row in csv_reader:
            data.append(dict(zip(field_names, row)))
    return data