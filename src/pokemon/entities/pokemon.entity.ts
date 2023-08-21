import { Document } from "mongoose";
import { Schema, Prop } from "@nestjs/mongoose/dist/decorators";
import { SchemaFactory } from "@nestjs/mongoose/dist/factories";


@Schema()
export class Pokemon extends Document {

    @Prop({
        unique: true,
        index: true
    })
    name: string;
    
    @Prop({
        unique: true,
        index: true
    })
    nro: number;


}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon)