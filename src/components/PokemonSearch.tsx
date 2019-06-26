import React, { Component } from 'react';
import User from "../interfaces/userInterface";

interface PokemonSearchState {
    error: boolean;
    pokemon: Pokemon;

}
interface Pokemon {
    name: string;
    numberOfAbilities: number;
    baseExperience: number;
    imageUrl: string;

}
export class PokemonSearch extends Component<User, PokemonSearchState> {
    pokemonRef: React.RefObject<HTMLInputElement>;
    constructor(props: User) {
        super(props);
        this.pokemonRef = React.createRef();
        this.state = {
            error: false,
            pokemon: null
        }
    }
    fetchPokemonDetails(name: string) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`).then(res => {
            if (res.status !== 200) {
                this.setState({ error: true })
            }
            res.json().then(data => this.setState({
                error: false,
                pokemon: {
                    name: data.name,
                    numberOfAbilities: data.abilities.length,
                    baseExperience: data.base_experience,
                    imageUrl: data.sprites.front_default
                }
            }))
        })
    }
    onSerachClick = (e: any): void => {
        e.preventDefault();
        const inputValue = this.pokemonRef.current.value.toLowerCase();
        this.fetchPokemonDetails(inputValue);
    }
    onPokemonClick(pokemon: string): void {
        this.fetchPokemonDetails(pokemon.toLowerCase());
    }
    render() {
        const { name: userName, pokemons } = this.props;
        const { error, pokemon } = this.state;
        let resultMarkup;
        if (error) {
            resultMarkup = <p>Pokemon not found, please try again </p>
        } else if (pokemon) {
            resultMarkup = <div className="resultMarkup">
                <figure>
                    <img src={pokemon.imageUrl} alt="Pokemon" className="pokemon-image" height="200" width="200" />
                    <figcaption><h1>{pokemon.name}</h1></figcaption>
                </figure>
                <p>
                    {pokemon.name} has {pokemon.numberOfAbilities} abilities and {pokemon.baseExperience} base experience points
                </p>
            </div>
        }
        return (
            <div>
                <p>User {userName} {pokemons && <span>has {pokemons.length} pokemons</span>}</p>
                <ol>
                    {pokemons && pokemons.map(pokemon => <li onClick={() => this.onPokemonClick(pokemon)}>{pokemon}</li>)}
                </ol>
                <form onSubmit={this.onSerachClick}>
                    <input ref={this.pokemonRef} /><br /><br />
                    <button className="my-button" type="submit">Search</button>
                </form>
                {resultMarkup}
            </div>
        )
    }
}

export default PokemonSearch
