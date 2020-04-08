import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated : boolean=false;
  constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }
  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user=>{
      this.isAuthenticated=!!user;
    });
  }
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }
  onDataFetch() {
    this.dataStorageService.fetchRecipes().subscribe(() => { }, error => {
      alert("error occured while fetching the data " + error.message);
    });
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}