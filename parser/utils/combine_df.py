import pandas as pd

def combine_df(df_list: list[pd.DataFrame]) -> pd.DataFrame:
    if not df_list:
        return pd.DataFrame()

    df = pd.concat(df_list, ignore_index=True, sort=False)

    if "DATE" in df.columns:
        df = df[df["DATE"] != "DATE"]

    df = df.dropna(how="all")
    df = df.fillna("")
    df = df.reset_index(drop=True)

    return df