type Props = {
  onClick?: () => void;
};

export default function ConnectWithUs({ onClick }: Props) {
  return (
    <section className="mt-20  pt-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-serif text-neutral-900">
            Want to connect with us?
          </h2>
          <p className="mt-2 text-sm text-neutral-600 max-w-md">
            Share feedback, ideas, or integration plans. We&apos;d love to hear how you&apos;re
            using Calmi and where it could support you better.
          </p>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center rounded-full bg-yellow-400 px-6 py-3 text-sm font-medium text-black shadow-sm hover:bg-white hover:text-yellow-400 transition-colors"
        >
          Connect with us
        </button>
      </div>
    </section>
  );
}

