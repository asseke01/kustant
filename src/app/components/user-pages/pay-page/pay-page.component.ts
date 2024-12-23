import { Component, OnInit, Renderer2 } from '@angular/core';

declare const halyk: any; // Декларация объекта halyk

@Component({
  selector: 'app-pay-page',
  standalone: true,
  templateUrl: './pay-page.component.html',
  styleUrls: ['./pay-page.component.css']
})
export class PayPageComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    const isProd = false; // true для прода
    const script = this.renderer.createElement('script');
    script.src = isProd
      ? './assets/js/packages/prod_epay.js'
      : './assets/js/packages/test_epay.js';
    script.onload = () => {
      this.initPayment();
    };
    document.body.appendChild(script);
  }

  initPayment(): void {
    const params = new URLSearchParams(window.location.search);
    const paymentObject: any = {};
    params.forEach((value, key) => {
      paymentObject[key] = decodeURIComponent(value);
      if (key === 'auth') {
        paymentObject[key] = JSON.parse(paymentObject[key]);
      }
    });

    if (halyk) {
      halyk.pay(paymentObject);
    } else {
      console.error('Halyk script not loaded!');
    }
  }
}
