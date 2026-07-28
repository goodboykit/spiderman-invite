import { useState } from 'react';
import BlueBouquet from './components/BlueFlowers';
import Fireworks from './components/Fireworks';
import Envelope from './components/Envelope';
import MusicPlayer from './components/MusicPlayer';
import SpidermanInvite from './components/SpidermanInvite';
import HangoutQuestion from './components/HangoutQuestion';

/**
 * Single-viewport experience — NO scrolling.
 *
 * Scene 1: Bouquet blooms in center (with grass)
 * Scene 2: Fireworks burst around the screen
 * Scene 3: Bouquet fades, envelope appears centered
 * Scene 4: Tap envelope → opens → letter card appears
 * Scene 5: Tap letter screen → Hangout question with GIF & label appears!
 * Scene 6: Tap hangout screen → VIP Spider-Man Movie Pass schedule selection appears!
 */
export default function App() {
  const [fireworksActive, setFireworksActive] = useState(false);
  const [bouquetFading, setBouquetFading] = useState(false);
  const [envelopeVisible, setEnvelopeVisible] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [hangoutVisible, setHangoutVisible] = useState(false);
  const [spidermanVisible, setSpidermanVisible] = useState(false);

  const handleBouquetComplete = () => {
    setFireworksActive(true);
    // Let the CONGRATULATIONS message and fireworks celebrate for 15 seconds, then automatically transition to envelope!
    setTimeout(() => {
      setBouquetFading(true);
      setEnvelopeVisible(true);
    }, 15000);
  };

  const handleFireworksComplete = () => {
    // Fireworks/sparkles done
  };

  const handleEnvelopeOpen = () => {
    setEnvelopeOpened(true);
  };

  const handleNextToHangout = () => {
    setEnvelopeVisible(false);
    setHangoutVisible(true);
  };

  const handleNextToSpiderman = () => {
    setHangoutVisible(false);
    setSpidermanVisible(true);
  };

  const handleSpidermanConfirm = () => {
    // Re-trigger fireworks for confirmation celebration!
    setFireworksActive(false);
    setTimeout(() => setFireworksActive(true), 50);
  };

  return (
    <main
      className="relative w-screen h-[100dvh] overflow-hidden"
      style={{
        background: spidermanVisible || hangoutVisible
          ? 'linear-gradient(170deg, #eaf1f9 0%, #dfe9f4 50%, #d3e2f2 100%)'
          : 'linear-gradient(170deg, #f5f8fc 0%, #eaf1f9 30%, #dfe9f4 60%, #e4ecf6 100%)',
        fontFamily: "'Poppins', sans-serif",
        transition: 'background 1s ease-in-out',
      }}
    >
      {/* Invisible Music Player that automatically triggers when flowers finish blooming or on interaction */}
      <MusicPlayer autoPlayTrigger={fireworksActive || envelopeVisible || envelopeOpened || hangoutVisible || spidermanVisible} />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full blur-[160px]"
          style={{ background: 'rgba(126, 180, 226, 0.15)' }}
        />
        <div
          className="absolute bottom-[15%] right-[15%] w-[20rem] h-[20rem] rounded-full blur-[120px]"
          style={{ background: 'rgba(168, 206, 237, 0.12)' }}
        />
      </div>

      {/* Bouquet — centered in viewport */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{ pointerEvents: bouquetFading ? 'none' : 'auto' }}
      >
        <BlueBouquet
          onComplete={handleBouquetComplete}
          fadeOut={bouquetFading}
        />
      </div>

      {/* Fireworks overlay */}
      <Fireworks
        active={fireworksActive}
        onComplete={handleFireworksComplete}
      />

      {/* Envelope — centered in viewport, appears with fireworks */}
      <Envelope
        visible={envelopeVisible && !hangoutVisible && !spidermanVisible}
        message={`Hii Yenniee!

Just wanted to say na congratulationss on defending your thesis 1!! 🥳 wala ka na magagawa gusto ko umepsi sa lahat ng nangyayari sa buhay mo HAHAHAHHAHAHAHA. Im just so happy for youu and syempre sa group nyo rin and alam ko naman from the get go madedefend nyo rin naman yan and guess what nasurvive mo nga yung kala mo nastuck ka na to but here you aree you’re one step ahead na going to thesis 2!! 

Di ko man nakikita yung mga frustrations mo, countless sleepless nights mo na nagpupuyat,anxiety or sometimes you are questiong yourself bakit nagka-ganito na di mo ma-ease yung mind mo pero try not to worryy or carry it out lahat take it one at a time kasi di ka naman bibigyan ng problems ni Lord na di mo kaya solusyunan tulad nyan tapos ka na with internship 1 and thesis 1 grabe how time flies sa loob lang ng 3 months hshshshshhss. May hindi ka man nasasabi sakin na problems or kinikimkim on yourself pero I’m prayingg for youu na all will be well for you at the right time🙏 kahit di naman tayo masyado nagkikita minsan but I will listen for you ano man yung rants mo or any problem you are dealing with without judgement whatsoever I really hope na you can consider me rin as one of your constant friends🥺

Just go outt there and do what makes you happy, that’s one of the traits I like about you din eh kasi you’re not afraid of constant change and always nag go-go outside the box bastaa kung saan ka masaya I’ll always be here to support you!! 🫶  

Ajaaa! Jo 💙✨`}
        onOpen={handleEnvelopeOpen}
        onNext={handleNextToHangout}
      />

      {/* Scene 5: Intermediate Hangout Question with GIF & Label */}
      <HangoutQuestion
        visible={hangoutVisible && !spidermanVisible}
        onNext={handleNextToSpiderman}
      />

      {/* Scene 6: Spider-Man VIP Movie Date Invitation */}
      <SpidermanInvite
        visible={spidermanVisible}
        onConfirm={handleSpidermanConfirm}
      />
    </main>
  );
}


