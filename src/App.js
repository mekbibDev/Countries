import React, { useState, useEffect } from "react";
import axios from "axios";
import earth from "./assets/images/earth.svg";
const Weather = ({ capital }) => {
  if (capital.weather)
    return (
      <div>
        <h2>Weather in {capital.name}</h2>
        <p>Description: {capital.weather[0].description} </p>
        <p>Temprature: {capital.main.temp} kelvin</p>
        <p>Wind: {capital.wind.speed} speed</p>
      </div>
    )
  else return (<></>)
}
const Search = ({ onChange, value }) => <input onChange={onChange} value={value} />
const Button = ({ onClick, name }) => <button key={Math.random()} onClick={onClick} value={name}>show</button>
const Country = (({ country }) => {
  const languages = Object.keys(country.languages);
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h2>Languages</h2>
      {languages.map(language => <li key={language}>{country.languages[language]}</li>)}
      <h2>flag</h2>
      <img src={country.flags.png} width='400px' height='200px' />
    </>
  )
})
const Countries = (({ countries, filterCountriesByButton, capital }) => {
  if (countries.length > 10)
    return (
      <>
        <p>Too many results. Give more data</p>
      </>
    )
  else if (countries.length === 0)
    return (
      <>
        <p> No country by that name</p>
      </>
    )
  else if (countries.length === 1)
    return (
      <>
        <Country country={countries[0]} />
        <Weather capital={capital} />
      </>
    )
  else return (
    <div>
      {countries.map(country => {
        return (<div key={country.name.common}>
          <li >{country.name.common}</li>
          <Button onClick={filterCountriesByButton} name={country.name.common} />
        </div>)
      })}
    </div>
  )
})
function App() {
  const api_key = process.env.REACT_APP_API_KEY;
  const [countries, setCountries] = useState('');
  const [capital, setCapital] = useState('');
  const [filter, setFilter] = useState('');
  const [filteredCountires, setFilteredCountries] = useState('');
  const searchBy = (e) => {
    setFilter(e.target.value)
    filterCountries(e.target.value)


  }
  const filterCountries = (name) => {
    if (countries !== '') {
      const filtered = countries.filter(country =>
        country.name.common
          .toLowerCase()
          .includes(name.toLowerCase()))
      setFilteredCountries(filtered)
      setToCapital(filtered);
    }
    else
      return;
  }

  const filterCountriesByButton = (e) => {
    const filtered = countries.filter(country =>
      country.name.common.toLowerCase() === e.target.value.toLowerCase())
    setFilteredCountries(filtered)
    setToCapital(filtered);
  }

  const setToCapital = (filtered) => {
    if (filtered.length === 1) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${filtered[0].capital}&appid=${api_key}`)
        .then(response => {
          console.log(response.data)
          setCapital(response.data)
        })
    }

  }
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log(response.data);
        setCountries(response.data);
      })
  }, [])
  return (
    <div class="container">
      <div class="header">
        <div class="logo">
          <img src={earth} alt="earth logo" />
          Countries
        </div>
        <div class="search">
          Search By: <Search onChange={searchBy} value={filter} />
        </div>
      </div>
      <div class="content">
        <Countries countries={filteredCountires} filterCountriesByButton={filterCountriesByButton} capital={capital} />

      </div>
    </div>
  );
}

export default App;
