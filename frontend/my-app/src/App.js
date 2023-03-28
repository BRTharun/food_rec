import React, {useEffect, useState} from 'react';
import './App.css';
import Recipe from './recipe';
import axios from 'axios';

var i =0

const App = () => {

  const APP_ID = 'a99bd604';
  const APP_KEY = '801b3f6953e413a5d229de1043ba6dbd';

  const [todoList, setTodoList] = useState()
  const [disease1, setDisease1] = useState('') 
  const [disease2, setDisease2] = useState('')
  const [veg, setVeg] = useState('')
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const getRecipes = async () => {
      const response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`);
      const data = await response.json();
      setRecipes(data.hits);
      console.log(data);
    }
    getRecipes();
  }, [query]);

  // const getRecipes = async () => {
  //   const response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`);
  //   const data = await response.json();
  //   setRecipes(data.hits);
  // }

  const updateSearch = e => {
    setSearch(e.target.value);
  }

  const getSearch = e => {
    axios.post('http://localhost:8000/new', { 'disease1': disease1, 'disease2': disease2,'veg': veg })
    .then((response) => {
    setQuery(response.data.Name)})
    e.preventDefault();
    setSearch('');
  }
  const addTodoHandler = () => {
    axios.post('http://localhost:8000/new', { 'disease1': disease1, 'disease2': disease2,'veg': veg })
    .then((response) => {
      setQuery(response.data.Name[i])
    })
  }

  const nextRecipe =()=>{
      i+=1;
      console.log("value of i ",i)
  }


  return (
    <div className="App">
      <h1 className="app-title">Dite Recommender </h1>
      <p className="app-subtitle">A single page app for your health</p>
      <form onSubmit={getSearch} className="search-form">
        <input className="mb-2 form-control titleIn" onChange={event => setDisease1(event.target.value)} placeholder='Disease1'/>
        <input className="mb-2 form-control titleIn" onChange={event => setDisease2(event.target.value)} placeholder='Disease2'/>
        <input className="mb-2 form-control titleIn" onChange={event => setVeg(event.target.value)} placeholder='Veg'/>
        <button className="mb-2 form-control titleIn" style={{'borderRadius':'50px',"font-weight":"bold"}}  onClick={addTodoHandler(i)}>Add Task</button>
        <button className="mb-2 form-control titleIn" style={{'borderRadius':'50px',"font-weight":"bold"}}  onClick={nextRecipe}>Nextk</button>
        {/* <input className="search-bar" type="text" value={search} onChange={updateSearch} placeholder="Enter an ingredient or a dish name" ></input> */}
      </form>
      <div className="reciperesults">
      {recipes.map(recipe => (
        <Recipe 
        key={recipe.recipe.label}
        url={recipe.recipe.url}
        title={recipe.recipe.label} 
        calories={recipe.recipe.calories}
        image={recipe.recipe.image}
        ingredients={recipe.recipe.ingredients}></Recipe>
      ))}
      </div>
    </div>
  );
}

export default App;
