from tabula.io import read_pdf
from utils import pdf_args_parser, combine_df, df_to_dict, clear_tmp
from uuid import uuid4
import json
import os

def main():
	pdf_path = pdf_args_parser()

	tables = read_pdf(pdf_path, pages='all')
	combined_df = combine_df(tables)
	data = df_to_dict(combined_df)

	clear_tmp()
	
	filename = f'{uuid4()}.json'
	directory = os.path.join(os.getcwd(), 'result')
	saved_path = os.path.join(directory, filename)

	if not os.path.exists(directory):
		os.makedirs(directory, exist_ok=True)

	with open(saved_path, 'w') as file:
		json.dump(data, file, indent=None, separators=(',', ':'))
	
	print(f'completed, file saved to: {saved_path}')

if __name__ == '__main__':
  main()