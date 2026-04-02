import os
import shutil

def clear_result_dir():
  tmp_dir = os.path.join(os.getcwd(), "result")
  
  shutil.rmtree(tmp_dir, ignore_errors=True)
  os.makedirs(tmp_dir, exist_ok=True)