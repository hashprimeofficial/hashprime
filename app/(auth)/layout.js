'use client';

import { motion } from 'framer-motion';
import LightPillar from '@/components/LightPillar';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-white text-navy relative overflow-hidden flex items-center justify-center pt-24 pb-12">
            {/* Background decorative elements matching Hero */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
                <LightPillar
                    topColor="#39FF14"
                    bottomColor="#10B981"
                    intensity={0.8}
                    rotationSpeed={0.15}
                    glowAmount={0.005}
                    pillarWidth={2}
                    pillarHeight={0.25}
                    noiseIntensity={0.1}
                    pillarRotation={90}
                    interactive={true}
                    mixBlendMode="normal"
                    quality="high"
                />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon opacity-[0.03] rounded-full blur-3xl pointer-events-none z-0"></div>

            <div className="relative z-10 w-full max-w-md mx-auto p-4">
                {children}
            </div>
        </div>
    );
}
