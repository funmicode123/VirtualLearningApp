import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { joinSessionThunk } from '../../../../store/slices/sessionSlice';
import styles from './JoinPage.module.css';
import { useSelector } from 'react-redux';

const extractLinkCode = (url) => {
  try {
    const parts = url.trim().split('/');
    return parts[parts.length - 1];
  } catch {
    return null;
  }
};

const JoinPage = () => {
  const [link, setLink] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isJoining } = useSelector((state) => state.session || {});

  const handleJoin = async () => {
    const linkCode = extractLinkCode(link);
    if (!linkCode) return alert('Invalid link');
    
    const res = await dispatch(joinSessionThunk(linkCode));
    if (joinSessionThunk.fulfilled.match(res)) {
      // const sessionId = res.payload.session.id;
      navigate('/liveSession'); 
    } else {
      alert(res.payload?.message || 'Join failed');
      console.log(res.message)
    }
  };

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
      <button onClick={handleJoin} className={styles.joinButton}>
        {isJoining ? 'Joining...' : 'Join Session'}
      </button>
    </div>
  );
};

export default JoinPage;
