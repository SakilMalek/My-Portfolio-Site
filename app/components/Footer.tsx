import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image"
import { socialMedia } from "@/data";
import MagicButton from "../components/ui/MagicButton";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative w-full pt-20 pb-10 overflow-hidden" id="contact">
      {/* background grid */}
      <div className="absolute left-0 bottom-0 w-full h-64 sm:h-80 md:h-96 pointer-events-none z-0">
        <Image
          src="/footer-grid.svg"
          alt="grid"
          fill
          className="object-cover opacity-40"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-sm sm:text-base">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <Link href="mailto:maleksameer528@gmail.com">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </Link>
      </div>

      <div className="relative z-10 flex mt-16 md:flex-row flex-col justify-between items-center px-4 gap-4">
        <p className="md:text-base text-sm md:font-normal font-light text-center">
          Copyright © 2025 Malek Sakil
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <Link
              key={info.id}
              href={info.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <Image src={info.img} alt="icons" width={20} height={20} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
