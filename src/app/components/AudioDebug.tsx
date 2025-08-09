import { useRoomContext } from '@livekit/components-react';
import { useEffect } from 'react';

export const AudioDebug = () => {
	const { room } = useRoomContext();

	useEffect(() => {
	  if (!room) return;
 
	  const onTrackSubscribed = (track, participant) => {
		 if (track.kind === 'audio') {
			console.log('Audio track subscribed from:', participant.identity);
			const audioElement = track.attach();
			audioElement.style.position = 'fixed';
			audioElement.style.bottom = '10px';
			audioElement.style.left = '10px';
			audioElement.style.zIndex = '9999';
			audioElement.controls = true;
			document.body.appendChild(audioElement);
		 }
	  };
 
	  room.on('trackSubscribed', onTrackSubscribed);
 
	  return () => {
		 room.off('trackSubscribed', onTrackSubscribed);
	  };
	}, [room]);
 
	useEffect(() => {
		if (!room) return;
	 
		room.on('participantConnected', participant => {
		  console.log('Participant connected:', participant.identity);
		});
	 
		room.on('trackSubscribed', (track, participant) => {
		  console.log(`Track subscribed from ${participant.identity}:`, track.kind);
		});
	 }, [room]);
	 

	return null;
};
