import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['USER', 'ADMIN'], { message: 'El rol debe ser USER o ADMIN' })
  role: string;
}
