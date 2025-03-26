import { Component, effect, inject, signal } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Country } from '../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';

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

    onCleanup( () => {
      regionSubscription?.unsubscribe();
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


}
