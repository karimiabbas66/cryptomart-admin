import {Routes} from '@angular/router';


export const Full_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'user',
    loadChildren: () => import('../../leader-management/leader-management.module').then(m => m.LeaderManagementModule)
  },
  {
    path: 'cms',
    loadChildren: () => import('../../cms/cms.module').then(m => m.CmsModule)
  },
  {
    path: 'communication',
    loadChildren: () => import('../../communication/communication.module').then(m => m.CommunicationModule)
  },
  {
    path: 'sources',
    loadChildren: () => import('../../sources/sources.module').then(m => m.SourcesModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('../../profile/profile.module').then(m => m. ProfileModule)
  },
  {
    path: 'organization-management',
    loadChildren: () => import('../../organization-management/organization-management.module').then(m => m.OrganizationManagementModule)
  },
  {
    path: 'report',
    loadChildren: () => import('../../report/report.module').then(m => m.ReportModule)
  }
];
