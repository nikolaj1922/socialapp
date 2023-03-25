import { useRef, useState } from "react";
import { XIcon } from "@heroicons/react/solid";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { db, storage } from "@/firebase";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";
import { ExtendedUserType } from "@/types/types";

const Input = () => {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useOnClickOutside(emojiRef, () => setShowEmojis(false));

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any[] = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  const handleAddImageToPost = (e: any) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target?.result as string);
    };
  };

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: (session?.user as ExtendedUserType).uid,
      username: session?.user?.name,
      userImg: session?.user?.image,
      tag: (session?.user as ExtendedUserType).tag,
      text: input,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const dowloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: dowloadURL,
        });
      });
    }

    setLoading(false);
    setInput("");
    setSelectedFile(null);
    setShowEmojis(false);
  };

  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 ${
        loading && "opacity-60"
      }`}
    >
      <img
        src={session?.user?.image as string}
        alt="Avatar"
        className="h-11 w-11 rounded-full cursor-pointer"
      />
      <div className="w-full divide-y divide-gray-700">
        <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
          <textarea
            value={input}
            className="w-full bg-transparent outline-none text-[#d9d9d9] text-lg tracking-wide min-h-[50px]"
            onChange={(e) => setInput(e.target.value)}
            placeholder="What`s happening?"
            rows={2}
          />
          {selectedFile && (
            <div className="relative">
              <div
                className="absolute w-8 h-8 bg-[#15181c]/75 hover:bg-[#272c26] rounded-full flex items-center justify-center top-1 left-1 cursor-pointer transition duration-200"
                onClick={() => setSelectedFile(null)}
              >
                <XIcon className="text-white h-5" />
              </div>
              <img
                src={selectedFile!}
                alt="Post image"
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => inputFileRef.current?.click()}
              >
                <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                <input
                  type="file"
                  className="hidden"
                  ref={inputFileRef}
                  onChange={handleAddImageToPost}
                />
              </div>
              <div className="icon rotate-90">
                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>
              <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
              </div>
              <div className="icon">
                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              {showEmojis && (
                <div className="absolute top-[178px]" ref={emojiRef}>
                  <Picker data={data} theme="dark" onEmojiSelect={addEmoji} />
                </div>
              )}
            </div>
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] 
            disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
              disabled={!input.trim() && !selectedFile}
              onClick={sendPost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
