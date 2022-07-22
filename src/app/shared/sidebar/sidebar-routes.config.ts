import {RouteInfo} from './sidebar.metadata';


export const ROUTES: RouteInfo[] = [


    {
        id:1,
        active:true,
        path: '',
        title: 'Profile',
        icon: 'ft-home',
        class: 'has-sub',
        badge: '2',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                id:2,
                active:true,
                path: '/profile/profile-list',
                title: 'ProfilesList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:33,
                active:true,
                path: '/profile/authentication-request-list',
                title: 'AuthenticationRequestList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:41,
                active:true,
                path: '/profile/bulk-registration',
                title: 'BulkRegistration',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:42,
                active:true,
                path: '/profile/bulk-registration-report-list',
                title: 'BulkRegistrationReportList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            }
        ]
    },
    {
        id:4,
        active:true,
        path: '',
        title: 'LeaderManagement',
        icon: 'icon-user-following',
        class: 'has-sub',
        badge: '2',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                id:5,
                active:true,
                path: '/user/leader-list',
                title: 'LeaderList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:6,
                active:true,
                path: '/user/leader-group',
                title: 'LeaderGroup',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            }
        ]
    },
    {
        path: '',
        active:true,
        title: 'Dashboard',
        icon: 'ft-home',
        class: 'has-sub',
        badge: '1',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                path: '/dashboard/dashboard2',
                active:true,
                title: 'StatisticReports',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ]
    },
    {
        id:7,
        path: '',
        active:true,
        title: 'FieldManagement',
        icon: 'ft-grid',
        class: 'has-sub',
        badge: '3',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                id:8,
                active:true,
                path: '/dashboard/field',
                title: 'field',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:9,
                active:true,
                path: '/dashboard/field-tree-visualize',
                title: 'field-tree-visualize',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:10,
                active:true,
                path: '/dashboard/field-map-visualize',
                title: 'field-map-visualize',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:26,
                path: '/dashboard/change-field-request',
                active:true,
                title: 'change-field-request',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            }
        ]
    },
    {
        id:11,
        path: '',
        active:true,
        title: 'CmsManagement',
        icon: 'ft-image',
        class: 'has-sub',
        badge: '3',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                id:12,
                active:true,
                path: '/cms/banner-list',
                title: 'BannerList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:13,
                active:true,
                path: '/cms/news-list',
                title: 'NewsList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:14,
                active:true,
                path: '/cms/static-page-list',
                title: 'StaticPageList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:37,
                active:true,
                path: '/cms/logo-list',
                title: 'LogoList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ]
    },
    {
        id:15,
        active:true,
        path: '',
        title: 'SourcesManagement',
        icon: 'ft-book',
        class: 'has-sub',
        badge: '4',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                id:16,
                active:true,
                path: '/sources/author-list',
                title: 'AuthorList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:17,
                active:true,
                path: '/sources/publisher-list',
                title: 'PublisherList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:19,
                active:true,
                path: '/sources/book-list',
                title: 'BookList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:27,
                active:true,
                path: '/sources/article-list',
                title: 'ArticleList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:29,
                active:true,
                path: '/sources/journal-list',
                title: 'JournalList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:30,
                active:true,
                path: '/sources/thesis-list',
                title: 'ThesisList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:31,
                active:true,
                path: '/sources/conference-list',
                title: 'ConferenceList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:32,
                active:true,
                path: '/sources/magazine-list',
                title: 'MagazineList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:36,
                active:true,
                path: '/sources/sheet-report-list',
                title: 'SheetReportList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ]
    },
    {
        id:23,
        path: '',
        active:true,
        title: 'Communication',
        icon: 'ft-mail',
        class: 'has-sub',
        badge: '1',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                id:24,
                path: '/communication/inbox',
                active:true,
                title: 'Inbox',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:25,
                path: '/communication/task-list',
                active:true,
                title: 'taskList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:28,
                path: '/communication/ticket-list',
                active:true,
                title: 'TicketList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:36,
                path: '/communication/announcement',
                active:true,
                title: 'Announcement',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id:35,
                path: '/communication/chat',
                active:true,
                title: 'Chat',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            }
        ]
    },
    {
        path: '/taskboard',
        active:true,
        title: 'Task Board',
        icon: 'ft-file-text',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: []
    },
    {
        path: '',
        active:true,
        title: 'Charts',
        icon: 'ft-bar-chart-2',
        class: 'has-sub',
        badge: '2',
        badgeClass: 'badge badge-pill badge-success float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {active:true, path: '/charts/chartjs', title: 'ChartJs', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
            {
                active:true,
                path: '/charts/chartist',
                title: 'Chartist',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            }
        ]
    },
    {path: '/calendar',active:true, title: 'Calendar', icon: 'ft-calendar', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
    {
        path: '', title: 'Pages',active:true, icon: 'ft-copy', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
        submenu: [
            {
                path: '/pages/forgotpassword',
                active:true,
                title: 'Forgot Password',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/pages/horizontaltimeline',
                active:true,
                title: 'Horizontal Timeline',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/pages/verticaltimeline',
                title: 'Vertical Timeline',
                active:true,
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {path: '/pages/login',active:true, title: 'Login', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
            {
                path: '/pages/register',
                active:true,
                title: 'Register',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                active:true,
                path: '/pages/profile',
                title: 'User UserProfile',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                active:true,
                path: '/pages/lockscreen',
                title: 'Lock Screen',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {path: '/pages/invoice', active:true, title: 'Invoice', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
            {path: '/pages/error', active:true, title: 'Error', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
            {
                path: '/pages/comingsoon',
                active:true,
                title: 'Coming Soon',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                path: '/pages/maintenance',
                active:true,
                title: 'Maintenance',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {path: '/pages/gallery', active:true, title: 'Gallery', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
            {path: '/pages/search', active:true, title: 'Search', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
            {path: '/pages/faq', active:true, title: 'FAQ', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []},
        ]
    },
    {
        active:true,
        path: '/pages/faq',
        title: 'Documentation',
        icon: 'ft-book',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: true,
        submenu: []
    },
    {
        active:true,
        path: '/pages/faq',
        title: 'Support',
        icon: 'ft-life-buoy',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: true,
        submenu: []
    },
    {
        active:true,
        id: 20,
        path: '',
        title: 'OrganizationManagement',
        icon: 'fa fa-university',
        class: 'has-sub',
        badge: '2',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                id: 21,
                active:true,
                path: '/organization-management/organization-list',
                title: 'OrganizationList',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
            {
                id: 22,
                active:true,
                path: '/organization-management/education-unit',
                title: 'EducationUnit',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ]
    },
    {
        active:true,
        id: 38,
        path: '',
        title: 'Report',
        icon: 'fa fa-university',
        class: 'has-sub',
        badge: '2',
        badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
        isExternalLink: false,
        submenu: [
            {
                id: 39,
                active:true,
                path: '/report/user-report',
                title: 'UserReport',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: []
            },
        ]
    },


];
