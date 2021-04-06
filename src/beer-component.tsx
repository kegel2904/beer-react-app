import React, { useState } from 'react';
import './beer-component.scss'

import infoSvg from './assets/info-24px.svg'
import notFavoriteStar from './assets/star_outline-24px.svg'
import favoriteStar from './assets/star-selected-24px.svg'




export default function BeerComponent(beer: any) {

    const [currentBeer, setCurrentBeer] = useState(beer);
    const [topStar, setTopStar] = useState();
    //setTopStar(notFavoriteStar)
    const starClick = (event: any) => {
        console.log(event)
        beer.name = 'test';
        console.log(beer)

    }

    let favorite = false;
    return (
        <div className="beer" key={beer.id}>
            <p>{beer.name}</p>
            <img src={beer.favorite ? favoriteStar : notFavoriteStar} onClick={starClick} id={beer.id} alt="zvijezda" className="starImg" />
            <img className="beerImg" src={beer.image_url} alt="" />
            <button className="detailsButton" onClick={() => { console.log(beer) }}><img src={infoSvg} alt=""></img> DETAILS</button>
        </div>


    )
}