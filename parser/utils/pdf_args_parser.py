import argparse
import os

def pdf_args_parser() -> tuple[str, str]:
  parser = argparse.ArgumentParser(description="Process PDF files.")
  parser.add_argument('--pdf', type=str, help='Path to the PDF file')

  args = parser.parse_args()

  pdf_path = ''
	
  if args.pdf:
    pdf_path = os.path.join(os.getcwd(), args.pdf)

    if not os.path.exists(pdf_path):
      raise Exception(f'PDF file not exists: {pdf_path}')
    
    file_date = os.path.basename(pdf_path).split('_')[0]
    
    return pdf_path, file_date
  else:
			raise Exception('No PDF path provided')