// Sidebar route metadata
export interface RouteInfo {
    active: boolean;
    id?:number;
    path: string;
    title: string;
    icon: string;
    class: string;
    badge: string;
    badgeClass: string;
    isExternalLink: boolean;
    submenu : RouteInfo[];
}
