import time

def stopwatch(func):
  def wrapper():
    start_time = time.perf_counter()
    func()
    end_time = time.perf_counter()

    print(f"Finished in: {end_time - start_time:.2f} seconds")
    return None
  
  return wrapper