const rp = require('request-promise')
const cheerio = require('cheerio')
const pretty = require('pretty')

// options to pass into rp
const options = (url) => {
    return {
        method: 'GET',
        uri: url,
        resolveWithFullResponse: true
    }
}

module.exports = async (search) => {
    let googleResult = await google(search)
    let filteredSites = await siteFilter(googleResult)
    let objectList = filteredSites.map(site => { return cafedelites(site) })
    return objectList
}

console.log(process.cwd())
const google = (search) => {
    const url = 'https://www.google.com/search?q=' +
        search.replace(' ', '+') + 'recipes'
    return rp(url)
        .then((html) => {
            let $ = cheerio.load(html)
            let main = $("#main")
            let links = $('a', main)
            let listLinks = []
            links.each((index, value) => {
                let link = pretty($(value).attr('href'));
                if (link.substring(0,7) === '/url?q='){
                    let rawLink = link.substring(7)
                    let splitLink = rawLink.split('/')
                    listLinks.push(
                        splitLink[0] + '/' + splitLink[1] + '/' + splitLink[2]
                        + '/' + splitLink[3]
                    )
                }
            })
            return Array.from(new Set(listLinks))
        })
        .catch((err)=> { console.error(err) })
}

const siteFilter = async (urlList) => {
    const pagePromises = await urlList.map(async url => {
        return rp(options(url)).then(response => {
            if (Number(response.statusCode) < 400) {
                let $ = cheerio.load(response.body)
                let wprmChek = $(".wprm-recipe-instruction")
                if (wprmChek.text() === ''){ throw "not wprm" }
                return $
            }
        }).catch(_ => { return null })
    })
    return (await Promise.all(pagePromises)).filter(item => item !== null)
}

const cafedelites = ($) => {
    // Fill recipe objects
    let recipeName = $(".wprm-recipe-name").text()
    let recipeNameObject = []
    let ingredientGroups = $(".wprm-recipe-group-name")
    ingredientGroups.each((index,value) => {
        recipeNameObject.push($(value).text())
    })
    // Create/fill ingredients object
    let recipeIngredientObject = []
    let ingredientLists = $(".wprm-recipe-ingredients")
    ingredientLists.each((index, value) => {
        recipeIngredientObject.push([])
        let ingredientList = $(".wprm-recipe-ingredient", value)
        ingredientList.each((i2, v2) => {
            let ing = $(v2).text()
            if (ing.substring(0,1) === "▢") {
                ing = ing.substring(1)
            }
            recipeIngredientObject[index].push(ing)
        })
    })
    // Create/fill instructions Object
    let recipeInstructionsObject = []
    let ingredientInstructions = $(".wprm-recipe-instruction")
    ingredientInstructions.each((index, value) => {
        let text = $(value).text()
        text = text.split("<img")[0]
        recipeInstructionsObject.push(text)
    })
    //  Create recipe Object
    let recipeObject = {
        "name": recipeName,
        "ingredients" : {
            "ingredientsNames" : recipeNameObject,
            "ingredientsContent" :recipeIngredientObject
        },
        "instructions": recipeInstructionsObject
    }
    return recipeObject
}
