/**
 * Application Routes Configuration
 * Centralized route definitions for the frontend application
 */

export const routes = {
  // Main Routes
  home: '/',
  about: '/about-us',
  contact: '/contact-us',
  portfolio: '/portfolio',

  // Services Routes
  services: {
    weddingPhotography: '/wedding-photography',
    weddingCinematography: '/wedding-cinematography',
    preWeddingFilm: '/pre-wedding-film',
    preWeddingPhotography: '/pre-wedding-photography',
    civilMarriagePhotography: '/civil-marriage-photography',
    engagementPhotography: '/engagement-photography-couple-portraits',
    birthdayPhotography: '/birthday-photography',
    babyShowerPhotography: '/baby-shower-photography',
    graduationPhotography: '/graduation-photography',
  },

  // Wedding Type Routes
  weddingTypes: {
    hindu: '/hindu-wedding',
    sikh: '/sikh-wedding',
    muslim: '/muslim-wedding',
    church: '/church-wedding',
    civil: '/civil-wedding',
  },
};

// Route metadata for display purposes
export const routeMetadata = {
  [routes.home]: {
    title: 'Home',
    breadcrumb: 'Home',
  },
  [routes.about]: {
    title: 'About Us',
    breadcrumb: 'About Us',
  },
  [routes.contact]: {
    title: 'Contact Us',
    breadcrumb: 'Contact Us',
  },
  [routes.portfolio]: {
    title: 'Portfolio',
    breadcrumb: 'Portfolio',
  },
  [routes.services.weddingPhotography]: {
    title: 'Wedding Photography',
    breadcrumb: 'Wedding Photography',
  },
  [routes.services.weddingCinematography]: {
    title: 'Wedding Cinematography',
    breadcrumb: 'Wedding Cinematography',
  },
  [routes.services.preWeddingFilm]: {
    title: 'Pre-Wedding Film',
    breadcrumb: 'Pre-Wedding Film',
  },
  [routes.services.preWeddingPhotography]: {
    title: 'Pre-Wedding Photography',
    breadcrumb: 'Pre-Wedding Photography',
  },
  [routes.services.civilMarriagePhotography]: {
    title: 'Civil Marriage Photography',
    breadcrumb: 'Civil Marriage Photography',
  },
  [routes.services.engagementPhotography]: {
    title: 'Engagement Photography',
    breadcrumb: 'Engagement Photography',
  },
  [routes.services.birthdayPhotography]: {
    title: 'Birthday Photography',
    breadcrumb: 'Birthday Photography',
  },
  [routes.services.babyShowerPhotography]: {
    title: 'Baby Shower Photography',
    breadcrumb: 'Baby Shower Photography',
  },
  [routes.services.graduationPhotography]: {
    title: 'Graduation Photography',
    breadcrumb: 'Graduation Photography',
  },
  [routes.weddingTypes.hindu]: {
    title: 'Hindu Wedding',
    breadcrumb: 'Hindu Wedding',
  },
};

export default routes;
