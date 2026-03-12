import os
import shutil

def clear_tmp():
  tmp_dir = os.path.join(os.getcwd(), "tmp")
  
  shutil.rmtree(tmp_dir, ignore_errors=True)
  os.makedirs(tmp_dir, exist_ok=True)