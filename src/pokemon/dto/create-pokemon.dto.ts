import { IsPositive, IsInt, Min, IsString, MinLength } from "class-validator";



export class CreatePokemonDto {

    @IsPositive()
    @IsInt()
    @Min(1)
    nro: number;

    @IsString()
    @MinLength(1)
    name: string;

}
