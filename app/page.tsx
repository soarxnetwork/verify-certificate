import VerifyMyCertificate from "@/component/VerifyCertificate";
import { ToastContainer } from 'react-toastify';

export default function Home() {

  return <><ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>

  <VerifyMyCertificate /></>;
}
