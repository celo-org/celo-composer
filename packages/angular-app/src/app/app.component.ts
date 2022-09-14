import {Component} from '@angular/core';
import {Web3Service} from "./services/contract/web3.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  authenticated: boolean = false;
  data: string[] | undefined;


  constructor(
    private web3: Web3Service) {
  }


  Connect() {
    this.web3.connectAccount().then(response => {
      console.log(response);
      this.data = response
    })
  }

}
