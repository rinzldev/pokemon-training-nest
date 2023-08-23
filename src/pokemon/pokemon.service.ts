import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from '../common/dto/pagination.dto';


@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>

  ){}


  async create(createPokemonDto: CreatePokemonDto) {
    
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
      
    }
  }

  findAll(paginationDto:PaginationDto) {
    
    const {limit = 10, offset = 0} = paginationDto
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        nro: 1
      })

  }

  async findOne(term: string) {
    
   let pokemon: Pokemon

   if(!isNaN(+term)){

    pokemon = await this.pokemonModel.findOne({nro: term})

   }

   // MongoID
   if( !pokemon &&isValidObjectId(term)) {
    pokemon = await this.pokemonModel.findById(term)
   }
   // Name
   if (! pokemon) {
    pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()})
   }
    
   //Para casos de no encontrar nada
    if(!pokemon)
      throw new NotFoundException(`pokemon with id,name or nro "${term}" not found`) 

    return pokemon;
  }

 async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term)

    if(updatePokemonDto.name) 
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
      
      try {
        await pokemon.updateOne(updatePokemonDto)
        return {...pokemon.toJSON(), ...updatePokemonDto};
      } catch (error) {
        this.handleExceptions(error);
      }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id});
    if(deletedCount === 0) 
      throw new BadRequestException(`Pokemon with id "${id}" not found`)

    return;
  }

  private handleExceptions(error: any) {
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't create pokemon - Check server logs`)
  }

}

function limit(arg0: number) {
  throw new Error('Function not implemented.');
}

