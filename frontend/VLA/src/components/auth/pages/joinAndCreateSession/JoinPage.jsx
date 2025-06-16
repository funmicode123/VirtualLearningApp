import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './JoinPage.module.css';


const JoinPage = () => {
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  // const handleJoin = () => {

  //   navigate(`/session/${encodeURIComponent(link)}`);
  // };

  return (
    <div className={styles.joinPageContainer}>
      <h2>Enter Session Link</h2>
      <input
        type="text"
        placeholder="Paste session link here..."
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className={styles.joinInput}
      />
      <button className={styles.joinButton} >Join Session</button>

      {/* <button className={styles.joinButton} onClick={handleJoin}>Join Session</button> */}
    </div>
  );
};

export default JoinPage;
