#  @bekbrace
#  FARMSTACK Tutorial - Sunday 13.06.2021

from fastapi import FastAPI, HTTPException

from model import Todo

from database import (
    fetch_one_todo,
    fetch_all_todos,
    create_todo,
    update_todo,
    remove_todo,
)

# an HTTP-specific exception class  to generate exception information
from pydantic import BaseModel
import pickle 
import pandas as pd

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

df = pd.read_csv('dataset (1).csv')

origins = [
    "http://localhost:3000",
]

# what is a middleware? 
# software that acts as a bridge between an operating system or database and applications, especially on a network.

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    disease1: str
    disease2: str
    veg: str

with open('food_rec.pkl', 'rb') as f:
    model = pickle.load(f)


@app.post("/new")
async def scoring_endpoint(item: User):
    d = {'anemia': 0, 'cancer': 0, 'diabeties': 0, 'eye_disease': 0, 'goitre': 0, 'heart_disease': 0, 'hypertension': 0,
         'kidney_disease': 0, 'obesity': 0, 'pregnancy': 0, 'rickets': 0, 'scurvy': 0, 'non-veg': 0, 'veg': 0}

    sampl = []
    for i in item:
        sampl.append(i[1])
    for i in sampl:

        d[i] = 1

    final_input = list(d.values())

    distnaces, indices = model.kneighbors([final_input])

    for i in list(indices):
        df_results = pd.DataFrame(columns=list(df.columns))
        df_results = df_results.append(df.loc[i])

    df_results = df_results.filter(
        ['Name', 'Nutrient', 'Veg_Non', 'Diet', 'Disease', 'description', 'VATTA', 'PITTA', 'KAPHA'])
    df_results = df_results.drop_duplicates(subset=['Name'])
    df_results = df_results.reset_index(drop=True)

    return df_results


# @app.get("/")
# async def read_root():
#     return {"Hello": "World"}

# @app.get("/api/todo")
# async def get_todo():
#     response = await fetch_all_todos()
#     return response

# @app.get("/api/todo/{title}", response_model=Todo)
# async def get_todo_by_title(title):
#     response = await fetch_one_todo(title)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no todo with the title {title}")

# @app.post("/api/todo/", response_model=Todo)
# async def post_todo(todo: Todo):
#     response = await create_todo(todo.dict())
#     if response:
#         return response
#     raise HTTPException(400, "Something went wrong")

# @app.put("/api/todo/{title}/", response_model=Todo)
# async def put_todo(title: str, desc: str):
#     response = await update_todo(title, desc)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no todo with the title {title}")

# @app.delete("/api/todo/{title}")
# async def delete_todo(title):
#     response = await remove_todo(title)
#     if response:
#         return "Successfully deleted todo"
#     raise HTTPException(404, f"There is no todo with the title {title}")