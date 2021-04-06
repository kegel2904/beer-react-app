import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Popup from './popup/popup'



import './App.scss';
import './beer-component.scss'

import Slider from '@material-ui/core/Slider';

import navPicture from './assets/drawing.svg';
import logoPicture from './assets/logo.png';
import infoSvg from './assets/info-24px.svg'
import notFavoriteStar from './assets/star_outline-24px.svg'
import favoriteStar from './assets/star-selected-24px.svg'

import { useStateWithCallback } from '@kirekov/great-hooks';





const axios = require('axios');



//sessionStorage.setItem("favorites", [].toString())

// https://api.punkapi.com/v2/beers
export default function App() {


  const sortOptions = [
    {
      "caption": "Sort by name",
      "value": 1,
      "sortField": "name"
    },
    {
      "caption": "Sort by alcohol (%)",
      "value": 2,
      "sortField": "abv"
    },
    /*
    {
      "caption": "Sort by name",
      "value": 1
    },
    */
  ]


  const [sortChosen, setSortChosen] = useState(1)
  const [beerData, setBeerData] = useState<any>([])
  const [showingBeerData, setShowingBeerData] = useState<any>([])
  const [sliderValue, setSliderValue] = useState([0, 55])
  const [filterNameValue, setFilterNameValue] = useStateWithCallback<string>("")
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [detailsBeer] = useState<any>({})

  const fetchBeerData = () => {
    return axios.get('https://api.punkapi.com/v2/beers')
      .then((res: any) => {
        return res.data
      })
      .catch((error: any) => {
        console.log(error)
      })
  }



  const addBeerData = () => {
    fetchBeerData().then((tempBeerData: any) => {
      const finalBeerData = tempBeerData.map((beer: any) => {
        const finalBeer = beer;
        finalBeer.favorite = false;
        return finalBeer;
      });


      console.log("favoriti - ", sessionStorage.getItem("favorites"))
      const favorites = sessionStorage.getItem("favorites")
      console.log(favorites && favorites.split(","))
      favorites && favorites.split(",").forEach((x: any) => {
        console.log(x)
        const id = +x;
        const index = finalBeerData.findIndex((obj: any) => {
          return +obj.id === id
        })

        finalBeerData[index].favorite = true
      })
      console.log(finalBeerData)
      setBeerData([
        ...finalBeerData
      ]);
      setShowingBeerData([
        ...finalBeerData
      ]);


    })
  }

  const starClick = (event: any) => {

    let newBeerData = beerData;
    let objIndex = newBeerData.findIndex((obj: any) => Number(obj.id) === Number(event.target.id));
    let currentBeerData = newBeerData.find((obj: any) => Number(obj.id) === Number(event.target.id));
    newBeerData[objIndex].favorite = !newBeerData[objIndex].favorite;

    setBeerData([
      ...newBeerData
    ]);


    // SESSION STORAGE - THE BETTER WAY IS WITH EDITING BEER DATA DIRECTLY
    console.log(sessionStorage.getItem("favorites"))
    let currentFavorites = (sessionStorage.getItem("favorites") || "[]").split(",").map(x => +x).filter((x: Number) => {
      if (x !== Number("s")) return x
    })
    console.log(currentFavorites)
    let favoriteIndex = currentFavorites.findIndex((x: number) => x === Number(currentBeerData.id));
    if (favoriteIndex === -1) {
      currentFavorites.push(beerData[objIndex].id)
    }
    else {
      currentFavorites.splice(favoriteIndex, 1)
    }

    sessionStorage.setItem("favorites", currentFavorites.toString())
    /*while(sessionStorage.getItem("favorites") != JSON.stringify(currentFavorites)){
      console.log("Cekamo")
    }*/
    console.log(sessionStorage.getItem("favorites"))


  }

  

  const filterEverything = () => {
    console.log(favoritesOnly)
    const tempBeerData = beerData.filter((beer: any) => {
      if (Number(beer.id) === 1) console.log(beer)
      if (
        beer.name.toLowerCase().includes(filterNameValue.toLowerCase())
        &&
        beer.abv >= sliderValue[0]
        &&
        beer.abv <= sliderValue[1]
        &&
        (favoritesOnly ? beer.favorite : true)
      ) {
        return beer
      }
      return null
    })

    let tempSortField = sortOptions.find((s: any) => {
      if (s.value === sortChosen){
        return s
      }
    })

    tempBeerData.sort((first: any, second: any) => {
      return (0 - (first[tempSortField?.sortField || "name"] > second[tempSortField?.sortField || "name"] ? -1 : 1))
    })

    setShowingBeerData([
      ...tempBeerData
    ])
  }
  const filterByName = (event: any) => {
    const inputVal = event.target.value.trim()
    setFilterNameValue(inputVal)
  }

  const handleSliderChange = (event: any, newValue: any) => {
    setSliderValue(newValue);
  }

  const changeSort = (event: any) => {
    setSortChosen(Number(event.target.value))
  }

  const checkboxFavoritesChange = ((event: any) => {
    setFavoritesOnly(!favoritesOnly)
  })


  // USE EFFECT KOD LOADANJA DATE
  useEffect(() => {
    console.log("useEffect addBeerData")
    addBeerData()


  }, [])



  useEffect(() => {
    console.log("useEffect filterEverything")
    filterEverything()

  }, [
    filterNameValue,
    sliderValue,
    favoritesOnly,
    beerData,
    sortChosen
  ])

  // USE EFFECT KOD PROMIJENE FILTERS VARIJABLE



  return (

    <div className="App">
      
      <div className="App-header">
        <img className="slikaNav" src={navPicture} alt="" />
        <Link to="/"><img className="slikaLogo" src={logoPicture} alt="" /></Link>
      </div>
      <div className="appBody">
        <div className="mainWidth">
          <Switch>
            <Route exact path="/">
              <div className="filters">
                <div className="firstFilter">
                  <div>
                    <p>
                      Filter by name
                      </p>
                    <input onInput={filterByName} type="text"></input>
                  </div>

                </div>
                <div className="secondFilter">
                  <div>
                    <p>
                      Alcohol content (%)
          </p>
                    <Slider
                      value={sliderValue}
                      onChange={handleSliderChange}
                      step={0.1}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      min={0}
                      max={55}

                    />
                  </div>
                </div>
                <div className="thirdFilter">
                  <div>
                    <p>
                      Show only favorites
          </p>
                    <input type="checkbox" onInput={checkboxFavoritesChange}></input>
                  </div>
                </div>
                <div className="fourthFilter">
                  <div>
                    <p>
                      Sort
          </p>
                    <select onChange={changeSort}>
                      {
                        sortOptions.map((s: any) => {
                          return (
                            <option key={s.value} value={s.value}>{s.caption}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                </div>
              </div>
              <div className="listOfBeers">

                {
                  showingBeerData.map((beer: any) => {

                    return (
                      <div className="beer" key={beer.id}>
                        <p>{beer.name}</p>
                        {/* <p>{beer.abv}</p> */}
                        <img src={beer.favorite ? favoriteStar : notFavoriteStar} onClick={starClick} id={beer.id} alt="zvijezda" className="starImg" />
                        <img className="beerImg" src={beer.image_url} alt="" />
                        <Popup header={beer.name} mainText={beer.description} alcoholPercentage={beer.abv} icon={infoSvg}/>
                        {/* <Link to={`/details`}><button className="detailsButton" onClick={() => { setDetailsBeer(beer) }}><img src={infoSvg} alt=""></img> DETAILS</button></Link> */}
                      </div>
                    )


                  })

                }

              </div>
            </Route>
            <Route path="/details">
              <div>
                <p>Name : {detailsBeer.name}</p>
                <p>About : {detailsBeer.description}</p>
                <p>Alcohol (%) : {detailsBeer.abv}</p>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
      <div className="footer">
        <img src={logoPicture} height="50px" alt="" />
      </div>
    </div>

  );


}



