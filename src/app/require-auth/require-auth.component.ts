// src/app/require-auth/require-auth.component.ts
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../models/user.model';

@Component({
  selector: 'app-require-auth',
  templateUrl: './require-auth.component.html',
})
export class RequireAuthComponent implements OnInit {
  userData?: User;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.user.subscribe((user) => {
      if (user) {
        this.firestore
          .collection('users')
          .doc<User>(user.uid)
          .valueChanges()
          .subscribe((data) => {
            this.userData = data;
          });
      }
    });
  }
}
