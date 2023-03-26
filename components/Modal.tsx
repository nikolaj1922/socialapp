import { useAppDispatch, useAppSelector, closeModal } from "@/store";
import { ExtendedUserType, IPost } from "@/types/types";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  doc,
  DocumentData,
  onSnapshot,
  serverTimestamp,
  collection,
  updateDoc,
} from "firebase/firestore";
import { Fragment, useEffect, useState, useRef } from "react";
import { db, storage } from "@/firebase";
import PostHeader from "./PostHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { grey } from "@mui/material/colors";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMediaQuery } from "@mui/material";

export default function MyModal() {
  const { isOpen, postId } = useAppSelector((state) => state.modal);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [post, setPost] = useState<IPost | DocumentData | null>(null);
  const [comment, setComment] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const emojiIcon = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery("(max-width:640px)");

  useOnClickOutside(emojiRef, emojiIcon, () => setShowEmojis(false));

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any[] = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setComment(comment + emoji);
  };

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", postId), (snapshot) => {
        setPost(snapshot.data() as IPost);
      }),
    [db]
  );

  const handleAddImageToComment = (e: any) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target?.result as string);
    };
  };

  const sendComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts", postId, "comments"), {
      text: comment,
      id: (session?.user as ExtendedUserType).uid,
      username: session?.user?.name,
      userTag: (session?.user as ExtendedUserType).tag,
      userImg: session?.user?.image,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(
      storage,
      `/posts/${postId}/comments/${docRef.id}/image`
    );

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", postId, "comments", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setComment("");
    dispatch(closeModal());
    setLoading(false);
    router.push(`/${postId}`);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 pt-8"
        onClose={() => dispatch(closeModal())}
      >
        <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`relative inline-block align-bottom bg-black rounded-2xl text-left  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full ${
                loading && "bg-neutral-900"
              }`}
            >
              {loading && (
                <>
                  <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-50">
                    <CircularProgress sx={{ color: grey[600] }} />
                  </div>
                </>
              )}
              <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                <div
                  className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                  onClick={() => dispatch(closeModal())}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
              </div>
              <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <div className="text-[#6e767d] flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                    <img
                      src={post?.userImg}
                      alt="Profile pic"
                      className="h-11 w-11 rounded-full"
                    />
                    <PostHeader post={post!} />
                  </div>

                  <div className="mt-7 flex space-x-3 w-full">
                    <img
                      src={session?.user?.image!}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div className="flex-grow mt-2">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tweet your reply"
                        rows={2}
                        className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                      />
                      {selectedFile && (
                        <div className="relative max-w-[90%]">
                          <div
                            className="absolute w-8 h-8 bg-[#15181c]/75 hover:bg-[#272c26] rounded-full flex items-center justify-center top-1 left-1 cursor-pointer transition duration-200"
                            onClick={() => setSelectedFile(null)}
                          >
                            <XIcon className="text-white h-5" />
                          </div>
                          <img
                            src={selectedFile!}
                            alt="Post image"
                            className="rounded-md max-h-80 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between py-2.5">
                        <div className="flex items-center">
                          <div
                            className="icon"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input
                              type="file"
                              className="hidden"
                              ref={fileInputRef}
                              accept=".png,.svg,.web,.jpg,.jpeg"
                              onChange={handleAddImageToComment}
                            />
                            <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
                          </div>

                          <div className="icon rotate-90">
                            <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                          </div>
                          {!isMobile && (
                            <div
                              className="icon relative"
                              onClick={() => setShowEmojis(!showEmojis)}
                              ref={emojiIcon}
                            >
                              <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                              {showEmojis && (
                                <div
                                  className="absolute top-10 -left-20"
                                  ref={emojiRef}
                                >
                                  <Picker
                                    data={data}
                                    theme="dark"
                                    onEmojiSelect={addEmoji}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                          <div className="icon">
                            <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                          </div>
                        </div>
                        <button
                          className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                          type="submit"
                          onClick={sendComment}
                          disabled={!comment.trim() && !selectedFile}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
