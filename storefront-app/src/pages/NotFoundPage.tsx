import React from 'react';
import { RollingTextButton } from '../components/ui/RollingTextButton';
import { useRouter } from '../context/RouterContext';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-[80vh] bg-[#0b0b0b] text-white flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      <span className="font-mono text-[11px] uppercase tracking-widest text-[#ff4500]">
        ERROR // 404 ARCHIVE INDEX
      </span>
      <h1 className="font-sans text-[56px] sm:text-[88px] font-semibold tracking-[-0.05em] leading-[0.85em] uppercase mt-3">
        PIECE NOT
        <br />
        IN VAULT.
      </h1>
      <p className="mt-6 text-sm text-white/65 max-w-[380px] leading-relaxed">
        The requested archive route does not exist or the garment has moved out of public circulation.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <RollingTextButton variant="orange" onClick={() => navigate('/shop')} className="font-mono text-xs">
          EXPLORE LIVE DROPS →
        </RollingTextButton>
        <RollingTextButton variant="ghost" onClick={() => navigate('/')} className="font-mono text-xs">
          RETURN HOME
        </RollingTextButton>
      </div>
    </div>
  );
};
