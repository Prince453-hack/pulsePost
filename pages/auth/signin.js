import { getProviders, signIn } from "next-auth/react";

export default function signin({ providers }) {
  console.log(providers);
  return (
    <>
      <h1 className="text-white text-[40px] font-extrabold text-center mb-[100px] mt-4 md:text-[67px]">
        Happening now !!
      </h1>
      <div className="text-white flex justify-center mt-20 space-x-12">
        <img
          src="/phone.png"
          alt="phone-image"
          className="hidden md:inline-flex object-cover md:w-50 md:h-96 rotate-6 rounded-lg"
        />
        <div className="">
          {Object.values(providers).map((provider) => (
            <div
              className="flex flex-col items-center justify-center"
              key={provider.name}
            >
              <img src="/23.png" alt="logo" className="w-36 object-cover" />
              <p className="text-center text-sm italic my-8 text-gray-400">
                This app is created for Project Purposes
              </p>
              <button
                className="bg-white brightness-95 rounded-full p-3 text-black hover:brightness-105"
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
