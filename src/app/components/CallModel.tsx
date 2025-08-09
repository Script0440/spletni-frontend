import React, { useEffect, useState, useRef } from 'react';
import {
  LiveKitRoom,
  useRoomContext,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { AudioDebug } from './AudioDebug';
import styled from 'styled-components';
import Avatar from './Avatar';



const Container = styled(LiveKitRoom)`
	display:flex;
	background:transparent;
	flex-direction:column;
	justify-content:space-between;
	align-items:center;
	height:100%;
`

// 🔊 Компонент для воспроизведения аудио удалённых участников
const AudioTracks = () => {
  // Получаем аудио-треки микрофонов всех участников (кроме локального)
  const tracks = useTracks([Track.Source.Microphone]);

  return (
    <>
      {tracks.map(trackRef => (
        <AudioPlayer key={trackRef.publication.trackSid} track={trackRef.publication.track} />
      ))}
    </>
  );
};

// Компонент, который подключает аудиотрек к <audio>
const AudioPlayer = ({ track }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!track || !audioRef.current) return;

    const el = audioRef.current;
    // Создаём MediaStream из MediaStreamTrack и подключаем к элементу <audio>
    el.srcObject = new MediaStream([track.mediaStreamTrack]);
    el.play().catch(() => {
      // Игнорируем ошибку автозапуска, браузеры могут блокировать
    });

    return () => {
      el.srcObject = null;
    };
  }, [track]);

  return <audio ref={audioRef} autoPlay controls={false} />;
};

// 🎛 Контролы микрофона и камеры
const Controls = () => {
  const { localParticipant } = useRoomContext();

  const toggleAudio = () => {
    const enabled = !localParticipant.isMicrophoneEnabled;
    localParticipant.setMicrophoneEnabled(enabled);
    console.log(`🎙 Микрофон: ${enabled ? 'Включен' : 'Выключен'}`);
  };

  const toggleVideo = () => {
    const enabled = !localParticipant.isCameraEnabled;
    localParticipant.setCameraEnabled(enabled);
    console.log(`📷 Камера: ${enabled ? 'Включена' : 'Выключена'}`);
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <button onClick={toggleAudio}>🎙 Микрофон Вкл/Выкл</button>
      <button onClick={toggleVideo} style={{ marginLeft: 10 }}>📷 Камера Вкл/Выкл</button>
    </div>
  );
};

// 📟 Лог событий комнаты
const RoomEventsLogger = () => {
  const room = useRoomContext();

  useEffect(() => {
    const handleParticipantConnected = (participant) => {
      console.log('👤 Участник вошёл:', participant.identity);
    };

    const handleParticipantDisconnected = (participant) => {
      console.log('❌ Участник вышел:', participant.identity);
    };

    room.on('participantConnected', handleParticipantConnected);
    room.on('participantDisconnected', handleParticipantDisconnected);

    return () => {
      room.off('participantConnected', handleParticipantConnected);
      room.off('participantDisconnected', handleParticipantDisconnected);
    };
  }, [room]);

  return null;
};

// 🚀 Главный компонент звонка
const CallModel = () => {
  const [token, setToken] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const roomName = 'myroom';
  const identity = 'user1'; // Заменить на уникальное имя

  const startCall = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/livekit/token?identity=${identity}&room=${roomName}`);
    const data = await res.json();
    setToken(data.token);
    setStarted(true);
  };

  if (!started) return <button onClick={startCall}>📞 Начать звонок</button>;
  if (!token) return <div>⏳ Загрузка...</div>;

  return (
    <Container
      token={token}
      serverUrl="ws://localhost:7880"
      connect={true}
      video={false}  // Камера выключена
      audio={true}   // Микрофон включён
      onConnected={() => console.log("✅ Подключено к комнате")}
      onDisconnected={() => console.log("🚫 Отключено от комнаты")}
      data-lk-theme="default"
    >
		<Avatar size='320px'/>
      <RoomEventsLogger />
      <AudioDebug />
      <Controls />
      <AudioTracks />
    </Container>
  );
};

export default CallModel;
