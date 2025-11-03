import { lazy } from 'react';
import ListUsers from '../pages/Users/List';
import ListRoles from '../pages/Roles/List';
import CreateUser from '../pages/Users/Create';
import UpdateUser from '../pages/Users/Update';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Demo = lazy(() => import('../pages/Demo'));
const DigitalSignatureList = lazy(
  () => import('../pages/DigitalSignature/DigSigList'),
);
const DigitalSignatureForm = lazy(
  () => import('../pages/DigitalSignature/DigSigForm'),
);

const coreRoutes = [
  {
    path: '/demo',
    title: 'Demo',
    component: Demo,
  },
  {
    path: '/digital-signature/:userId',
    title: 'Digital Signature',
    component: DigitalSignatureList,
  },
  {
    path: '/digital-signature/:userId/crear',
    title: 'Create Digital Signature',
    component: DigitalSignatureForm,
  },
  {
    path: '/digital-signature/:userId/editar/:id',
    title: 'Update Digital Signature',
    component: DigitalSignatureForm,
  },
  {
    path: '/users/editar/:id',
    title: 'Update Users',
    component: UpdateUser,
  },
  {
    path: '/users/crear',
    title: 'Create Users',
    component: CreateUser,
  },
  {
    path: '/users',
    title: 'Users List',
    component: ListUsers,
  },
  {
    path: '/roles/list',
    title: 'List Roles',
    component: ListRoles,
  },
  {
    path: '/calendar',
    title: 'Calender',
    component: Calendar,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
];

const routes = [...coreRoutes];
export default routes;
