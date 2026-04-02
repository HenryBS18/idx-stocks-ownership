import pandas as pd

def df_to_dict(df: pd.DataFrame) -> list[dict]:
  dictionary: list[dict] = []

  for _, row in df.iterrows():
    dictionary.append({
        'ticker': row['SHARE_CODE'],
        'name': row['ISSUER_NAME'],
        'investorName': row['INVESTOR_NAME'],
        'investorType': row['INVESTOR_TYPE'],
        'localForeign': row['LOCAL_FOREIGN'],
        'domicile': row['DOMICILE'],
        'scripless': int(str(row['HOLDINGS_SCRIPLESS']).replace('.', ''), 10) if str(row['HOLDINGS_SCRIPLESS']) != '' else 0,
        'scrip': int(str(row['HOLDINGS_SCRIP']).replace('.', ''), 10) if str(row['HOLDINGS_SCRIP']) != '' else 0,
        'totalHoldingShare': int(str(row['TOTAL_HOLDING_SHARES']).replace('.', ''), 10),
        'percentage': float(str(row['PERCENTAGE']).replace(',', '.'))
    })

  print(f"Total Data: {len(dictionary)}")

  return dictionary