// LiveSession.jsx
import React, { useRef, useEffect } from 'react';

export default function LiveSession() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
      })
      .catch(err => {
        console.error('Error accessing media devices.', err);
      });

    // You can then connect to signaling server (e.g., WebSocket) for peer-to-peer setup
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-xl mb-4">Live Video Session</h2>

      <div className="grid grid-cols-2 gap-4">
        <video ref={localVideoRef} autoPlay muted className="rounded shadow-lg w-80 h-60 bg-gray-800" />
        <video ref={remoteVideoRef} autoPlay className="rounded shadow-lg w-80 h-60 bg-gray-800" />
      </div>

      <div className="mt-6 flex gap-4">
        <button className="bg-red-500 px-6 py-2 rounded">Leave</button>
        <button className="bg-gray-700 px-6 py-2 rounded">Mute</button>
        <button className="bg-gray-700 px-6 py-2 rounded">Video</button>
      </div>
    </div>
  );
}