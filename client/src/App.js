import React, {useState} from "react";
import RecipeCard from './RecipeCard'

class App extends React.Component {

  state = {
    numRecipes: 0,
    recipesJson: [],
    inputVal: '',
    loader: '',
    searched: false
  }

  render() {
    let recipes = []
    let load = this.state.loader

    for (let i = 0; i < this.state.numRecipes; i++) {
      recipes.push(<RecipeCard key={i} json={this.state.recipesJson[i]}/>)
    }
    console.log(recipes)
      console.log(this.state.searched)
    if (this.state.searched && recipes.length === 0){
        recipes = ['Could not find any searches for this keyword, please try again.']
    }
    return (
        <PageComponent getRecipes={this.getRecipes} recipes={recipes} load={load}>
          {load}
          {recipes}
        </PageComponent>

    )
  }
  getRecipes = async (search) => {
      this.setState({
          numRecipes: 0,
          recipesJson: {},
          inputVal: search,
          loader: 'loading',
          searched: false
      })
    const response = await fetch('/searchEngine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({search: search})
    })
    response.json().then( val => {
        this.setState({
            numRecipes: val.length,
            recipesJson: val,
            inputVal: '',
            loader: null,
            searched: true
        })
    })
  }
}

const PageComponent = (props) => {
    const [value, setValue] = useState('')
    return(
      <div>
          <div className="p-5 items-center w-full text-center">
            <h1 className="text-4xl font-bold p-5">Recipe Reduce</h1>
              <h2> Find recipes for:</h2>
        <input type="text" id="searchBar" onChange={event => setValue(event.target.value)}
               className="border rounded p-1"/>
              <br/>
        <button id="searchButton" onClick={() => props.getRecipes(value)}
            className="border rounded m-2 p-1">Search</button>
          </div>
        <div id="recipeContainer" className="p-6 pr-20 pl-20">
            {props.load}
          {props.recipes}
        </div>
      </div>
    )
}

export default App;
