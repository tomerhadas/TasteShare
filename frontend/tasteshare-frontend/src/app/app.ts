import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/shared/footer/footer';
import { Navbar } from './components/shared/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'Tasteshare';
}
