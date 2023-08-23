import { Injectable } from '@nestjs/common';
// import axios, {AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response-interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
 // private readonly axios: AxiosInstance = axios;
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
    
  ){}

  async runSeed(){

    await this.pokemonModel.deleteMany ({}) // para limpiar la bd antes de ejecutar nuevamente
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    const pokemonToInsert: {name: string, nro: number} []= []

    data.results.forEach(async({name, url}) => {
      
      const segments = url.split("/")
      const nro = +segments[segments.length - 2]
      //const pokemon = await this.pokemonModel.create({name, nro})
      // console.log(name, nro)

      pokemonToInsert.push({name, nro})

    })

    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'Seed Executed';
  }

}
