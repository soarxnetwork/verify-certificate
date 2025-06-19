"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScannerState,
} from "html5-qrcode";
import Tesseract from "tesseract.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PDFDocument } from "pdf-lib";
const VerifyMyCertificate: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [scannerStarted, setScannerStarted] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [zoomValue, setZoomValue] = useState(1);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);


  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrRegionId = "qr-reader";

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        setCameras(
          devices.map((device) => ({
            deviceId: device.id,
            label: device.label,
            kind: "videoinput",
            groupId: "",
            toJSON: () => ({ deviceId: device.id, label: device.label }),
          })) as MediaDeviceInfo[]
        );
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
          console.warn("QR Scan error:", errorMessage);
        }
      );

      setCurrentCamera(deviceId);
      setScannerStarted(true);
    } catch (err) {
      toast.error("❌ Failed to access camera.");
      console.error(err);
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
      const capabilities = track?.getCapabilities?.();

      if (!track || !(capabilities as any)?.torch) {
        toast.error("❌ Flashlight not supported");
        return;
      }

      await track.applyConstraints({
        advanced: [{ torch: !torchOn }] as unknown as MediaTrackConstraintSet[],
      });
      setTorchOn((prev) => !prev);
    } catch (err) {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const html5Qr = new Html5Qrcode(qrRegionId);
    try {
      const result = await html5Qr.scanFile(file, true);
      const match = result.match(/\/v\/([a-zA-Z0-9-_]+)/);
      if (match?.[1]) {
        setManualInput(match[1]);
        toast.success("✅ QR code from image scanned!");
        return;
      }
    } catch (err) {
      console.log("QR not detected, trying OCR...");
    }

    try {
      const imageDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const {
        data: { text },
      } = await Tesseract.recognize(imageDataUrl, "eng", {
        logger: (m) => console.log(m),
      });

      const match = text.match(/\/v\/([a-zA-Z0-9-_]+)/);
      if (match?.[1]) {
        setManualInput(match[1]);
        toast.success("✅ Text extracted using OCR!");
      } else {
        toast.error("❌ No valid certificate ID found with OCR.");
      }
    } catch (err) {
      toast.error("❌ OCR failed.");
      console.error("OCR Error:", err);
    } finally {
      html5Qr.clear();
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setPdfLoading(true); // Start loader

  try {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const pdfBytes = new Uint8Array(reader.result as ArrayBuffer);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const page = pdfDoc.getPages()[0];
        const viewport = page.getSize();

        // Render the page as an image
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");

        const img = new Image();
        img.onload = async () => {
          context?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imageDataUrl = canvas.toDataURL("image/png");

          // Try QR code from rendered image
          const html5Qr = new Html5Qrcode(qrRegionId);
          try {
            const blob = await fetch(imageDataUrl).then((res) => res.blob());
            const fileFromBlob = new File([blob], "image.png", { type: "image/png" });
            const result = await html5Qr.scanFile(fileFromBlob, true);
            const match = result.match(/\/v\/([a-zA-Z0-9-_]+)/);
            if (match?.[1]) {
              setManualInput(match[1]);
              toast.success("✅ QR code found in PDF image!");
              return;
            }
          } catch {
            console.log("QR not found in PDF image. Trying OCR...");
          }

          // Try OCR
          try {
            const {
              data: { text },
            } = await Tesseract.recognize(imageDataUrl, "eng", {
              logger: (m) => console.log(m),
            });

            const match = text.match(/\/v\/([a-zA-Z0-9-_]+)/);
            if (match?.[1]) {
              setManualInput(match[1]);
              toast.success("✅ Certificate ID found via OCR!");
            } else {
              toast.error("❌ No valid certificate ID found in PDF.");
            }
          } catch (ocrErr) {
            toast.error("❌ OCR failed on PDF image.");
            console.error("OCR Error:", ocrErr);
          } finally {
            html5Qr.clear();
          }
        };

        const pdfImage = await pdfDoc.saveAsBase64({ dataUri: true });
        img.src = pdfImage;
      } catch (err) {
        toast.error("❌ Error processing PDF.");
        console.error(err);
      } finally {
        setPdfLoading(false); // Stop loader
      }
    };

    reader.readAsArrayBuffer(file);
  } catch (err) {
    toast.error("❌ Failed to read PDF.");
    console.error("PDF Error:", err);
    setPdfLoading(false);
  }
};


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) stopScanner();
    };
    const handleUnload = () => stopScanner();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      stopScanner();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    // <div> <ResponsiveContainer children={undefined}/>
    <div className="pt-35 min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-gray-200">
          {scannerStarted ? "Scan QR Code" : "Camera Access Required"}
        </h2>

        <div id={qrRegionId} className="w-full min-h-[250px]" />

        {scannerStarted && (
          <div className="flex flex-col gap-2 w-full mt-4">
            <button
              onClick={switchCamera}
              className=" bg-[#212F42] hover:bg-[#5bcae6] text-white hover:text-[#212F42] px-2 py-1 rounded text-sm"
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
                />
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
            className="mt-4 px-4 py-2 bg-[#212F42] hover:bg-[#5bcae6] text-white hover:text-[#212F42] rounded"
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
            accept="image/*,application/pdf"
            onChange={(e) => {
              if (e.target.files?.[0].type === "application/pdf") {
                handlePdfUpload(e);
              } else {
                handleImageUpload(e);
              }
            }}
            className="hidden"
          />
        </label>

        <p className="text-xl font-bold mb-2 mt-6 text-gray-700 dark:text-gray-200">
          Or Enter Credential ID
        </p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 text-left w-full">
          https://verification.givemycertificate.com/v/
        </p>

        <div className="flex w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter certificate ID here"
              className="w-full mt-1 pl-3 pr-12 p-2 text-black dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#212F42]-400"
            />
            {/* <MdCameraAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 text-2xl" /> */}
          </div>
        </div>

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
                ? " bg-[#212F42] hover:bg-[#5bcae6] text-white hover:text-[#212F42]"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default VerifyMyCertificate;
