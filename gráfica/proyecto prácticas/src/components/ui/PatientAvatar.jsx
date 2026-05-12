import { useRef, useState, useEffect } from 'react';

export function PatientAvatar({ patientId, size = 36, borderRadius = '10px', style = {} }) {
  const STORAGE_KEY = `physiotrack_photo_${patientId}`;
  const [photo, setPhoto] = useState(() => localStorage.getItem(STORAGE_KEY));
  const inputRef = useRef(null);

  useEffect(() => {
    setPhoto(localStorage.getItem(STORAGE_KEY));
  }, [STORAGE_KEY]);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      localStorage.setItem(STORAGE_KEY, base64);
      setPhoto(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const cameraIcon = (
    <div style={{
      position: 'absolute', bottom: 2, right: 2,
      width: 14, height: 14,
      background: 'rgba(0,0,0,0.45)',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    </div>
  );

  return (
    <div
      onClick={handleClick}
      title="Cambiar foto de perfil"
      style={{
        width: size, height: size,
        borderRadius,
        background: 'linear-gradient(135deg,#6366F1,#4F46E5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {photo ? (
        <img
          src={photo}
          alt="Foto de perfil"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)" />
          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="rgba(255,255,255,0.9)" />
        </svg>
      )}
      {cameraIcon}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
}
