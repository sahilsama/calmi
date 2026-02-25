import Benefits from "../sections/Benefits";
import { Accordion, AccordionItem } from "../sections/Accordian";
import ConnectWithUs from "../sections/ConnectWithUs";

type Props = {
  onStart: () => void;
};

export default function Landing({ onStart }: Props) {
  return (
    <section className="bg-[#f5f5f3] py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-neutral-900">
            A calm space to think, feel, and heal.
          </h1>
          <p className="text-neutral-600 mb-8">
            Your private AI companion powered by local Ollama. Designed for quiet reflection,
            gentle check-ins, and emotionally aware conversations that stay on your device.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center rounded-full bg-yellow-400 px-6 py-3 text-sm font-medium text-neutral-900 shadow-sm hover:bg-yellow-300 transition-colors"
          >
            Start talking →
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
          <div className="md:col-span-5">
            <Accordion defaultOpen="01">
              <AccordionItem
                id="01"
                title="Check in with yourself"
                description="Short, grounded conversations that start where you actually are."
              >
                Yellow opens with a warm, context-aware check-in based on your profile and
                recent sessions. It reflects your words back to you and gently nudges you
                into deeper clarity without feeling clinical.
              </AccordionItem>

              <AccordionItem
                id="02"
                title="Hold onto what matters"
                description="Session-aware memory keeps important threads from getting lost."
              >
                Each conversation is saved in a private local database. Yellow remembers
                themes, people, and patterns you’ve mentioned, so future chats can pick up
                where you left off instead of starting from zero.
              </AccordionItem>

              <AccordionItem
                id="03"
                title="Stay grounded, stay safe"
                description="Built-in safety checks for crisis language and escalation hints."
              >
                Messages are scanned for high-risk language. When needed, yellow pauses the
                regular flow and gently encourages real-world support like friends, family,
                or professional help, while reminding you that you matter.
              </AccordionItem>

              <AccordionItem
                id="04"
                title="Runs on your machine"
                description="Powered by Ollama, tuned for emotional conversations."
              >
                All generation happens locally through Ollama, so your words stay with you.
                You choose the model, and yellow wraps it in a therapist-like persona that
                is warm, reflective, and under 150 words per reply.
              </AccordionItem>
              <AccordionItem
                id="05"
                title="Runs on your machine"
                description="Powered by Ollama, tuned for emotional conversations."
              >
                All generation happens locally through Ollama, so your words stay with you.
                You choose the model, and Yellow wraps it in a therapist-like persona that
                is warm, reflective, and under 150 words per reply.
              </AccordionItem>
            </Accordion>
          </div>

          <div className="md:col-span-7">
            <div className="h-full rounded-3xl bg-[#f5f0e8] flex items-center justify-center p-6">
              <img
                src="/dashboard.png"
                alt="Yellow dashboard preview"
                className="w-full h-auto max-h-[480px] object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        <div id="benefits" className="mt-24">
          <Benefits />
        </div>

        <ConnectWithUs />
      </div>
    </section>
  );
}