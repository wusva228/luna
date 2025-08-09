import React, { useState, useRef, useEffect } from 'react';
import { uploadFile } from '../services/uploadService';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (photoUrl: string) => void;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Ошибка доступа к камере:", err);
      setError("Не удалось получить доступ к камере. Пожалуйста, проверьте разрешения в настройках вашего браузера.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    // Cleanup on component unmount
    return () => stopCamera();
  }, [isOpen]);


  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  };

  const handleSubmit = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    try {
      const blob = await (await fetch(capturedImage)).blob();
      const file = new File([blob], `verification-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const uploadedUrl = await uploadFile(file);
      onSubmit(uploadedUrl);
    } catch (err) {
      console.error("Ошибка при загрузке фото верификации:", err);
      setError("Не удалось загрузить фото. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const CameraView = () => (
      <div className="relative w-full h-64 mx-auto my-4 bg-gray-900 rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
         <div className="absolute inset-0 border-4 border-dashed border-blue-400 rounded-lg pointer-events-none"></div>
      </div>
  );
  
  const CapturedImageView = () => (
    <div className="relative w-full h-64 mx-auto my-4">
        <img src={capturedImage!} alt="Снимок для верификации" className="w-full h-full object-contain rounded-lg" />
    </div>
  );

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-6 relative border border-gray-700 animate-slide-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-center">Подтверждение возраста</h2>
        
        {error && <p className="text-red-400 text-center text-sm my-2">{error}</p>}
        
        {capturedImage ? <CapturedImageView /> : <CameraView />}

        <div className="mt-4 space-y-2">
            {capturedImage ? (
                <>
                    <button onClick={handleSubmit} disabled={isLoading} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:bg-gray-600">
                        {isLoading ? 'Загрузка...' : 'Отправить фото на проверку'}
                    </button>
                    <button onClick={retakePicture} disabled={isLoading} className="w-full py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm font-semibold transition-colors">
                        Сделать другой снимок
                    </button>
                </>
            ) : (
                <button onClick={takePicture} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                    Сделать снимок
                </button>
            )}
        </div>

      </div>
    </div>
  );
};