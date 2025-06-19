import React from 'react';
import styles from './JoinAndCreateSession.module.css';
import JoinMeetingButton from './JoinMeetingButton';
import {useNavigate} from 'react-router-dom';

const ZoomLandingPage = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/join');
  };

  const handleHost = () => {
    navigate('/host');
  };

  return (
    <div className={styles.zoomContainer}>
      <div className={styles.zoomCard}>
        <h1 className={styles.zoomLogo}>Virtual Learning</h1>
        <h2 className={styles.zoomTitle}>Session</h2>

        <div className={styles.zoomButtons}>
          <JoinMeetingButton label="Join Meeting" onClick={handleJoin} />
          <JoinMeetingButton label="Host Meeting" onClick={handleHost} />
        </div>

        <div className="zoom-footer">
          <p>About Zoom</p>
          <select className="zoom-language">
            <option>English</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ZoomLandingPage;