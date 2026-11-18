import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Project, projectImage, projectInitials } from '../../data/projects';
import { motionEnabled, pauseScroll, resumeScroll } from '../../hooks/motion/loop';
import styles from './ProjectDetail.module.scss';

interface ProjectDetailProps {
  project: Project | null;
  opener: HTMLElement | null;
  onClose: () => void;
}

// A modal with a project's full details. The native dialog keeps focus inside and makes the
// page behind it inert; closing animates out, then returns focus to the card that opened it.
const ProjectDetail = ({ project, opener, onClose }: ProjectDetailProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const [shown, setShown] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const el = dialog.current;
    if (!project || !el) return;
    if (!el.open) el.showModal();
    pauseScroll();
    document.documentElement.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [project]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setShown(false);
    setTimeout(() => {
      dialog.current?.close();
      resumeScroll();
      document.documentElement.style.overflow = '';
      closing.current = false;
      opener?.focus();
      onClose();
    }, motionEnabled ? 350 : 0);
  }, [opener, onClose]);

  const image = project && projectImage(project);

  return (
    <dialog
      ref={dialog}
      className={`${styles.detail} ${shown ? styles.open : ''}`}
      aria-labelledby={titleId}
      // Lenis is paused while the panel is open; this lets wheel and touch scroll the panel itself
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {project && (
        <div className={`on-paper ${styles.panel}`} data-panel>
          <div className={styles.media}>
            {image ? (
              <img src={image} alt={project.imageAlt} width={540} height={360} />
            ) : (
              <span className={`serif ${styles.placeholder}`}>{projectInitials(project)}</span>
            )}
          </div>

          <div className={styles.body}>
            <span className={styles.key}>{project.category}</span>
            <h3 id={titleId} className="serif">
              {project.title}
            </h3>
            <p>{project.description}</p>
            <span className={styles.key}>{project.contributionTitle}</span>
            <p>{project.contribution}</p>
            <span className={styles.key}>{project.functionTitle}</span>
            <p>{project.functionDescription}</p>

            <div className={styles.actions}>
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  Visit project →
                </a>
              )}
              {project.offline && <span className={styles.offline}>Website is no longer up</span>}
              <button type="button" onClick={close}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default ProjectDetail;
