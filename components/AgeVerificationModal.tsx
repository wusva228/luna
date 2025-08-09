import React, { useState, useRef } from 'react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (photoDataUrl: string) => void;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: face scan, 2: document upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setPhoto(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (photo) {
      onSubmit(photo);
    } else {
      alert('Пожалуйста, загрузите фото документа.');
    }
  };
  
  const FaceScanStep = () => (
    <>
      <div className="relative w-64 h-64 mx-auto my-4">
        <div className="absolute inset-0 border-4 border-dashed border-blue-400 rounded-full animate-spin"></div>
        <div className="absolute inset-4 bg-blue-500/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
      </div>
      <p className="text-gray-300 text-center mb-6">Поместите ваше лицо в рамку. Это займет секунду.</p>
      <button onClick={() => setStep(2)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">Далее</button>
    </>
  );

  const DocumentUploadStep = () => (
     <>
        <div className="text-center my-4">
            {photo ? (
                <img src={photo} alt="Preview" className="w-auto h-40 mx-auto rounded-lg border-2 border-green-500" />
            ) : (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-gray-400 mt-2">Загрузить фото документа</p>
                </div>
            )}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
        </div>
        <p className="text-gray-300 text-center mb-6 text-sm">Подойдет фото паспорта или водительского удостоверения. Данные будут использованы только для подтверждения возраста.</p>
        <button onClick={handleSubmit} disabled={!photo} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Завершить верификацию</button>
     </>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-6 relative border border-gray-700 animate-slide-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-center">Подтверждение возраста</h2>
        <p className="text-gray-400 text-center text-sm mb-4">Шаг {step} из 2</p>

        {step === 1 ? <FaceScanStep /> : <DocumentUploadStep />}
      </div>
    </div>
  );
};