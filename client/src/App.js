import React, {useState} from "react";
import RecipeCard from './RecipeCard'

class App extends React.Component {

  state = {
    numRecipes: 0,
    recipesJson: [],
    inputVal: ''
  }

  render() {
    let recipes = []

    for (let i = 0; i < this.state.numRecipes; i++) {
      recipes.push(<RecipeCard key={i} json={this.state.recipesJson[i]}/>)
    }
    return (
        <PageComponent getRecipes={this.getRecipes} recipes={recipes}>
          {recipes}
        </PageComponent>

    )
  }

  getRecipes = async (search) => {
    const response = await fetch('http://localhost:9000/searchEngine/', {
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
        inputVal: ''
      })
    })
  }
}

const PageComponent = (props) => {
    const [value, setValue] = useState('')
    return(
      <div>
          <div className="p-5 items-center w-full text-center">
            <h1 className="text-4xl font-bold p-3">Recipe Reduce</h1>
              <h2> Find recipes for:</h2>
        <input type="text" id="searchBar" onChange={event => setValue(event.target.value)}
               className="border rounded p-1"/>
              <br/>
        <button id="searchButton" onClick={() => props.getRecipes(value)}
            className="border rounded m-2 p-1">Search</button>
          </div>
        <div id="recipeContainer" className="p-6">
          {props.recipes}
        </div>
      </div>
    )
}

export default App;
