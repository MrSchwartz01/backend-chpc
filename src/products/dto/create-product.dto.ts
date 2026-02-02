import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class CreateProductDto {
  @IsInt()
  @Min(1)
  codigo: number;

  @IsString()
  @IsOptional()
  producto?: string;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  medida?: string;

  @IsString()
  @IsOptional()
  almacen?: string;

  @IsString()
  @IsOptional()
  garantia?: string;

  @IsString()
  @IsOptional()
  despiece?: string;

  @IsString()
  @IsOptional()
  taller?: string;

  @IsString()
  @IsOptional()
  despieceGaraje?: string;

  @IsString()
  @IsOptional()
  temporal?: string;

  @IsString()
  @IsOptional()
  existenciaTotal?: string;

  @IsNumber()
  @IsOptional()
  costoTotal?: number;
}
