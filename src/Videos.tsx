import React, { useState, useRef } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { ReactComponent as HangupIcon } from "./icons/hangup.svg";
import { ReactComponent as MoreIcon } from "./icons/more-vertical.svg";
import { ReactComponent as CopyIcon } from "./icons/copy.svg";

// Initialize WebRTC
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);

interface VideosProps {
  mode: string;
  callId: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

function Videos({ mode, callId, setPage }: VideosProps) {
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(callId);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  // 1. Setup media sources
  const setupSources = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 200,
        height: 120,
      },
      audio: true,
    });
    const remoteStream = new MediaStream();

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    if (!localRef.current || !remoteRef.current) return;
    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);

    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "disconnected") {
        console.log("disconnected");

        hangUp();
      }
    };

    if (mode === "create") {
      // 2. Create an offer
      const callDocRef = doc(collection(db, "calls"));
      const offerCandidates = collection(callDocRef, "offerCandidates");
      const answerCandidates = collection(callDocRef, "answerCandidates");

      setRoomId(callDocRef.id);

      pc.onicecandidate = async (event) => {
        if (!event.candidate) return;
        await addDoc(offerCandidates, event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callDocRef, { offer });

      // Listen for remote answer
      onSnapshot(callDocRef, (snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      // When answered, add candidate to peer connection
      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    } else if (mode === "join") {
      // 3. Answer the call with the unique ID
      const callDocRef = doc(db, "calls", callId);
      const callDoc = await getDoc(callDocRef);
      const answerCandidates = collection(callDocRef, "answerCandidates");
      const offerCandidates = collection(callDocRef, "offerCandidates");

      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        addDoc(answerCandidates, event.candidate.toJSON());
      };

      const callData = callDoc.data();
      if (!callData) return;

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await setDoc(callDocRef, { answer });

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }
  };

  const hangUp = async () => {
    pc.close();

    if (roomId) {
      const roomDocRef = doc(db, "calls", roomId);
      (await getDocs(collection(roomDocRef, "answerCandidates"))).docs.forEach(
        (doc) => {
          deleteDoc(doc.ref);
        }
      );

      (await getDocs(collection(roomDocRef, "offerCandidates"))).docs.forEach(
        (doc) => {
          deleteDoc(doc.ref);
        }
      );
      await deleteDoc(roomDocRef);
    }

    window.location.reload();
  };

  return (
    <div>
      <video ref={localRef} autoPlay playsInline muted />
      <video ref={remoteRef} autoPlay playsInline />

      <div>
        <button onClick={hangUp} disabled={!webcamActive} aria-label="hangup">
          Hangup
          <HangupIcon />
        </button>
        <div tabIndex={0} role="button">
          <MoreIcon />
          <div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(roomId);
              }}
            >
              <CopyIcon />
              Copy joining code
            </button>
          </div>
        </div>
      </div>

      {!webcamActive && (
        <div>
          <div>
            <h3>Turn on your camera and microphone and start the call</h3>
            <div>
              <button onClick={() => setPage("home")}>Cancel</button>
              <button onClick={setupSources}>Start</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Videos;
