import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/users.entity';

export class ReportDto {
    @Expose()
    id: number;
    @Expose()
    price: number;
    @Expose()
    year: number;
    @Expose()
    long: number;
    @Expose()
    lat: number;
    @Expose()
    make: string;
    @Expose()
    model: string;
    @Expose()
    kilometrage: number;

    @Transform(({obj}) => obj.user.id)
    @Expose()
    userId: number;
}