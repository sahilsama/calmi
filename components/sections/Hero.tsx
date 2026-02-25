// import { Container } from "../ui/Container";

export const Hero = () => {
  return (
    <section className="bg-[#f5f5f3] pt-16 pb-24 text-center relative overflow-hidden">

      <Container>
        <h1 className="text-5xl md:text-7xl font-serif mb-16">
          Browse everything.
        </h1>

        <div className="relative flex justify-center">

          <div className="absolute w-[80%] h-[60%] bg-green-200 rounded-3xl bottom-0" />

          <img
            src="/dashboard.png"
            className="relative rounded-2xl shadow-2xl w-[900px]"
          />
        </div>

        <div className="mt-16 text-gray-400 text-sm">
          Trusted by
        </div>

    </section>
  );
};