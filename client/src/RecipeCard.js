const RecipeCard = (props) => {
    return (
        <div className="p-4">
            <h2 className="text-3xl text-center p-3">{props.json.name}</h2>
            <hr/>
            <div className="">
                <h3 className="text-2xl p-2 underline">Ingredients</h3>
                <Ingredients names={props.json.ingredients.ingredientsNames}
                list={props.json.ingredients.ingredientsContent}/>
            </div>
            <div className="instructionsContainer">
                <h3 className="text-2xl p-2 underline">Instructions</h3>
                <Instructions instructions={props.json.instructions} />
            </div>
            <div className="pb-10">
                Source: <a href={props.json.websiteUrl} className="no-underline hover:underline text-sky-600">{props.json.websiteName}</a>
            </div>
        </div>
    )
}

const Instructions = (props) => {
    let instructions = []
    for (let i = 0; i < props.instructions.length; i++) {
        instructions.push(<li key={i}>{props.instructions[i]}</li>)
    }
    return <ul className="list-inside list-disc p-2">{instructions}</ul>
}

const Ingredients = (props) => {
    const generate = () => {
        if (props.names.length === 0) {
            let ingredients = []
            for (let i = 0; i < props.list[0].length; i++) {
                ingredients.push(<li key={i}>{props.list[0][i]}</li>)
            }
            return <ul className="list-disc list-inside p-2">{ingredients}</ul>
        }
        else {
            const outerList = (items) => {
                return <ul className="list-inside text-xl p-2">
                            {items}
                        </ul>
            }
            let names=[]
            for (let i = 0; i < props.names.length; i++){
                let ingredients = []
                try {
                    for (let j = 0; j < props.list[i].length; j++) {
                        ingredients.push(<li key={j}>{props.list[i][j]}</li>)
                    }
                }
                catch (e) {
                    ingredients.push(
                        <li key={100}>
                            Could not fetch ingredients, please visit source website for full ingredients list.
                        </li>
                    )
                }
                names.push(
                    <li key={i}>
                        {props.names[i]} <ul className="list-disc list-inside text-base">{ingredients}</ul>
                    </li>
                )
            }
            return outerList(names)
        }
    }
    return <div> { generate() } </div>
}
export default RecipeCard