import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';

export const cvUrl = `${import.meta.env.BASE_URL}Jan_Patrick_Matayabas_Software_Engineer_Resume.pdf`;

export const contactEmail = 'patmatayabas@gmail.com';
export const location = 'Davao City, Philippines';

export const socialLinks = [
  {
    label: 'LinkedIn',
    handle: 'jan-patrick-matayabas',
    url: 'https://www.linkedin.com/in/jan-patrick-matayabas-a75a31245/',
    Icon: FaLinkedin,
  },
  {
    label: 'GitHub',
    handle: 'janpatmat',
    url: 'https://github.com/janpatmat',
    Icon: FaGithub,
  },
  {
    label: 'Facebook',
    handle: 'janpatrick.matayabas',
    url: 'https://www.facebook.com/janpatrick.matayabas',
    Icon: FaFacebook,
  },
];
