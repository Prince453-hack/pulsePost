import { db, storage } from "@/firebase";
import {
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSession, signOut } from "next-auth/react";
import { useRef, useState } from "react";

export default function Input() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const filePickerRef = useRef(null);

  const sendPost = async (e) => {
    if (loading) return;
    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session?.user?.uid,
      text: input,
      userImg: session?.user?.image,
      timestamp: serverTimestamp(),
      name: session?.user?.name,
      usernames: session?.user?.username,
    });

    const imageRef = ref(storage, `posts/"${docRef.id}/image`);
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile(null);
    setLoading(false);
  };

  const addImageRef = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <>
      {session && (
        <div className="flex border-b border-gray-700 p-3 space-x-3">
          <img
            onClick={signOut}
            src={session?.user?.image}
            alt="Profile"
            className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
          />
          <div className="w-full divide-y divide-gray-800">
            <div className="">
              <textarea
                rows={2}
                placeholder="What's Happening..?"
                className="w-full border-none focus:ring-0 text-md placeholder:text-gray-600 tracking-wide min-h-[50px] resize-none rounded-sm bg-black"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            {selectedFile && (
              <div className="relative mr-16 rounded-md mb-2">
                <XMarkIcon
                  className="h-7 cursor-pointer text-white absolute top-1 right-1"
                  onClick={() => setSelectedFile(null)}
                />
                <img
                  src={selectedFile}
                  alt="uploaded-image"
                  className={`rounded-md ${loading && "animate-pulse"}`}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-2.5">
              {!loading && (
                <>
                  <div className=" flex">
                    <div>
                      <PhotoIcon
                        className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100"
                        onClick={() => filePickerRef?.current?.click()}
                      />
                      <input
                        type="file"
                        ref={filePickerRef}
                        onChange={addImageRef}
                        accept="image/*"
                        hidden
                      />
                    </div>
                    <FaceSmileIcon className="h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                  </div>
                  <button
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                    disabled={!input.trim()}
                    onClick={sendPost}
                  >
                    Tweet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
