import { Component, effect, inject, signal } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {

  fb = inject(FormBuilder);

  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);

  countriesByRegion = signal<Country[]>([]);
  countriesBorders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  onFormChanged = effect( ( onCleanup ) => {
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChanged();

    onCleanup( () => {
      regionSubscription?.unsubscribe();
      countrySubscription?.unsubscribe();
    })
  });

  onRegionChanged() {
    return this.myForm.get('region')!.valueChanges.pipe(
      tap( () => this.myForm.get('country')!.setValue('')),
      tap( () => this.myForm.get('border')!.setValue('')),
      tap( () => {
        this.countriesByRegion.set([]);
        this.countriesBorders.set([]);
      }),
      switchMap(region => this.countryService.getCountriesByRegion(region!))
    ). subscribe( countries => {
      this.countriesByRegion.set(countries);
    });
  }

  onCountryChanged() {
    return this.myForm.get('country')!.valueChanges.pipe(
      tap( () => this.myForm.get('border')!.setValue('')),
      tap( () => this.countriesBorders.set([])),
      filter( value => value!.length > 0),
      switchMap(alphaCode => this.countryService.getCountryByAlphaCode(alphaCode!)),
      switchMap( country => this.countryService.getCountryNamesByCodes(country.borders))
    ).subscribe( borders => {
      this.countriesBorders.set(borders);
    })
  }


}

