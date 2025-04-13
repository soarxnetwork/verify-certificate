'use client';

import { useEffect, useRef, useState } from 'react';
import { createWorker } from 'tesseract.js';
import { FaSpinner, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';

type ImageOcrProps = {
  onTextExtracted: (text: string) => void;
};

const ImageOcr = ({ onTextExtracted }: ImageOcrProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string>('');
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      toast.error('❌ Unable to access the camera.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'capture.png', { type: 'image/png' });
          setSelectedImage(file);
          stopCamera();
        }
      }, 'image/png');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedImage(event.target.files[0]);
      setOcrResult('');
      setOcrStatus('');
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setOcrStatus('Processing...');
    const worker = await createWorker('eng', 1, {
      logger: (m) => console.log(m),
    });

    try {
      const {
        data: { text },
      } = await worker.recognize(selectedImage);
      const cleanText = text.trim();
      setOcrResult(cleanText);
      onTextExtracted(cleanText);
      setOcrStatus('Completed');
      toast.success('✅ Text extracted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('❌ OCR failed.');
      setOcrStatus('Error occurred during processing.');
    } finally {
      await worker.terminate();
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow w-full max-w-md mx-auto relative">
      <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4">OCR from Image or Camera</h2>

      {!cameraActive && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          <button
            onClick={startCamera}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            <FaCamera />
            Use Camera
          </button>
        </div>
      )}

      {cameraActive && (
        <div className="mb-4">
          <video ref={videoRef} autoPlay playsInline className="rounded w-full" />
          <button
            onClick={captureImage}
            className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Capture Image
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="my-4">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="rounded shadow w-full"
          />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={processImage}
          disabled={isProcessing}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? <FaSpinner className="animate-spin" /> : 'Extract Text'}
        </button>

        {cameraActive && (
          <button
            onClick={stopCamera}
            className="text-red-500 hover:text-red-600 font-semibold text-sm"
          >
            Stop Camera
          </button>
        )}
      </div>

      {ocrStatus && (
        <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">Status: {ocrStatus}</p>
      )}

      {ocrResult && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-800 dark:text-white">
          <h4 className="font-semibold mb-1">Extracted Text:</h4>
          <p
            dangerouslySetInnerHTML={{
              __html: ocrResult.replace(/\n/g, '<br />').replace(/[=,—,-,+]/g, ' '),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageOcr;
