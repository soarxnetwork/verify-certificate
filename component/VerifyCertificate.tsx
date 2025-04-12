"use client";

import React, { useRef, useState, useEffect } from "react";

import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScannerState,
} from "html5-qrcode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyMyCertificate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [scannerStarted, setScannerStarted] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [zoomValue, setZoomValue] = useState(1);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrRegionId = "qr-reader";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        const mappedDevices = devices.map((device) => ({
          deviceId: device.id,
          label: device.label,
          kind: "videoinput",
          groupId: "",
          toJSON: () => ({ deviceId: device.id, label: device.label }),
        }));
        setCameras(mappedDevices as MediaDeviceInfo[]);
      })
      .catch(console.error);
  }, []);

  const startScanner = async (deviceId: string) => {
    if (scannerRef.current) await stopScanner();

    setLoading(true);
    try {
      const html5Qr = new Html5Qrcode(qrRegionId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });

      scannerRef.current = html5Qr;

      await html5Qr.start(
        { deviceId: { exact: deviceId } },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          const match = decodedText.match(/\/v\/([a-zA-Z0-9-_]+)/);
          if (match?.[1]) {
            setManualInput(match[1]);
            toast.success("✅ QR Code Scanned!");
            toast.info("📋 ID filled. Click 'Verify' to continue.");
            await stopScanner();
          } else {
            toast.error("❌ Invalid QR Code");
          }
        },
        (errorMessage) => {
          // Optional: log or ignore scanning errors
          console.warn("QR Scan error:", errorMessage);
        }
      );
      

      setCurrentCamera(deviceId);
      setScannerStarted(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast.error("❌ Failed to access camera.");
    } finally {
      setLoading(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (
          scannerRef.current.getState?.() === Html5QrcodeScannerState.SCANNING
        ) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
        scannerRef.current = null;
        setScannerStarted(false);
        setTorchOn(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const toggleFlashlight = async () => {
    try {
      const videoElement = document.querySelector("video") as HTMLVideoElement;
      const stream = videoElement?.srcObject as MediaStream;
      const track = stream?.getVideoTracks?.()[0];
  
      if (!track) {
        toast.error("❌ No video track found");
        return;
      }
  
      // Bypass TypeScript's type checking for 'torch'
      const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean };
      if (!capabilities?.torch) {
        toast.error("❌ Flashlight not supported on this device");
        return;
      }
  
      await track.applyConstraints({
        advanced: [{ torch: !torchOn }] as unknown as MediaTrackConstraintSet[],
      });
      
  
      setTorchOn((prev) => !prev);
    } catch (err) {
      console.error("Torch toggle error:", err);
      toast.error("❌ Failed to toggle flashlight");
    }
  };
  

  const switchCamera = () => {
    if (!cameras.length) return;
    const nextIndex =
      (cameras.findIndex((cam) => cam.deviceId === currentCamera) + 1) %
      cameras.length;
    startScanner(cameras[nextIndex].deviceId);
  };

  const handleZoomChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zoom = parseFloat(e.target.value);
    setZoomValue(zoom);
    if (scannerRef.current) {
        await (scannerRef.current as any)?.applyVideoConstraints?.({
            advanced: [{ zoom }],  
      });
    }
  };

  const handleImageScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5Qr = new Html5Qrcode(qrRegionId);

    try {
      const result = await html5Qr.scanFile(file, true);
      const match = result.match(/\/v\/([a-zA-Z0-9-_]+)/);
      if (match?.[1]) {
        setManualInput(match[1]);
        toast.success("✅ QR code from image scanned!");
      } else {
        toast.error("❌ No valid certificate ID found in image.");
      }
    } catch (err) {
      toast.error("❌ Could not scan QR from image.");
      console.error("Image scan error:", err);
    } finally {
      html5Qr.clear();
    }
  };

  const triggerRedirect = (value: string) => {
    const input = value.trim();
    if (!input) {
      toast.error("❌ Certificate ID is empty");
      return;
    }

    toast.success("🔍 Verifying...");
    setTimeout(() => {
      window.location.href = `https://verification.givemycertificate.com/v/${input}`;
    }, 1000);
  };

  // ✅ Stop camera on tab change or navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopScanner();
      }
    };

    const handleUnload = () => {
      stopScanner();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      stopScanner();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (

    <div className="min-h-screen  flex justify-center items-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <div className="bg-white dark:bg-gray-800  p-4 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-200">
          {scannerStarted ? "Scan QR Code" : "Camera Access Required"}
        </h2>
        
        <div id={qrRegionId} className="w-full min-h-[250px]" />

        {scannerStarted && (
          <div className="flex flex-col gap-2 w-full mt-4">
            <button
              onClick={switchCamera}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Switch Camera
            </button>

            {isMobile && (
              <>
                <button
                  onClick={toggleFlashlight}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  {torchOn ? "Flash Off" : "Flash On"}
                </button>

                <div className="w-full">
                  <label className="text-sm text-gray-600 dark:text-gray-300">
                    Zoom: {zoomValue.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoomValue}
                    onChange={handleZoomChange}
                    className="w-full"
                    title="Zoom level"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {!scannerStarted && !loading && (
          <button
            onClick={() =>
              startScanner(
                cameras.find((cam) =>
                  cam.label.toLowerCase().includes("back")
                )?.deviceId || cameras[0]?.deviceId
              )
            }
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Allow Camera
          </button>
        )}

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <label className="mt-4 w-full text-center text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">
          Upload Certificate
          <input
            type="file"
            accept="image/*"
            onChange={handleImageScan}
            className="hidden"
          />
        </label>

        <p className="text-xl font-bold mb-2 mt-6 text-gray-700 dark:text-gray-200">
          Or Enter Credential ID
        </p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 text-left w-full">
          https://verification.givemycertificate.com/v/
        </p>

        <input
          className="w-full mt-1 text-black dark:text-white p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          type="text"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Enter certificate ID here"
        />

        <div className="flex gap-4 mt-4 w-full justify-end">
          <button
            onClick={stopScanner}
            disabled={!scannerStarted}
            className={`px-4 py-2 rounded text-white ${
              !scannerStarted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={() => triggerRedirect(manualInput)}
            disabled={!manualInput.trim()}
            className={`px-4 py-2 rounded text-white ${
              manualInput.trim()
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyMyCertificate; 