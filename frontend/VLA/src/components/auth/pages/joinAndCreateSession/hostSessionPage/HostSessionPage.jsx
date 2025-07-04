import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HostSessionPage.module.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { hostSessionThunk } from '../../../../../store/slices/sessionSlice';


const HostSessionPage = () => {
  const navigate = useNavigate();
  const userEmail = JSON.parse(localStorage.getItem('streamUserEmail'));
  const userId = JSON.parse(localStorage.getItem('streamUserId'));
  const dispatch = useDispatch();

  const [topic, setTopic] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [sessionLink, setSessionLink] = useState('');
  const [showModal, setShowModal] = useState(false);

  const convertToUTC = (localTime) => {
    const date = new Date(localTime);
    return date.toISOString(); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert("User is not logged in.");
      return;
    }
      dispatch(hostSessionThunk({
        topic,
        startTime,
        endTime,
      }))
        .unwrap()
        .then((res) => {
          if(!res || !res.session){
            console.log("No session created or returned."); 
            return;
          }

          const link = res.session.link;
          // console.log("Session link:", link);
          setSessionLink(link);
          setShowModal(true);

          setTimeout(() => {
            navigate(`/session/${res.session.sessionId}`);
          }, 6000); 
        })
        .catch((err) => {
          console.error('Failed to host meeting:', err.message);
          if(err?.response?.data){
            console.log('Backend Error: ', err.response.data);
          }
          else if(typeof err === 'string'){
            console.log('Thunk rejection: ', err);
          }
        });
    };

  return (
    <div className={styles.hostSessionContainer}>
      <div className={styles.formWrapper}>
        <h2>Create a New Meeting</h2>
        <form onSubmit={handleSubmit} className={styles.hostForm}>
          <div className={styles.formGroup}>
            <label htmlFor="topic" className={styles.hostLabel}>Meeting Topic</label>
            <input
              id="topic"
              type="text"
              className={styles.hostInput}
              placeholder="e.g. Meeting Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="startTime" className={styles.hostLabel}>Start Time</label>
            <input
              id="startTime"
              type="datetime-local"
              className={styles.hostInput}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endTime" className={styles.hostLabel}>End Time</label>
            <input
              id="endTime"
              type="datetime-local"
              className={styles.hostInput}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Host Meeting
          </button>
        </form>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Meeting Link</h3>
              <a
                href={sessionLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkText}
              >
                {sessionLink}
              </a>

              <div className={styles.copyWrapper}>
                <button
                  className={styles.copyButton}
                  onClick={() => {
                    navigator.clipboard.writeText(sessionLink);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Copy Link
                </button>
              </div>

              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostSessionPage;
