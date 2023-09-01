// ** Icons Import
import { Home, Archive, Plus, FileText, User } from "react-feather";

// export default [
//   {
//     id: 'dashboards',
//     title: 'Dashboards',
//     icon: <Home size={20} />,
//     badge: 'light-warning',
//     badgeText: '2',
//     children: [
//       {
//         id: 'analyticsDash',
//         title: 'Analytics',
//         icon: <Circle size={12} />,
//         navLink: '/dashboard/analytics'
//       },
//       {
//         id: 'eCommerceDash',
//         title: 'eCommerce',
//         icon: <Circle size={12} />,
//         navLink: '/dashboard/ecommerce'
//       }
//     ]
//   }
// ]

export default [
  {
    header: "NFSA",
    roles: "All",
  },
  {
    id: "dashboards",
    title: "Dashboards",
    icon: <Home size={20} />,
    navLink: "/dashboard",
    roles: "All",
  },
  {
    id: "newForm",
    title: "New Form",
    icon: <Plus size={20} />,
    navLink: "/add",
    roles: "User",
  },
  // {
  //   id: "applicationDetail",
  //   title: "Application Detail",
  //   icon: <FileText size={20} />,
  //   navLink: "/application-detail",
  //   roles: "All",
  // },
  {
    id: "profile",
    title: "Profile",
    icon: <User size={20} />,
    navLink: "/profile",
    roles: "All",
  },
  {
    id: "draft",
    title: "Draft",
    icon: <Archive size={20} />,
    navLink: "/draft",
    roles: "User",
  },
  {
    id: "AddAdminUser",
    title: "Add User",
    icon: <User size={20} />,
    navLink: "/adduser",
    roles: "Admin",
  },
  {
    id: "AddAdminUser",
    title: "Add User",
    icon: <User size={20} />,
    navLink: "/adduser",
    roles: "Collector",
  },
  // {
  //   id: 'profile',
  //   title: 'Profile',
  //   icon: <User size={20} />,
  //   navLink: '/profile'
  // }
];
