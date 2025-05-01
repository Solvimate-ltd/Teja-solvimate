"use client"

import { useUserContext } from '../context/UserContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter()
  const handler = ()=>{
    router.push("/dashboard");
  }

  return (
    <div className="hero bg-base-200 min-h-screen flex flex-col items-center justify-center">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold">Welcome Translation & Transcription Services</h1>
          <p className="py-6">
            Translate & Transcribe content with ease
          </p>
          <button className="btn bg-green-600 px-9 rounded-xl text-white text-l mb-6" onClick={handler}>
            Get Started
          </button>
        </div>
      </div>

      {/* Image below the button */}
      <div className="w-full px-4 md:px-12 lg:px-24">
        <div className="w-full max-h-[25vh] overflow-hidden rounded-lg shadow-md">
          <Image
            src="/images/landing.jpeg"
            alt="Translation visual"
            width={1920}
            height={512}
            className="w-full h-auto object-contain md:object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
