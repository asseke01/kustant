import {Component, ElementRef, HostListener, inject, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../services/auth-services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    NgIf
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  private authService = inject(AuthService);
  private elementRef = inject(ElementRef);
  private router = inject(Router);
  userData:any;
  selectedRouter:string = '';

  isMenuOpen = false;
  isDropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log(this.isDropdownOpen);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
    this.userData = this.authService.getUserData();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  clickRouter(router: string): void {
    this.selectedRouter = router;
    switch (router) {
      case 'profile':
        this.router.navigate(['profile']);
        break;
      case 'settings':
        this.router.navigate(['settings']);
        break;
      default:
        console.error('Unknown route:', router);
        break;
    }
  }

  referToMain(){
    if(this.userData != null){
      this.router.navigate(['main'])
    }else{
      this.router.navigate([''])
    }
  }
}
