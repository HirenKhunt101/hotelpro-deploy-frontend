import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private readonly storageKey = environment.storageKey;

  private navBarUpdate = new BehaviorSubject<any>(null);
  navBarUpdate$ = this.navBarUpdate.asObservable();

  sendNavUpdate(data: any) {
    this.navBarUpdate.next(data);
  }

  setUserInfo(data: any, isUpdate?: boolean): void {
    try {
      localStorage.setItem(this.storageKey, btoa(JSON.stringify(data)));
      if (isUpdate) this.sendNavUpdate(true);
    } catch (e) {
      console.error('Error storing user info:', e);
    }
  }

  getUserInfo(): any {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return null;

    try {
      return JSON.parse(atob(data));
    } catch (e) {
      console.error('Error parsing user info:', e);
      return null;
    }
  }

  clearUserInfo(): void {
    localStorage.removeItem(this.storageKey);
  }

  updateUserInfo(updates: Partial<any>): void {
    const currentInfo = this.getUserInfo();
    if (currentInfo) {
      const updatedInfo = { ...currentInfo, ...updates };
      this.setUserInfo(updatedInfo, true);
    }
  }
}