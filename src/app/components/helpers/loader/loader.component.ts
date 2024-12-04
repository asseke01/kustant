import {Component, inject} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {LoaderService} from '../../../services/helper-services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  public loaderService = inject(LoaderService);
  isLoading$ = this.loaderService.loading$;



}
