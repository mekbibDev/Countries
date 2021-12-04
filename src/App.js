import React, {useState,useEffect} from "react";
import axios from "axios";

const Search =  ({onChange,value}) => <input onChange = {onChange} value = {value}/>
const Button = ({onClick,name}) => <button key = {Math.random()} onClick = {onClick} value = {name}>show</button>
const Country = (({country}) => {
  const languages = Object.keys(country.languages);
  return (
    <>
    <h1>{country.name.common}</h1>
    <p>Capital: {country.capital}</p>
    <p>Population: {country.population}</p>
    <h2>Languages</h2>
    {languages.map(language => <li key = {language}>{country.languages[language]}</li>)}
    <h2>flag</h2>
    <img src = {country.flags.png} width  = '400px' height = '200px'/>
  </>
  )
})
const Countries = (({countries,filterCountriesByButton}) =>{
  if (countries.length > 10)
  return(
    <>
    <p>Too many results. Give more data</p>
    </>
  )
  else if (countries.length === 0)
    return(
      <>
       <p> No country by that name</p>
      </>
    )
  else if (countries.length === 1)
    return(
      <Country country = {countries[0]} />
    )
  else return(
    <div>
      {countries.map(country =>
      {return(<div key ={country.name.common}>
              <li >{country.name.common}</li>
              <Button  onClick = {filterCountriesByButton} name = {country.name.common}/>
              </div>)
         })}
    </div>
  )
})
function App() {
  const [countries,setCountries] = useState('');
  const [filter,setFilter] = useState('');
  const [filteredCountires,setFilteredCountries] = useState('');
  const searchBy = (e) =>{
    setFilter(e.target.value)
    filterCountries(e.target.value)
    
  }
  const filterCountries = (name) => {
    if (countries !== ''){
      setFilteredCountries(countries.filter(country =>
        country.name.common
        .toLowerCase()
        .includes(name.toLowerCase())))
    }
    else
      return;
  }

  const filterCountriesByButton = (e) => {
    filterCountries(e.target.value);
  }
  useEffect(()=>{
    axios
        .get('https://restcountries.com/v3.1/all')
        .then(response =>{
          console.log(response.data);          
          setCountries(response.data);
        })
  },[])
  return (
    <div>
      Search By: <Search onChange = {searchBy} value = {filter} />
      <Countries countries = {filteredCountires} filterCountriesByButton = {filterCountriesByButton}/>
    </div>
  );
}

export default App;
