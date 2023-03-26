import { ITrending } from "@/types/types";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import Image from "next/image";

const Trending = ({ result }: { result: ITrending }) => {
  return (
    <div className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-3 cursor-pointer transition duration-200 ease-out flex items-center justify-between">
      <div className="space-y-0.5 max-w-[65%]">
        <p className="text-[#6e767d] text-xs font-medium">{result.heading}</p>
        <h6 className="font-bold max-w-[250px] text-sm">
          {result.description}
        </h6>
        <p className="text-[#6e767d] text-xs font-medium max-w-[250px]">
          Trending with{" "}
          {result.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </p>
      </div>
      {result.img ? (
        <div className="relative h-[80px] w-[90px]">
          <Image
            src={result.img}
            alt="News pic"
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          />
        </div>
      ) : (
        <div className="icon group">
          <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
        </div>
      )}
    </div>
  );
};

export default Trending;
