import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authGuard } from '../guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
        canActivate:[authGuard],
      },
      {
        path: 'search',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
        canActivate:[authGuard],
      },
      {
        path: 'create-post',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
        canActivate:[authGuard]
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../tab4/tab4.page').then((m) => m.Tab4Page),
        canActivate:[authGuard]
      },
      {
        path: '',
        redirectTo: 'home', 
        pathMatch: 'full',
      },
    ],
  },
];
