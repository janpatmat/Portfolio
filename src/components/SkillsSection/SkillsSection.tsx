import { FaAws, FaBrain, FaDatabase, FaJava, FaRobot } from 'react-icons/fa';
import {
  SiAdobelightroom,
  SiAdobephotoshop,
  SiClaude,
  SiCss3,
  SiDocker,
  SiFastapi,
  SiFlutter,
  SiHtml5,
  SiJavascript,
  SiJenkins,
  SiJira,
  SiLaravel,
  SiLinux,
  SiMysql,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTypescript,
  SiVuedotjs,
  SiWordpress,
} from 'react-icons/si';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SectionHeading from '../SectionHeading/SectionHeading';
import styles from './SkillsSection.module.scss';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const skills = [
  { name: 'JavaScript', area: 'Language', Icon: SiJavascript, color: '#f7df1e' },
  { name: 'TypeScript', area: 'Language', Icon: SiTypescript, color: '#4a90d9' },
  { name: 'Python', area: 'Language', Icon: SiPython, color: '#4b8bbe' },
  { name: 'Java', area: 'Language', Icon: FaJava, color: '#f89820' },
  { name: 'SQL', area: 'Language', Icon: FaDatabase, color: '#b0bec5' },
  { name: 'HTML', area: 'Language', Icon: SiHtml5, color: '#e34f26' },
  { name: 'CSS', area: 'Language', Icon: SiCss3, color: '#4d9de0' },
  { name: 'Next.js', area: 'Framework', Icon: SiNextdotjs, color: '#ffffff' },
  { name: 'React', area: 'Framework', Icon: SiReact, color: '#61dafb' },
  { name: 'Vue.js', area: 'Framework', Icon: SiVuedotjs, color: '#4fc08d' },
  { name: 'Flutter', area: 'Framework', Icon: SiFlutter, color: '#54c5f8' },
  { name: 'FastAPI', area: 'Framework', Icon: SiFastapi, color: '#05b8a6' },
  { name: 'Node.js', area: 'Framework', Icon: SiNodedotjs, color: '#5fa04e' },
  { name: 'Laravel', area: 'Framework', Icon: SiLaravel, color: '#ff2d20' },
  { name: 'RAG', area: 'AI', Icon: FaBrain, color: '#ef5da8' },
  { name: 'Agentic AI (Claude)', area: 'AI', Icon: SiClaude, color: '#d97757' },
  { name: 'LLM Integration', area: 'AI', Icon: FaRobot, color: '#9db2ad' },
  { name: 'AWS', area: 'Cloud & DevOps', Icon: FaAws, color: '#ff9900' },
  { name: 'Docker', area: 'Cloud & DevOps', Icon: SiDocker, color: '#2496ed' },
  { name: 'NGINX', area: 'Cloud & DevOps', Icon: SiNginx, color: '#1fb456' },
  { name: 'Linux', area: 'Cloud & DevOps', Icon: SiLinux, color: '#fcc624' },
  { name: 'Jenkins', area: 'Cloud & DevOps', Icon: SiJenkins, color: '#d24939' },
  { name: 'PostgreSQL', area: 'Data', Icon: SiPostgresql, color: '#6f8fe8' },
  { name: 'MySQL', area: 'Data', Icon: SiMysql, color: '#5e9ccf' },
  { name: 'Jira', area: 'Tool', Icon: SiJira, color: '#4c9aff' },
  { name: 'WordPress', area: 'Tool', Icon: SiWordpress, color: '#4aa3df' },
  { name: 'Photoshop', area: 'Tool', Icon: SiAdobephotoshop, color: '#31a8ff' },
  { name: 'Lightroom', area: 'Tool', Icon: SiAdobelightroom, color: '#31a8ff' },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading label="Skills">
          The Tools I <span className="accent">Work With</span>
        </SectionHeading>

      </div>

      <Swiper
        className={styles.slider}
        wrapperTag="ul"
        modules={[Autoplay]}
        loop
        grabCursor
        speed={reducedMotion ? 300 : 2000}
        autoplay={reducedMotion ? false : { delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          340: { slidesPerView: 2 },
          650: { slidesPerView: 3 },
          850: { slidesPerView: 4 },
          1050: { slidesPerView: 5 },
          1270: { slidesPerView: 6 },
          1470: { slidesPerView: 7 },
          1700: { slidesPerView: 8 },
        }}
      >
        {skills.map(({ name, area, Icon, color }) => (
          <SwiperSlide key={name} tag="li" className={styles.slide}>
            <div className={styles.skill}>
              <div className={styles.iconWrap}>
                <Icon className={styles.icon} style={{ color }} aria-hidden="true" />
              </div>
              <h3 className={styles.name}>{name}</h3>
              <span className={styles.area}>{area}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SkillsSection;
