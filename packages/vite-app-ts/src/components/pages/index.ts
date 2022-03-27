import { lazier } from 'eth-hooks/helpers';

// the components and pages are lazy loaded for performance and bundle size reasons
// code is in the component file

export const Profile = lazier(() => import('./profile/Profile'), 'Profile');
export const MyProfile = lazier(() => import('./profile/MyProfile'), 'MyProfile');
