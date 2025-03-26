import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Country } from '../interfaces/country.interface';
import { Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CountryService {

  private baseUrl = 'https://restcountries.com/v3.1';

  private http = inject(HttpClient);

  private _regions = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania'
  ];

  // Getter de las regiones que evita que se modifiqué el arreglo de regiones
  public get regions() : string[] {
    return [...this._regions]
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if (!region) return of([]);

    const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url);
  }

  getCountryByAlphaCode(alphaCode: string): Observable<Country> {
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;

    return this.http.get<Country>(url);
  }

  getCountryBorderByCodes(borders: string[]) {
    // TODO: por hacer
  }

}
