const Benefits = () => {
  return (
    <section id="benefits" className="bg-[#f5f5f3]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top divider */}
        <div className="border-t border-neutral-300 mb-16" />
        {/* Label */}
        <p className="text-sm text-neutral-500 mb-8 text-left">Benefits</p>

        {/* Heading + paragraph */}
        <div className="grid md:grid-cols-12 gap-y-6 md:gap-x-12">
          <h2 className="md:col-span-12 font-serif text-4xl md:text-6xl leading-[1.1] tracking-tight text-left">
            We got your yapping.
          </h2>

          <p className="md:col-span-5 text-gray-600 text-lg max-w-md mb-20 text-left">
            Yellow provides real insights, without any limits and No data leaks.
          </p>
        </div>

        {/* Middle divider */}
        {/* <div className=" mt-20 mb-14" /> */}
        {/* <div className="border-t border-neutral-200 mt-20 mb-14" /> */}

        {/* Benefit cards */}
        <div className="grid md:grid-cols-12 gap-y-12 md:gap-x-12">
          {/* Card 1 */}
          <div className="md:col-span-3 border-t border-neutral-200 pt-6 text-left">
            <div className="mb-4 text-xl">📊</div>
            <h3 className="font-medium mb-2">Amplify Insights</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Unlock data-driven decisions with comprehensive analytics,
              revealing key opportunities for strategic regional growth.
            </p>
          </div>

          {/* Card 2 */}
          <div className="md:col-span-3 border-t border-neutral-200 pt-6 text-left">
            <div className="mb-4 text-xl">🌍</div>
            <h3 className="font-medium mb-2">Control Your Global Presence</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manage and track satellite offices, ensuring consistent
              performance and streamlined operations everywhere.
            </p>
          </div>

          {/* Card 3 */}
          <div className="md:col-span-3 border-t border-neutral-200 pt-6 text-left">
            <div className="mb-4 text-xl">👥</div>
            <h3 className="font-medium mb-2">Remove Language Barriers</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Adapt to diverse markets with built-in localization for clear
              communication and enhanced user experience.
            </p>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-3 border-t border-neutral-200 pt-6 text-left">
            <div className="mb-4 text-xl">📈</div>
            <h3 className="font-medium mb-2">Visualize Growth</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Generate precise, visually compelling reports that illustrate your
              growth trajectories across all regions.
            </p>
          </div>
          
        </div>
      <div className="justify-center items-center mt-10 ml-5 ">
        <img src="heroimage.jpg" alt="" className="rounded-2xl shadow-2xl"/>
      </div>
      </div>
        <div className="border-t border-neutral-300 mt-16 mb-10" />
    </section>
  );
};

export default Benefits;
